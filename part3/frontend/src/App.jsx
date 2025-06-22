import { useState, useEffect } from 'react';

import phonebookServices from './services/phonebook';

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

const Persons = ({ list, handleDelete }) => {
  return list.map((p) => {
    // console.log(p.id);
    return (
      <div key={p.id}>
        {p.name} {p.number}{' '}
        <button onClick={(e) => handleDelete(e, p.id, p.name)}>delete</button>
      </div>
    );
  });
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="add">{message}</div>;
};

const Error = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null;
  }
  return <div className="error">{errorMessage}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');

  const [addMessage, setAddMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log('effect');
    phonebookServices.getAll().then((returnData) => {
      console.log(returnData);
      setPersons(returnData);
    });
  }, []);

  console.log(persons);

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
    const name = newName;

    if (exist) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const replacePerson = {
          name: newName,
          number: newNumber,
        };

        const id = persons.find((p) => p.name === newName).id;

        phonebookServices.update(id, replacePerson).then((returnPerson) => {
          setPersons(persons.map((p) => (p.id === id ? returnPerson : p)));
          setNewName('');
          setNewNumber('');
        });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      phonebookServices
        .create(personObject)
        .then((returnData) => {
          setPersons(persons.concat(returnData));
          setNewName('');
          setNewNumber('');

          setAddMessage(`Added ${name}`);
          setTimeout(() => {
            setAddMessage(null);
          }, 3000);
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };

  const handleDelete = (event, id, name) => {
    event.preventDefault();

    if (window.confirm(`delete ${name} ?`)) {
      phonebookServices
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id != id));
        })
        .catch(() => {
          console.log('failed to delete');
          setErrorMessage(
            `Information of ${name} has already been removed from server`
          );

          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        })
        .then(() => {
          phonebookServices.getAll().then((returnData) => {
            setPersons(returnData);
          });
        });
    }
  };

  const personsDisplays =
    searchName === ''
      ? persons
      : persons.filter((p) => p.name.toLowerCase().includes(searchName));
  console.log(personsDisplays);

  return (
    <div>
      <h2>Phonebook</h2>
      <Error errorMessage={errorMessage} />
      <Notification message={addMessage} />
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
      <Persons list={personsDisplays} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
