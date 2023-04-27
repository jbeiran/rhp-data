import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import { PaymentMethod } from './PaymentMethod'

function Receipts() {
  const state = useContext(GlobalState)
  const [receipts, setReceipts] = state.receiptsAPI.receipts
  const [editing, setEditing] = useState(null)
  const [editableReceipts, setEditableReceipts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newReceiptData, setNewReceiptData] = useState({
    verify_bank: false,
    dates: '',
    _hours: '',
    recharge: '',
    notes: '',
    method: '',
    exact: '',
    code: ''
  })
  const [searchCode, setSearchCode] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchDateEnd, setSearchDateEnd] = useState('');
  const [searchPaymethod, setSearchPaymethod] = useState('');
  const [filterOk, setFilterOk] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  const [modifiedRows, setModifiedRows] = useState([]);

  const isClientCode = (code) => {
    return code && code.startsWith('C');
  }

  const isAgentCode = (code) => {
    return code && code.startsWith('A');
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCreate = async () => {
    if (
      !newReceiptData.dates ||
      !newReceiptData._hours ||
      !newReceiptData.recharge ||
      !newReceiptData.method ||
      !newReceiptData.exact
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {

      if (newReceiptData.code !== '') {
        if (!isClientCode(newReceiptData.code) && !isAgentCode(newReceiptData.code)) {
          alert("Invalid code. Please enter a valid code.");
          return;
        }
      }

      const res = await axios.post('/api/receipts', { ...newReceiptData })
      setReceipts((prevReceipts) => [...prevReceipts, newReceiptData]);

      if (isClientCode(newReceiptData.code)) {
        const creditClientData = {
          client_code: newReceiptData.code,
          dates: newReceiptData.dates,
          exact: newReceiptData.exact,
          prodotto: '',
          costo: 0,
          receipt_id: res.data._id,
        };

        await axios.post('/api/credit_client', { ...creditClientData });

      } else if (isAgentCode(newReceiptData.code)) {
        const creditAgentData = {
          agent_code: newReceiptData.code,
          dates: newReceiptData.dates,
          exact: newReceiptData.exact,
          prodotto: '',
          costo: 0,
          receipt_id: res.data._id,
          ok: false
        };

        await axios.post('/api/credit_agent', { ...creditAgentData });
      }

      setIsCreating(false);
      setEditing(null);
      setEditableReceipts((prevEditableReceipts) => {
        const newEditableReceipts = prevEditableReceipts.filter((receipt) => receipt.receipt_id !== editing);
        return newEditableReceipts;
      });
    } catch (error) {
      console.error("Error al crear el recibo:", error);
      alert("Error al crear el recibo. Por favor, inténtalo de nuevo.");
    }
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
      //console.log(receipt)
      await axios.put(`/api/receipts/${receipt.receipt_id}`, { ...receipt });

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

  const handleSearchCodeChange = (e) => {
    setSearchCode(e.target.value === 'Todos' ? '' : e.target.value);
  };

  const handleSearchDateEndChange = (e) => {
    setSearchDateEnd(e.target.value);
  }

  const handleFilterOkChange = (e) => {
    setFilterOk(e.target.value);
  };

  const handleSearchPaymethod = (e) => {
    setSearchPaymethod(e.target.value);
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const fetchReceipts = useCallback(async () => {
    try {
      const response = await axios.get('/api/receipts');
      setReceipts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  }, [setReceipts]);

  const filteredReceipts = useMemo(() => {
    let result = Array.from(receipts);

    if (searchCode) {
      if (searchCode === 'Sin Codigo') {
        result = result.filter((receipt) => !receipt.code);
      } else {
        result = result.filter((receipt) => receipt.code);
      }
    }

    if (searchDate && searchDateEnd) {
      const startDate = new Date(searchDate);
      const endDate = new Date(searchDateEnd);

      result = result.filter((receipt) => {
        const receiptDate = new Date(receipt.dates);
        return (
          receiptDate >= startDate && receiptDate <= endDate
        )
      });
    }

    if (filterOk) {
      result = result.filter((receipt) => receipt.verify_bank === (filterOk === 'true'));
    }

    if (searchPaymethod) {
      result = result.filter((receipt) => receipt.method === searchPaymethod);
    }

    return result;
  }, [receipts, searchCode, searchDate, searchDateEnd, filterOk, searchPaymethod]);

  const handleResetSearch = () => {
    setSearchCode('');
    setSearchDate('');
    setSearchDateEnd('');
    setFilterOk('');
  };

  const getRowStyle = (receipt) => {
    if (!receipt.code && !receipt.verify_bank) {
      return { backgroundColor: 'rgba(245, 255, 76, 0.8)' };
    }

    if (receipt.code && !receipt.verify_bank) {
      return { backgroundColor: '#FE6E6E' };
    }

    return {};
  };

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return (
    <div style={{ marginTop: "50px" }} className="receipts">

      {!isLoading && receipts.length > 0 ? (
        <>
          <div className="search-filters">
            <label htmlFor="searchCode">Código de búsqueda:</label>
            <select
              type="text"
              id="searchCode"
              value={searchCode}
              onChange={handleSearchCodeChange}
            >
              <option value="Todos">Todos</option>
              <option value="Con Codigo">Con codigo</option>
              <option value="Sin Codigo">Sin codigo</option>
            </select>

            <label htmlFor="searchDate">Fecha inicio:</label>
            <input
              type="date"
              id="searchDate"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />

            <label htmlFor="searchDateEnd">Fecha fin:</label>
            <input
              type="date"
              id="searchDateEnd"
              value={searchDateEnd}
              onChange={handleSearchDateEndChange}
            />

            <label htmlFor="filterOk">Filtrar por estado:</label>
            <select
              id="filterOk"
              value={filterOk}
              onChange={handleFilterOkChange}
            >
              <option value="">Todos</option>
              <option value="false">No validado</option>
            </select>

            <label htmlFor="searchPaymethod">Filtrar por pago:</label>
            <select
              id="searchPaymethod"
              value={searchPaymethod}
              onChange={handleSearchPaymethod}
            >
              <option value="">Method</option>
              {Object.values(PaymentMethod).map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>

            <button
              className="btn btn-danger"
              style={{ marginLeft: '20px' }}
              onClick={handleResetSearch}
            >
              Eliminar búsquedas
            </button>
          </div>

          <button className="btn btn-success"
            style={{ marginBottom: "20px" }}
            onClick={() => setIsCreating(true)}
          >
            Aggiungi ricevuta
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
              {
                isCreating && (
                  <tr key={receipts.receipt_id}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                        id="verify_bank"
                        name="verify_bank"
                        checked={newReceiptData.verify_bank}
                        onChange={(e) => setNewReceiptData({ ...newReceiptData, verify_bank: e.target.checked })}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="date"
                        className="form-control"
                        id="dates"
                        name="dates"
                        value={newReceiptData.dates}
                        onChange={(e) => setNewReceiptData({ ...newReceiptData, dates: e.target.value })}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="text" className="form-control" id="_hours" name="_hours" value={newReceiptData._hours} onChange={(e) => setNewReceiptData({ ...newReceiptData, _hours: e.target.value })} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="text" className="form-control" id="recharge" name="recharge" value={newReceiptData.recharge} onChange={(e) => setNewReceiptData({ ...newReceiptData, recharge: e.target.value })} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="text" className="form-control" id="notes" name="notes" value={newReceiptData.notes} onChange={(e) => setNewReceiptData({ ...newReceiptData, notes: e.target.value })} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <select
                        className="form-control"
                        id="method"
                        name="method"
                        value={newReceiptData.method}
                        onChange={(e) => setNewReceiptData({ ...newReceiptData, method: e.target.value })}
                      >
                        <option value="">Method</option>
                        {Object.values(PaymentMethod).map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="text" className="form-control" id="exact" name="exact" value={newReceiptData.exact} onChange={(e) => setNewReceiptData({ ...newReceiptData, exact: e.target.value })} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="text" className="form-control" id="code" name="code" value={newReceiptData.code} onChange={(e) => setNewReceiptData({ ...newReceiptData, code: e.target.value })} />
                    </td>
                    <td>
                      <button type="submit" className="btn btn-edit" onClick={handleCreate}>Conferma</button>
                    </td>
                  </tr>
                )}

              {filteredReceipts
                .slice()
                .sort((a, b) => {
                  const isAModified = modifiedRows.includes(a.receipt_id);
                  const isBModified = modifiedRows.includes(b.receipt_id);

                  if (isAModified && !isBModified) {
                    return -1;
                  } else if (!isAModified && isBModified) {
                    return 1;
                  } else {
                    const dateComparison = new Date(b.dates) - new Date(a.dates);
                    if (dateComparison === 0) {
                      // Si las fechas son iguales, compara las horas
                      if (typeof a._hours === 'string' && typeof b._hours === 'string') {
                        return b._hours.localeCompare(a._hours);
                      } else {
                        // Manejar casos en los que a._hours o b._hours no sean strings
                        // Por ejemplo, podrías devolver 0 para mantener el orden actual:
                        return 0;
                      }
                    } else {
                      return dateComparison;
                    }
                  }
                })
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((receipt) => {
                  const isEditing = editing === receipt.receipt_id;
              const currentReceipt = isEditing
                    ? editableReceipts.find((editReceipt) => editReceipt.receipt_id === receipt.receipt_id)
              : receipt;
              return (
              <tr
                key={receipt.receipt_id}
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
                <td style={getRowStyle(currentReceipt)}>
                  {isEditing ? (
                    <input
                      type="date"
                      value={currentReceipt.dates}

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
                        type="string"
                        value={currentReceipt._hours}
                        onChange={(e) => handleChange(e, receipt.receipt_id, '_hours')}
                      />
                    ) : (
                      receipt._hours
                    )
                  }
                </td>

                <td style={
                  getRowStyle(currentReceipt)
                }>
                  {
                    isEditing ? (
                      <input
                        type="number"
                        value={currentReceipt.recharge}
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
                        onChange={(e) => handleChange(e, receipt.receipt_id, 'notes')}
                      />
                    ) : (
                      receipt.notes
                    )
                  }
                </td>

                <td style={
                  getRowStyle(currentReceipt)
                }>
                  {
                    isEditing ? (

                      <select
                        value={receipt.method}
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
              disabled={currentPage === Math.ceil(filteredReceipts.length / rowsPerPage)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </div>
  )
}

export default Receipts
