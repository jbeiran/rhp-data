const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../database/db')

const userCtrl = {
    register: async (req, res) => {
        try {
            const { email, password } = req.body

            if (!email || !password) return res.status(400).json({ msg: 'Please fill in all fields' })
            if (!validateEmail(email)) return res.status(400).json({ msg: 'Invalid email' })
            if (password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters' })

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
            if (user.rows.length > 0) return res.status(400).json({ msg: 'This email already exists' })

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, passwordHash])

            const accessToken = createAccessToken({ id: newUser.rows[0].user_id })
            const refreshToken = createRefreshToken({ id: newUser.rows[0].user_id })

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.json({ accessToken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
            if (user.rows.length === 0) return res.status(400).json({ msg: 'This email does not exist' })

            const isMatch = await bcrypt.compare(password, user.rows[0].password)
            if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect' })

            console.log('User object in login:', { id: user.rows[0].user_id });
            const accessToken = createAccessToken({ id: user.rows[0].user_id })
            const refreshToken = createRefreshToken({ id: user.rows[0].user_id })

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accessToken })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: 'Logged out' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: async (req, res) => {
        try {
            console.log(req.cookies)
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ msg: 'Please login or register' })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login or register" });
                const accessToken = createAccessToken({ id: user.id })
                //console.log("Generated access token in refreshToken:", accessToken);
                res.json({ accessToken });
            })
            //res.json({rf_token})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUser: async (req, res) => {
        try {
            console.log(req.user)
            if (!req.user || !req.user.id) return res.status(400).json({ msg: 'Please login or register' })
            const user = await pool.query('SELECT user_id, email, role FROM users WHERE user_id = $1', [req.user.id]);

            // Comprueba si la consulta devuelve algún resultado
            if (user.rows.length === 0) return res.status(400).json({ msg: 'User does not exist' })
            
            //console.log(user)

            res.json(user.rows[0])
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

const createAccessToken = (user) => {
    //console.log('User object in createAccessToken:', user);
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' });
    //console.log('Generated access token:', accessToken);
    return accessToken;
};

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

module.exports = userCtrl