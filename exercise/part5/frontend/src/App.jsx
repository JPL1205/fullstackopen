import { useState, useEffect } from 'react';
// import axios from 'axios';
import Note from './components/Note';
import Notification from './components/Notification';
import Footer from './components/Footer';

import noteService from './services/notes';
import loginService from './services/login';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      const notes = await noteService.getAll();
      setNotes(notes);
    };
    fetchNote();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

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
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id != id));
      });

    console.log(`importance of ${id} needs to be toggled`);
  };

  const addNote = (event) => {
    event.preventDefault();
    // console.log('button clicked', event.target);
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      console.log(user);

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));

      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      console.log('logging in with', username, password);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  );

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      )}

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

      {user !== null && <button onClick={handleLogOut}>logout</button>}

      <Footer />
    </div>
  );
};

export default App;
