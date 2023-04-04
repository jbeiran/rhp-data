require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path')

const pool = require('./database/db')

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/receiptsRouter'))
app.use('/api', require('./routes/creditClientRouter'))
app.use('/api', require('./routes/creditAgentRouter'))

pool.query('SELECT NOW()', (err, res) => {
    if (err) console.log(err)
    else console.log(res.rows[0])
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
