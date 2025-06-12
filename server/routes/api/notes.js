const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//app.use(express.json());

// Helper: Read notes from file
function readNotes() {
  try {
    if (!fs.existsSync('notes.json')) {
      fs.writeFileSync('notes.json', '[]');
    }
    const data = fs.readFileSync('notes.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
}

// Helper: Write notes to file
function writeNotes(notes) {
  fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
}

// Create a new note
router.post('/notes', (req, res) => {
  const notes = readNotes();
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ message: 'Note is required' });
  }
try {
  const newNote = { id: uuidv4(), note };
  notes.push(newNote);
  writeNotes(notes);

  res.status(201).json(newNote);
} catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Get all notes
router.get('/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

//Get notes by Id
router.get('/notes/:id',(req,res)=>{
 const notes = readNotes();
  const noteIndex = notes.findIndex(note => note.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Id not found' });
  }

  const { note } = req.body;
 
  res.json(notes[noteIndex]);

});

// Update a note by ID
router.put('/notes/:id', (req, res) => {
  const notes = readNotes();
  const noteIndex = notes.findIndex(note => note.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Id not found' });
  }

  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ message: 'Note is required to update' });
  }

  notes[noteIndex].note = note;
  writeNotes(notes);

  res.json(notes[noteIndex]);
});

// Delete a note by ID
router.delete('/notes/:id', (req, res) => {
  const notes = readNotes();
  const noteIndex = notes.findIndex(note => note.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Id not found' });
  }

  const deletedNote = notes.splice(noteIndex, 1)[0];
  writeNotes(notes);

  return res.status(200).json({ message: 'Note Deleted Successfully' });
});

module.exports = router;
