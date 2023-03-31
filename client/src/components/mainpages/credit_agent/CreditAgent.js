import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CreditAgent() {
  const { code } = useParams();
  
  return (
    <div style={{ marginTop: "50px" }} className="clients">

      <h1>Crédito Agente: {code}</h1>
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
        </table>
    </div>
  );
}

export default CreditAgent;