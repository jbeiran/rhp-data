import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CreditAgent() {
  const { code } = useParams();
  const [creditAgents, setCreditAgents] = useState([]);

  const [editing, setEditing] = useState(null)

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [modifiedRows, setModifiedRows] = useState([]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  }

  const toggleEditMode = (id) => {
    if (editing === id) {
      setEditing(null);
    } else {
      setEditing(id);
    }
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedCreditAgents = [...creditAgents];
    updatedCreditAgents[index][name] = value;
    setCreditAgents(updatedCreditAgents);
  };

  const updateCreditAgent = async (credit_agent_id) => {
    const updatedCreditAgent = creditAgents.find((creditAgent) => creditAgent.credit_agent_id === credit_agent_id);
    try {
      await axios.put(`/api/credit_agent/${credit_agent_id}`, updatedCreditAgent);
      setEditing(null);
    } catch (error) {
      console.error('Error updating credit agent:', error);
    }
  };

  useEffect(() => {
    const fetchCreditAgents = async () => {
      try {
        const response = await axios.get(`/api/credit_agent/${code}`);
        setCreditAgents(response.data);
      } catch (error) {
        console.error('Error fetching credit agents:', error);
      }
    };

    fetchCreditAgents();
  }, [code]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = creditAgents.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(creditAgents.length / rowsPerPage);


  return (
    <div style={{ marginTop: "50px" }} className="agents">

      <h1
        style={{
          textAlign: "center",
          fontSize: "30px",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: "black",
          padding: "10px",
          width: "100%",
          margin: "auto",
          marginBottom: "20px"

        }}>Crédito Agente: {code}</h1>
      <table className="receipts_table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Pagado</th>
            <th style={{ textAlign: "center" }}>Codigo</th>
            <th style={{ textAlign: "center" }}>Data</th>
            <th style={{ textAlign: "center" }}>€ Euro</th>
            <th style={{ textAlign: "center" }}>Prodotto</th>
            <th style={{ textAlign: "center" }}>Costo</th>
            <th style={{ textAlign: "center" }}></th>
          </tr>
        </thead>
        <tbody>
        
        </tbody>
      </table>
    </div>
  );
}

export default CreditAgent;