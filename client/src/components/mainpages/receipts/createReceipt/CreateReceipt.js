import React, { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'

import { PaymentMethod } from '../PaymentMethod'
import { GlobalState } from '../../../../GlobalState'

const initialState = {
  verify_bank: false,
  dates: '',
  _hours: '',
  recharge: '',
  notes: '',
  method: '',
  exact: '',
  code: ''
}

function CreateReceipt() {
  const state = useContext(GlobalState)
  const [receipt, setReceipt] = useState(initialState);
  const navigate = useNavigate()


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let inputValue;
    if (type === 'true') {
      inputValue = true;
    } else if (type === 'false') {
      inputValue = false;
    } else {
      inputValue = type === "checkbox" ? e.target.checked : value;
    }

    setReceipt({ ...receipt, [name]: inputValue });
  }

  const isClientCode = (code) => {
    if (code.startsWith('C')) return true;

    return false;
  }

  const isAgentCode = (code) => {
    if (code.startsWith('A')) return true;
    
    return false;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
     // console.log(receipt)
      if (!isClientCode(receipt.code) && !isAgentCode(receipt.code)) {
        alert("Invalid code. Please enter a valid code.");
        return;
      }

      const res = await axios.post('/api/receipts', { ...receipt })
      alert('Receipt created')
      setReceipt(initialState)

      console.log(res.data)

      if (!receipt.code) {
        navigate("/receipts");
        return;
      }

      if (isClientCode(receipt.code)) {
        const creditClientData = {
          client_code: receipt.code,
          dates: receipt.dates,
          exact: receipt.exact,
          prodotto: '',
          costo: 0,
          receipt_id: res.data._id,
        };
        
        await axios.post('/api/credit_client', { ...creditClientData });
        navigate(`/credit_client/${receipt.code}`);
        return;
        
      } else if (isAgentCode(receipt.code)) {
        const creditAgentData = {
          agent_code: receipt.code,
          dates: receipt.dates,
          exact: receipt.exact,
          prodotto: '',
          costo: 0,
          receipt_id: res.data._id,
          ok: false
        };

        await axios.post('/api/credit_agent', { ...creditAgentData });
        navigate(`/credit_agent/${receipt.code}`);
        return;
      }

      if(receipt.verify_bank){
        navigate(`/receipts/${receipt.code}`);
        return;
      } else {
        navigate("/receipts");
        return;
      }

    } catch (err) {
      // Manejar errores específicos
      if (err.response && err.response.data && err.response.data.msg) {
        alert(err.response.data.msg);
      } else {
        // Manejar errores genéricos
        alert("An error occurred. Please try again.");
        console.error(err);
      }
    }
  };
  

  return (
    <div style={{ marginTop: "100px" }} className="create_receipts">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="verify_bank">Verify Bank</label>
          <select
            className="form-control"
            id="verify_bank"
            name="verify_bank"
            value={receipt.verify_bank}
            onChange={handleInputChange}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <label htmlFor="dates">Date</label>
          <input type="date" className="form-control" id="dates" name="dates" value={receipt.date} onChange={handleInputChange} />

          <label htmlFor="_hours">Hours</label>
          <input type="text" className="form-control" id="_hours" name="_hours" value={receipt._hours} onChange={handleInputChange} />

          <label htmlFor="recharge">Recharge</label>
          <input type="text" className="form-control" id="recharge" name="recharge" value={receipt.recharge} onChange={handleInputChange} />

          <label htmlFor="notes">Notes</label>
          <input type="text" className="form-control" id="notes" name="notes" value={receipt.notes} onChange={handleInputChange} />

          <label htmlFor="method">Method</label>
          <select
            className="form-control"
            id="method"
            name="method"
            value={receipt.method}
            onChange={handleInputChange}
          >
            <option value="">Select a payment method</option>
            {Object.values(PaymentMethod).map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <label htmlFor="exact">Exact</label>
          <input type="text" className="form-control" id="exact" name="exact" value={receipt.exact} onChange={handleInputChange} />

          <label htmlFor="code">Code</label>
          <input type="text" className="form-control" id="code" name="code" value={receipt.code} onChange={handleInputChange} />

          <button type="submit" className="btn btn-primary">Submit</button>

        </div>
      </form>
    </div>
  )
}

export default CreateReceipt