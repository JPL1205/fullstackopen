import Note from './components/Note';

const App = ({ notes }) => {
  // const tmp = notes.map((note, i) => {
  //   console.log(note.content, i);
  // });

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>
    </div>
  );
};

export default App;
