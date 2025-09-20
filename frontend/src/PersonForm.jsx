const PersonForm = ({handleNameChange, handleNumberChange, newName, newNumber, addName}) => {
    return (
    <div>
        <form onSubmit={addName}>
        <div>
          name: <input value={newName} id="nameInput" onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} id="numberInput" onChange={handleNumberChange} />
        </div>
        <div>
          <button id="add" type="submit">add</button>
        </div>
      </form>
    </div>
    )
}

export default PersonForm;