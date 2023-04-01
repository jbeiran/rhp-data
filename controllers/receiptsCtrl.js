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
                date,
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
                !date ||
                !_hours ||
                !recharge ||
                !method ||
                !exact
            ) {
                return res.status(400).json({ msg: "Please enter all fields" });
            }

            const max_id = await pool.query("SELECT MAX(receipt_id) FROM receipts");
            const receipt_id = max_id.rows[0].max + 1;

            await pool.query(
                "INSERT INTO receipts (receipt_id, verify_bank, dates, _hours, recharge, notes, method, exact, code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
                [receipt_id, verify_bank, date, _hours, recharge, notes, method, exact, code]
            );

            if (code.startsWith("C")) {
                await pool.query(
                    "INSERT INTO credit_clients (client_code, data, esatto) VALUES ($1, $2, $3)",
                    [code, date, exact]
                );
            } else if (code.startsWith("A")) {
                return;
                //await creditClientsCtrl.createCreditClient(code, date, exact);
            }

            res.json({ msg: "Receipt created successfully" });
        } catch (err) {
            console.error(err.message);
        }
    },
    updateReceipt: async (req, res) => {
        try {
            const { receipt_id,
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

            const updateReceipt = await pool.query(
                "UPDATE receipts SET verify_bank = $1, dates = $2, _hours = $3, recharge = $4, notes = $5, method = $6, exact = $7, code = $8 WHERE receipt_id = $9",
                [verify_bank, dates, _hours, recharge, notes, method, exact, code, receipt_id]
            );

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