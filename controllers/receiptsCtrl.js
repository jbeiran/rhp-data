const pool = require('../database/db');

const receiptsCtrl = {
    getReceipts: async (req, res) => {
        try {
            const allReceipts = await pool.query("SELECT * FROM receipts");
            res.json(allReceipts.rows);
        } catch (err) {
            console.error(err.message);
        }
    },
    createReceipt: async (req, res) => {
        try {
            const {
                verify_bank,
                dates,
                _hours,
                recharge,
                notes,
                method,
                exact,
                code
            } = req.body;

            console.log("req.body:", req.body);

            if (
                verify_bank === null ||
                !dates ||
                !_hours ||
                !recharge ||
                !method ||
                !exact
            ) {
                return res.status(400).json({ msg: "Please enter all fields" });
            }

            const max_id = await pool.query("SELECT MAX(receipt_id) FROM receipts");
            const receipt_id = max_id.rows[0].max + 1;

            const newReceipt = await pool.query(
                "INSERT INTO receipts (receipt_id, verify_bank, dates, _hours, recharge, notes, method, exact, code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
                [receipt_id, verify_bank, dates, _hours, recharge, notes, method, exact, code]
            );

            res.json({ _id: newReceipt.rows[0].receipt_id });
            
        } catch (err) {
            console.error(err.message);
        }
    },
    updateReceipt: async (req, res) => {
        try {
            const {
                receipt_id,
                verify_bank,
                dates,
                _hours,
                recharge,
                notes,
                method,
                exact,
                code
            } = req.body;
    
            if (!receipt_id || verify_bank === null || !dates || !_hours || !recharge || !method || !exact || !code) {
                return res.status(400).json({ msg: "Please enter all fields" });
            }
    
            const receipt = await pool.query("SELECT * FROM receipts WHERE receipt_id = $1", [receipt_id]);
    
            if (receipt.rows.length === 0) {
                return res.status(400).json({ msg: "Receipt does not exist" });
            }
    
            await pool.query(
                "UPDATE receipts SET verify_bank = $1, dates = $2, _hours = $3, recharge = $4, notes = $5, method = $6, exact = $7, code = $8 WHERE receipt_id = $9",
                [verify_bank, dates, _hours, recharge, notes, method, exact, code, receipt_id]
            );
    
            if (code.startsWith("C") || code.startsWith("A")) {
                const table = code.startsWith("C") ? "credit_clients" : "credit_agents";
                const creditEntry = await pool.query(
                    `SELECT * FROM ${table} WHERE receipt_id = $1`,
                    [receipt_id]
                );
    
                if (creditEntry.rows.length === 0) {
                    const max_id = await pool.query(`SELECT MAX(credit_client_id) FROM ${table}`);
                    const credit_client_id = max_id.rows[0].max + 1;
    
                    await pool.query(
                        `INSERT INTO ${table} (credit_client_id, client_code, dates, exact, receipt_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                        [credit_client_id, code, dates, exact, receipt_id]
                    );
                } else {
                    await pool.query(
                        `UPDATE ${table} SET client_code = $1, dates = $2, exact = $3 WHERE receipt_id = $4`,
                        [code, dates, exact, receipt_id]
                    );
                }
            }
    
            res.json({ msg: "Receipt updated successfully" });
        } catch (err) {
            console.error(err.message);
        }
    },
    deleteReceipt: async (req, res) => {
        try {
            await pool.query("DELETE FROM receipts WHERE receipt_id = $1", [req.params.id]);
            res.json({ msg: "Receipt deleted successfully" });
        } catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = receiptsCtrl;