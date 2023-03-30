import React, { useState } from 'react'
import axios from 'axios'

import { PaymentMethod } from '../PaymentMethod'

const initialState = {
  verify_bank: false,
  date: '',
  _hours: '',
  recharge: '',
  notes: '',
  method: '',
  exact: '',
  code: ''
}

function CreateReceipt({ fetchReceipts }) {
  //const state = useContext(GlobalState)
  const [receipt, setReceipt] = useState(initialState);

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

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log(receipt)
      await axios.post('/api/receipts', { ...receipt })
      alert('Receipt created')
      setReceipt(initialState)
      fetchReceipts()
    } catch (err) {
      alert(err.response.data.msg)
    }
  }

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

          <label htmlFor="date">Date</label>
          <input type="date" className="form-control" id="date" name="date" value={receipt.date} onChange={handleInputChange} />

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