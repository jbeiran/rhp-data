const pool = require('../database/db');

const creditClietnCtrl = {
    getCreditAgent: async (req, res) => {
        try {
            const { agent_code } = req.params;
            console.log("agent_code:", agent_code);
            const creditAgent = await pool.query(
                "SELECT * FROM credit_agents WHERE agent_code = $1",
                [agent_code]
            );

            res.json(creditAgent.rows);
        } catch (err) {
            console.error(err.message);
        }
    },
    createCreditAgent: async (req, res) => {
        try {
            const { agent_code, dates, exact, receipt_id } = req.body; // Agregar receipt_id
    
            const max_id = await pool.query("SELECT MAX(credit_agent_id) FROM credit_agents");
            const credit_agent_id = max_id.rows[0].max + 1;
    
            await pool.query(
                "INSERT INTO credit_agents (credit_agent_id, agent_code, dates, exact, receipt_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", // Agregar receipt_id
                [credit_agent_id, agent_code, dates, exact, receipt_id] // Agregar receipt_id
            );
    
            res.json({ msg: "Credit agent created successfully" });
        } catch (err) {
            console.error(err.message);
        }
    },
    deleteCreditAgent: async (req, res) => {
        try {
            await pool.query(
                "DELETE FROM credit_agents WHERE credit_agent_id = $1",
                [req.params.id]
            );

            res.json({ msg: "Credit agent deleted successfully" });
        } catch (err) {
            console.error(err.message);
        }
    },
    updateCreditAgent: async (req, res) => {
        try {
          const { agent_code, prodotto, costo, receipt_id } = req.body; // Agregar receipt_id aquí
          console.log("agent_code:", agent_code,  prodotto, costo, receipt_id); // Mostrar receipt_id en la consola
      
          /*if (!agent_code || !prodotto || !costo || !receipt_id) { // Agregar receipt_id en la validación
            return res.status(400).json({ msg: "Please enter all fields" });
          }*/
      
          const creditAgent = await pool.query(
            "SELECT * FROM credit_agents WHERE receipt_id = $1",
            [receipt_id]
          );
      
          if (creditAgent.rows.length === 0) {
            return res.status(400).json({ msg: "Credit agent does not exist" });
          }
      
          await pool.query(
            "UPDATE credit_agents SET prodotto = $1, costo = $2 WHERE receipt_id = $3",
            [prodotto, costo, receipt_id] // Agregar receipt_id
            );
      
          res.json({ msg: "Credit agent updated successfully" });
        } catch (err) {
          console.error(err.message);
        }
      },
}

module.exports = creditClietnCtrl;