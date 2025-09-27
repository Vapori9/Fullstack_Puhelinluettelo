import { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios'
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import personService from './services/persons';
import Notification from './Notification'
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect( () => {
      personService.getAll().then(response => {
        setPersons(response.data);
      })
    }, []) 

  
  const setNotificationMessage = (message, type) => {

    setMessage(message);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000)
  }

  
  const addName = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.map(person => person.name).includes(newPerson.name)) {
      if (confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        // Get the id of the person who has the name that is being added
        const personId = persons.filter(person => person.name === newPerson.name)[0].id;
        
        personService.update(personId, newPerson).then(response => {
          const newPersons = [... persons];

          // Get the index of the person in the array with personId
          newPersons.at(persons.map(person => person.id).indexOf(personId)).number = newNumber
          setPersons(newPersons);
          setNewName("");
          setNewNumber("");
          setNotificationMessage(`Updated number for ${newPerson.name}`, "success");
        })
        .catch(error => {
          setNotificationMessage(`Information of ${newPerson.name} has already been removed from the server`, "error");
        })

      }
      return;
    }
    personService.create(newPerson).then(response => {
      setPersons([... persons].concat(response.data));
      setNewName("");
      setNewNumber("");
      setNotificationMessage(`Added ${newPerson.name}`, "success");

    })
    .catch(error => {
      console.log(error)
      setNotificationMessage(`${error.response.data.error}`, "error");
    })

    
  }

  const deleteName = (id, name) => {
    if (confirm(`delete ${name} ?`)) {
      personService.deletePerson(id).then(response => {
      setPersons([... persons].filter(person => person.id !== id));
      setNotificationMessage(`Deleted ${name}`, "success");
      })
    }

    


  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType}/>
      <Filter handleFilterChange={handleFilterChange} filter={filter}/>

      <h2>add a new</h2>
      <PersonForm 
      handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
      newName={newName} newNumber={newNumber} addName={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deleteName = {deleteName}/>
    </div>
  )

}

export default App

