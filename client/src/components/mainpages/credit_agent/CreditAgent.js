import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CreditAgent() {
  const { code } = useParams();
  const [creditAgents, setCreditAgents] = useState([]);

  const [tempChecked, setTempChecked] = useState(null);


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

  const totalEuro = useMemo(() => {
    return creditAgents.reduce((total, client) => total + parseFloat(client.exact || 0), 0);
  }, [creditAgents]);

  const totalCosto = useMemo(() => {
    return creditAgents.reduce((total, client) => {
      if (client.ok) {
        return total + parseFloat(client.costo || 0);
      } else {
        return total;
      }
    } , 0);
  }, [creditAgents]);

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

    if (tempChecked !== null) {
      updatedCreditAgent.ok = tempChecked;
      setTempChecked(null);
    }

    try {
      await axios.put(`/api/credit_agent/${credit_agent_id}`, updatedCreditAgent);
      setEditing(null);
    } catch (error) {
      console.error('Error updating credit agent:', error);
    }
  };

  const handleCheckboxChange = (event, index) => {
    if (editing === creditAgents[index].credit_agent_id) {
      const updatedCreditAgents = [...creditAgents];
      updatedCreditAgents[index].ok = event.target.checked;
      setCreditAgents(updatedCreditAgents);
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
          {currentRows.map((creditAgent, index) => (
            <tr key={creditAgent.credit_agent_id}>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={creditAgent.ok}
                  onChange={(event) => handleCheckboxChange(event, index)}
                  disabled={editing !== creditAgent.credit_agent_id} // Modifica esta línea
                />
              </td>
              <td style={{ textAlign: "center" }}>

              </td>
              <td style={{ textAlign: "center" }}>
                {formatDate(creditAgent.dates)}
              </td>
              <td style={{ textAlign: "center" }}>
                {creditAgent.exact}
              </td>
              <td style={{ textAlign: "center" }}>
                {editing === creditAgent.credit_agent_id ? (
                  <input
                    type="text"
                    name="prodotto"
                    value={creditAgent.prodotto || ''}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                ) : (
                  creditAgent.prodotto
                )}
              </td>
              <td style={{ textAlign: "center" }}>
                {editing === creditAgent.credit_agent_id ? (
                  <input
                    type="text"
                    name="costo"
                    value={creditAgent.costo || ''}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                ) : (
                  creditAgent.costo
                )}
              </td>


              <td>
                <button className="btn btn-edit"
                  onClick={() => {
                    if (editing === creditAgent.credit_agent_id) {
                      updateCreditAgent(creditAgent.credit_agent_id)
                    }
                    toggleEditMode(creditAgent.credit_agent_id)
                  }}
                >
                  {editing === creditAgent.credit_agent_id ? 'Save' : 'Edit'}
                </button>

                {/*<Link>
                      <button
                        className="btn btn-delete"
                      >
                        Elimina
                      </button>
                    </Link>*/}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot style={{ textAlign: "center" }}>
          <tr>
            <td colSpan="3" style={{ textAlign: "right" }}>Pagado</td>
            <td style={{ textAlign: "center" }}>€ {totalEuro}</td>
            <td style={{ textAlign: "right" }}>Resto</td>
            <td style={{ textAlign: "center" }}>€ {totalEuro - totalCosto}</td>
          </tr>
        </tfoot>
      </table>

      <div className="pagination">
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="current-page">{currentPage}</span>
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div >
  );
}

export default CreditAgent;