import express from 'express'
import * as db from './database.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 8080

app.use(express.json())

// statikus fájlokat ebből a mappából szolgáljuk ki (pl. index.html, script.js)
app.use(express.static(__dirname))

// === API végpontok ===

app.get('/blogok', (req, res) => {
  try {
    const blogok = db.getBlogok()
    res.status(200).json(blogok)
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})
app.get('/blogok/:id', (req, res) => {
  try {
    const blog = db.getBlog(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog nem található' })
    }
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})


app.post('/blogok', (req, res) => {
  try {
    const { szerzo, cim, kategoria, tartalom } = req.body
    if (!szerzo || !cim || !kategoria || !tartalom) {
      return res.status(400).json({ message: 'Hiányzó adat' })
    }

    const saved = db.saveBlog(szerzo, cim, kategoria, tartalom)
    res.status(201).json({ id: saved.lastInsertRowid, szerzo, cim, kategoria, tartalom })
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})
app.put('/blogok/:id', (req, res) => {
  try {
    const { szerzo, cim, kategoria, tartalom } = req.body
    if (!szerzo || !cim || !kategoria || !tartalom) {
      return res.status(400).json({ message: 'Hiányzó adat' })
    }
    const id = +req.params.id
    const updated = db.updateBlog(id, szerzo, cim, kategoria, tartalom)
    if (updated.changes !== 1) {
      return res.status(404).json({ message: 'Blog nem található vagy nem frissült' })
    }
    res.status(200).json({ id, szerzo, cim, kategoria, tartalom })
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})
app.delete('/blogok/:id', (req, res) => {
  try {
    const deleted = db.deleteBlog(req.params.id)
    if (deleted.changes !== 1) {
      return res.status(404).json({ message: 'Blog nem található vagy nem törölhető' })
    }
    res.status(200).json({ message: 'Törlés sikeres' })
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`)
})
