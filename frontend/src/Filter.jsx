const Filter = ({handleFilterChange, filter}) => {
    return (
    <div>
        filter shown with a <input value={filter} id="filterInput" onChange={handleFilterChange} />
    </div>
    )
}

export default Filter;