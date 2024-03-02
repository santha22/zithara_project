import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedBy, setSortedBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/getAllRecords');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
        setOriginalData(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();

  }, [sortedBy]);

  useEffect(() => {
    // Filter data based on search term
    const filteredData = originalData.filter(item =>
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setData(filteredData);

  }, [searchTerm, originalData]);


  const sortData = (sortBy) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const dateA = new Date(a.created_at_timestamp);
      const dateB = new Date(b.created_at_timestamp);
      const timeA = a.created_at_time.toLowerCase();
      const timeB = b.created_at_time.toLowerCase();
      
      if (sortBy === 'date') {
        return dateA - dateB;
      }
      else if (sortBy === 'time') {
        return timeA.localeCompare(timeB);
      }
      return 0;
    });
  
    setData(sortedData);
    setSortedBy(sortBy);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or location"
        value={searchTerm}
        onChange={handleSearch}
      />

      <button onClick={() => sortData('date')}>Sort by Date</button>
      <button onClick={() => sortData('time')}>Sort by Time</button>
      

      <table>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((itemData) => (
            <tr key={itemData.sno}>
              <td>{itemData.sno}</td>
              <td>{itemData.customer_name}</td>
              <td>{itemData.age}</td>
              <td>{itemData.phone}</td>
              <td>{itemData.location}</td>
              <td>{itemData.created_at_time}</td>
              <td>{formatDate(itemData.created_at_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='container' style={{display: "flex",justifyContent: 'center', margin: "10px", gap: "10px"}}>
        {Array.from({ length: Math.ceil(data.length / recordsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
