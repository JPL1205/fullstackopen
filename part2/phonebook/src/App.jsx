import { useState } from 'react';

const Filter = ({ name, handleChange }) => {
  return (
    <div>
      filter shown with
      <input value={name} onChange={handleChange} />
    </div>
  );
};

const PersonForm = ({ submit, name, number, nameChange, numberChange }) => {
  return (
    <form onSubmit={submit}>
      <div>
        name: <input value={name} onChange={nameChange} />
      </div>
      <div>
        number:
        <input value={number} onChange={numberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ list }) => {
  return list.map((p) => (
    <div key={p.name}>
      {p.name} {p.number}
    </div>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (e) => {
    console.log(e.target.value);

    const value = e.target.value;
    const isValid = /^[\d+-]*$/.test(value); // allows digits, +, and -

    if (!isValid) {
      alert('only allow number or -');
      return;
    }
    setNewNumber(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const exist = persons.some((p) => p.name === newName);

    if (exist) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    setNewName('');
    setNewNumber('');

    setPersons(persons.concat(personObject));
  };

  const personsDisplays =
    searchName === ''
      ? persons
      : persons.filter((p) => p.name.toLowerCase().includes(searchName));
  console.log(personsDisplays);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter name={searchName} handleChange={handleSearchNameChange} />
      <h2>add a new</h2>
      <PersonForm
        submit={handleSubmit}
        name={newName}
        number={newNumber}
        nameChange={handleNameChange}
        numberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons list={personsDisplays} />
    </div>
  );
};

export default App;
