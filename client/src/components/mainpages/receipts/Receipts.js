import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import { PaymentMethod } from './PaymentMethod'

function Receipts() {
  const state = useContext(GlobalState)
  const [receipts, setReceipts] = state.receiptsAPI.receipts

  const [editing, setEditing] = useState(null)
  const [editableReceipts, setEditableReceipts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [modifiedRows, setModifiedRows] = useState([]);

  const isClientCode = (code) => {
    if (code.startsWith('C')) return true;

    return false;
  }

  const isAgentCode = (code) => {
    if (code.startsWith('A')) return true;
    
    return false;
  }

  //console.log(receipts)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  }

  const handleEdit = (receiptId) => {
    if (editing === receiptId) {
      const receiptToUpdate = editableReceipts.find(receipt => receipt.receipt_id === receiptId);
      const originalReceipt = receipts.find(receipt => receipt.receipt_id === receiptId);

      if (JSON.stringify(receiptToUpdate) !== JSON.stringify(originalReceipt)) {
        handleUpdate(receiptToUpdate);
      }

      setEditing(null);
    } else {
      const receipt = receipts.find(receipt => receipt.receipt_id === receiptId);
      setEditableReceipts((prevState) => {
        const newReceipts = [...prevState, receipt];
        return newReceipts;
      });
      setEditing(receiptId);
    }
  };

  const handleUpdate = async (receipt) => {
    try {
      console.log(receipt)
      await axios.put(`/api/receipts/${receipt.receipt_id}`, { ...receipt });
      //await axios.put(`/api/credit_client/${receipt.code}`, { ...receipt });

      if (isClientCode(receipt.code)) {
        console.log('Updating credit_client:', receipt.code, receipt.dates, receipt.recharge)
        await axios.put(
          `/api/credit_client/${receipt.code}`, {
            data: receipt.date,
            esatto: receipt.exact,
          }
        );
      } 

      setModifiedRows((prevState) => [...prevState, receipt.receipt_id]);
      fetchReceipts();
    } catch (err) {
      alert('Error: ' + err.response.data.msg)
    }
  };

  const handleChange = (e, receiptId, field) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setEditableReceipts((prevState) => {
      const newReceipts = prevState.map((receipt) =>
        receipt.receipt_id === receiptId ? { ...receipt, [field]: value } : receipt
      );
      return newReceipts;
    });
  };

  const deleteReceipt = async (id) => {
    try {
      //window of confirm to delete
      let confirm = window.confirm("Are you sure you want to delete this receipt?");
      if (confirm) {
        await axios.delete(`/api/receipts/${id}`);

        

        fetchReceipts();
      } else {
        return;
      }

    } catch (err) {
      alert('Error: ' + err.response.data.msg)
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const fetchReceipts = async () => {
    try {
      const response = await axios.get('/api/receipts');
      setReceipts(response.data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);


  return (
    <div style={{ marginTop: "50px" }} className="receipts">
      <button className="btn btn-success" style={{ marginBottom: "20px" }}>
        <Link to="/create_receipt" style={{ color: "white" }}>
          Aggiungi ricevuta
        </Link>

      </button>

      <table className="receipts_table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Ok</th>
            <th style={{ textAlign: "center" }}>* Data *</th>
            <th style={{ textAlign: "center" }}>Oras</th>
            <th style={{ textAlign: "center" }}>€ Ricarica</th>
            <th style={{ textAlign: "center" }}>Note</th>
            <th style={{ textAlign: "center" }}>Metodo</th>
            <th style={{ textAlign: "center" }}>* € Esatto *</th>
            <th style={{ textAlign: "center" }}>Codice</th>
            <th style={{ textAlign: "center" }}></th>
          </tr>
        </thead>
        <tbody>
          {receipts
            .slice()
            .sort((a, b) => {
              const isAModified = modifiedRows.includes(a.receipt_id);
              const isBModified = modifiedRows.includes(b.receipt_id);

              if (isAModified && !isBModified) {
                return -1;
              } else if (!isAModified && isBModified) {
                return 1;
              } else {
                return new Date(b.dates) - new Date(a.dates);
              }
            })
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) // Add this line
            .map((receipt) => {
              const isEditing = editing === receipt.receipt_id;
              const currentReceipt = isEditing
                ? editableReceipts.find((editReceipt) => editReceipt.receipt_id === receipt.receipt_id)
                : receipt;
              return (
                <tr
                  key={receipt.receipt_id}
                  style={{
                    backgroundColor: receipt.verify_bank ? 'lightgreen' : '#FE6E6E'
                  }}
                >
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={currentReceipt.verify_bank}
                      disabled={!isEditing}
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                      onChange={(e) => handleChange(e, receipt.receipt_id, 'verify_bank')}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {isEditing ? (
                      <input
                        type="date"
                        value={currentReceipt.dates}
                        style={{
                          backgroundColor: receipt.verify_bank ? 'lightgreen' : '#FE6E6E',
                        }}
                        onChange={(e) => handleChange(e, receipt.receipt_id, 'dates')}
                      />
                    ) : (
                      formatDate(receipt.dates)
                    )}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {
                      isEditing ? (
                        <input
                          type="number"
                          value={currentReceipt._hours}
                          style={{
                            backgroundColor: receipt.verify_bank ? 'lightgreen' : '#FE6E6E',
                          }}
                          onChange={(e) => handleChange(e, receipt.receipt_id, '_hours')}
                        />
                      ) : (
                        receipt._hours
                      )
                    }
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {
                      isEditing ? (
                        <input
                          type="number"
                          value={currentReceipt.recharge}
                          style={{
                            backgroundColor: receipt.verify_bank ? 'lightgreen' : '#FE6E6E'
                          }}
                          onChange={(e) => handleChange(e, receipt.receipt_id, 'recharge')}
                        />
                      ) : (
                        receipt.recharge
                      )
                    }
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {
                      isEditing ? (
                        <input
                          type="text"
                          value={currentReceipt.notes}
                          style={{
                            backgroundColor: receipt.verify_bank ? 'lightgreen' : '#FE6E6E'
                          }}
                          onChange={(e) => handleChange(e, receipt.receipt_id, 'notes')}
                        />
                      ) : (
                        receipt.notes
                      )
                    }
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {
                      isEditing ? (

                        <select
                          value={receipt.method}
                          style={{
                            backgroundColor: receipt.verify_bank ? 'lightgreen' : '#FE6E6E'
                          }}
                          onChange={(e) => handleChange(e, receipt.receipt_id, 'method')}
                        >
                          <option value="">Method</option>
                          {Object.values(PaymentMethod).map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      ) : (
                        receipt.method
                      )
                    }

                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {
                      isEditing ? (
                        <input
                          type="number"
                          value={currentReceipt.exact}
                          style={{
                            backgroundColor: receipt.verify_bank ? 'lightgreen' : '#FE6E6E'
                          }}
                          onChange={(e) => handleChange(e, receipt.receipt_id, 'exact')}
                        />
                      ) : (
                        receipt.exact
                      )
                    }
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {
                      isEditing ? (
                        <input
                          type="text"
                          value={currentReceipt.code}
                          style={{
                            backgroundColor: receipt.verify_bank ? 'lightgreen' : '#FE6E6E'
                          }}
                          onChange={(e) => handleChange(e, receipt.receipt_id, 'code')}
                        />
                      ) : (
                        <Link
                          to={
                            isClientCode(receipt.code)
                            ? `/credit_client/${receipt.code}`
                            : isAgentCode(receipt.code)
                            ? `/credit_agent/${receipt.code}`
                            : `/not_found`
                          }
                        >
                          {receipt.code}
                        </Link>
                      )
                    }
                  </td>

                  <td>
                    <button className="btn btn-edit" onClick={() => handleEdit(receipt.receipt_id)}>
                      {isEditing ? 'Conferma' : 'Modifica'}
                    </button>

                    {/*<Link>
                      <button
                        className="btn btn-delete"
                        onClick={() => deleteReceipt(receipt.receipt_id)}
                      >
                        Elimina
                      </button>
                  </Link>*/}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="current-page">{currentPage}</span>
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(receipts.length / rowsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Receipts