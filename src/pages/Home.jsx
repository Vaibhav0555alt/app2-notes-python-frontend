import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

export default function Home() {
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState({ title: "", content: "", tag: "" })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => { fetchNotes() }, [])

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes")
      setNotes(res.data)
    } catch (err) {
      setError("Failed to fetch notes")
    }
  }

  const saveNote = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.put("/notes/" + editing, form)
        setEditing(null)
      } else {
        await api.post("/notes", form)
      }
      setForm({ title: "", content: "", tag: "" })
      fetchNotes()
    } catch (err) {
      setError("Failed to save note")
    }
  }

  const deleteNote = async (id) => {
    try {
      await api.delete("/notes/" + id)
      fetchNotes()
    } catch (err) {
      setError("Failed to delete note")
    }
  }

  const logout = () => { localStorage.clear(); navigate("/login") }

  return (
    <div>
      <nav>
        <span>Notes App</span>
        <div>
          <span style={{marginRight:"16px"}}>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="container">
        {error && <div className="error">{error}</div>}
        <div className="card">
          <h2>{editing ? "Edit Note" : "Add New Note"}</h2>
          <form onSubmit={saveNote}>
            <input type="text" placeholder="Note title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <textarea placeholder="Note content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} required />
            <input type="text" placeholder="Tag (optional)" value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} />
            <button className="btn btn-primary" type="submit">{editing ? "Update" : "Add Note"}</button>
            {editing && <button className="btn" type="button" onClick={() => {setEditing(null); setForm({title:"",content:"",tag:""})}} style={{background:"#64748b",color:"white",marginLeft:"8px"}}>Cancel</button>}
          </form>
        </div>
        <h2 style={{marginBottom:"16px"}}>My Notes ({notes.length})</h2>
        {notes.map(note => (
          <div key={note.id || note._id} className="card">
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <h3>{note.title}</h3>
                <p style={{color:"#475569",marginTop:"8px"}}>{note.content}</p>
                {note.tag && <span style={{background:"#e0e7ff",color:"#4f46e5",padding:"2px 8px",borderRadius:"12px",fontSize:"12px",marginTop:"8px",display:"inline-block"}}>#{note.tag}</span>}
              </div>
              <div style={{display:"flex",gap:"8px",marginLeft:"16px"}}>
                <button className="btn btn-primary" onClick={() => {setEditing(note.id || note._id); setForm({title:note.title,content:note.content,tag:note.tag||""})}} style={{fontSize:"12px",padding:"6px 12px"}}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteNote(note.id || note._id)} style={{fontSize:"12px",padding:"6px 12px"}}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
