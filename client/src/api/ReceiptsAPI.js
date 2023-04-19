import { useState, useEffect } from 'react'

import axios from 'axios'

function ReceiptsAPI() {
    const [receipts, setReceipts] = useState([])
    const [callback, setCallback] = useState(false)


    useEffect(() => {
        const getReceipts = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/receipts`)
            setReceipts(res.data)
        }
        getReceipts()
    }, [callback])

    return {
        receipts: [receipts, setReceipts],
        callback: [callback, setCallback]
    }
}

export default ReceiptsAPI