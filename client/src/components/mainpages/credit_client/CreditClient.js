import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import { Link } from 'react-router-dom';

function CreditClient() {
  const { code } = useParams();
  const [creditClients, setCreditClients] = useState([]);

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
    return creditClients.reduce((total, client) => total + parseFloat(client.exact || 0), 0);
  }, [creditClients]);

  const totalCosto = useMemo(() => {
    return creditClients.reduce((total, client) => total + parseFloat(client.costo || 0), 0);
  }, [creditClients]);

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
    const updatedCreditClients = [...creditClients];
    updatedCreditClients[index][name] = value;
    setCreditClients(updatedCreditClients);
  };

  const updateCreditClient = async (credit_client_id) => {
    const updatedCreditClient = creditClients.find((creditClient) => creditClient.credit_client_id === credit_client_id);
    try {
      await axios.put(`/api/credit_client/${credit_client_id}`, updatedCreditClient);
      setEditing(null);
    } catch (error) {
      console.error('Error updating credit client:', error);
    }
  };

  useEffect(() => {
    const fetchCreditClients = async () => {
      try {
        const response = await axios.get(`/api/credit_client/${code}`);
        setCreditClients(response.data);
      } catch (error) {
        console.error('Error fetching credit clients:', error);
      }
    };

    fetchCreditClients();
  }, [code]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = creditClients.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(creditClients.length / rowsPerPage);

  return (
    <div style={{ marginTop: "50px" }} className="clients">
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

        }}>Crédito Cliente: {code}</h1>

      <table className="credit-client-table" >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Data</th>
            <th style={{ textAlign: "center" }}>Euro</th>
            <th style={{ textAlign: "center" }}>Prodotto</th>
            <th style={{ textAlign: "center" }}>Costo</th>
            <th style={{ textAlign: "center" }}></th>
          </tr>
        </thead>
        <tbody>
          {
            currentRows.map((creditClient, index) => (
              <tr key={creditClient.credit_client_id}>
                <td style={{ textAlign: "center" }}>{formatDate(creditClient.dates)}</td>
                <td style={{ textAlign: "center" }}>{creditClient.exact}</td>
                <td style={{ textAlign: "center" }}>
                  {editing === creditClient.credit_client_id ? (
                    <input
                      type="text"
                      name="prodotto"
                      value={creditClient.prodotto}
                      onChange={(event) => handleInputChange(event, index)}
                    />
                  ) : (
                    creditClient.prodotto
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  {editing === creditClient.credit_client_id ? (
                    <input
                      type="text"
                      name="costo"
                      value={creditClient.costo}
                      onChange={(event) => handleInputChange(event, index)}
                    />
                  ) : (
                    creditClient.costo
                  )}
                </td>
                <td>
                  <button className="btn btn-edit"
                    onClick={() => {
                      if (editing === creditClient.credit_client_id) {
                        updateCreditClient(creditClient.credit_client_id)
                      }
                      toggleEditMode(creditClient.credit_client_id)
                    }}
                  >
                    {editing === creditClient.credit_client_id ? 'Save' : 'Edit'}
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

        <tfoot style={{ textAlign: "center"}}>
          <tr>
            <td colSpan="3" style={{ textAlign: "right" }}>Total</td>
            <td style={{ textAlign: "center" }}>€ {totalEuro - totalCosto}</td>
            <td></td>
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

    </div>
  );
}

export default CreditClient;