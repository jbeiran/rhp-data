import React, { useState, useEffect } from 'react';
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

  //const [editing, setEditing] = useState(null)
  
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


  return (
    <div style={{ marginTop: "50px" }} className="clients">
      <h1>Crédito Cliente: {code}</h1>

      <table className="credit-client-table">
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
            creditClients.map((creditClient) => (
              <tr key={creditClient.credit_client_id}>
                <td style={{ textAlign: "center" }}>{formatDate(creditClient.data)}</td>
                <td style={{ textAlign: "center" }}>{creditClient.esatto}</td>
                <td style={{ textAlign: "center" }}>{creditClient.prodotto}</td>
                <td style={{ textAlign: "center" }}>{creditClient.costo}</td>
                <td>
                    <button className="btn btn-edit">
                      Edit
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
      </table>
    </div>
  );
}

export default CreditClient;