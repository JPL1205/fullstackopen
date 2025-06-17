import { useState, useEffect } from 'react';
// import axios from 'axios';
import Note from './components/Note';
import Notification from './components/Notification';
import Footer from './components/Footer';

import noteService from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('some error happen...');

  useEffect(() => {
    noteService.getAll().then((initialNotes) => setNotes(initialNotes));
  }, []);

  //   useEffect(() => {
  //     console.log('effect');
  //     axios.get('http://localhost:3001/notes').then((res) => {
  //       console.log('promise fulfilled');
  //       setNotes(res.data);
  //     });
  //   }, []);

  //   const hook = () => {
  //     console.log('effect');
  //     axios.get('http://localhost:3001/notes').then((res) => {
  //       console.log('promise fulfilled');
  //       setNotes(res.data);
  //     });
  //   };

  //   useEffect(hook, []);

  console.log('render', notes.length, 'notes');

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    // const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changeNote = { ...note, important: !note.important };

    noteService
      .update(id, changeNote)
      .then((returnedNote) => {
        setNotes(notes.map((n) => (n.id === id ? returnedNote : n)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id != id));
      });

    // axios.put(url, changeNote).then((res) => {
    //   setNotes(notes.map((n) => (n.id === id ? res.data : n)));
    // });
    console.log(`importance of ${id} needs to be toggled`);
  };

  const addNote = (event) => {
    event.preventDefault();
    // console.log('button clicked', event.target);
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      //   id: String(notes.length + 1),
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    });

    // axios.post('http://localhost:3001/notes', noteObject).then((res) => {
    //   console.log(res);
    //   setNotes(notes.concat(res.data));
    //   setNewNote('');
    // });
    // setNotes(notes.concat(noteObject));
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  //   console.log(notesToShow);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'all' : 'important'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>

      <Footer />
    </div>
  );
};

export default App;
