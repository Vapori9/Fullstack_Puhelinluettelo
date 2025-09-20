const Persons = ({persons, filter, deleteName}) => {
    // styling is used to make the paragraph inline so the button appears on the right side of the paragraph instead
        // of under the paragraph
    return (
    <div>
        {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => 
        <div key={person.name}>
            <p style={{ display: "inline", marginRight: "8px"}}>{person.name} {person.number}</p>
            <button onClick={() => deleteName(person.id, person.name)}>delete</button>
        </div>)}
    </div>
    )
}

export default Persons;