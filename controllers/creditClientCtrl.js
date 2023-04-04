const pool = require('../database/db');

const creditClietnCtrl = {
    getCreditClient: async (req, res) => {
        try {
            const { client_code } = req.params;
            console.log("client_code:", client_code);
            const creditClient = await pool.query(
                "SELECT * FROM credit_clients WHERE client_code = $1",
                [client_code]
            );

            res.json(creditClient.rows);
        } catch (err) {
            console.error(err.message);
        }
    },
    createCreditClient: async (req, res) => {
        try {
            const { client_code, dates, exact, receipt_id } = req.body; // Agregar receipt_id
    
            const max_id = await pool.query("SELECT MAX(credit_client_id) FROM credit_clients");
            const credit_client_id = max_id.rows[0].max + 1;
    
            await pool.query(
                "INSERT INTO credit_clients (credit_client_id, client_code, dates, exact, receipt_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", // Agregar receipt_id
                [credit_client_id, client_code, dates, exact, receipt_id] // Agregar receipt_id
            );
    
            res.json({ msg: "Credit client created successfully" });
        } catch (err) {
            console.error(err.message);
        }
    },
    deleteCreditClient: async (req, res) => {
        try {
            await pool.query(
                "DELETE FROM credit_clients WHERE credit_client_id = $1",
                [req.params.id]
            );

            res.json({ msg: "Credit client deleted successfully" });
        } catch (err) {
            console.error(err.message);
        }
    },
    updateCreditClient: async (req, res) => {
        try {
          const { client_code, prodotto, costo, receipt_id } = req.body; // Agregar receipt_id aquí
          console.log("client_code:", client_code,  prodotto, costo, receipt_id); // Mostrar receipt_id en la consola
      
          if (!client_code || !prodotto || !costo || !receipt_id) { // Agregar receipt_id en la validación
            return res.status(400).json({ msg: "Please enter all fields" });
          }
      
          const creditClient = await pool.query(
            "SELECT * FROM credit_clients WHERE client_code = $1",
            [client_code]
          );
      
          if (creditClient.rows.length === 0) {
            return res.status(400).json({ msg: "Credit client does not exist" });
          }
      
          await pool.query(
            "UPDATE credit_clients SET prodotto = $1, costo = $2, receipt_id = $3 WHERE client_code = $4",
            [prodotto, costo, receipt_id, client_code] // Agregar receipt_id
            );
      
          res.json({ msg: "Credit client updated successfully" });
        } catch (err) {
          console.error(err.message);
        }
      },
}

module.exports = creditClietnCtrl;