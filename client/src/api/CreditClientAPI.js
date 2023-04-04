import { useState, useEffect } from 'react'

import axios from 'axios'

function CreditClientAPI() {
    const [creditClient, setCreditClient] = useState([])
    const [callback, setCallback] = useState(false)


    useEffect(() => {
        const getCreditClient = async () => {
            const res = await axios.get('/api/creditClient')
            setCreditClient(res.data)
        }
        getCreditClient()
    }, [callback])

    return {
        creditClient: [creditClient, setCreditClient],
        callback: [callback, setCallback]
    }
}

export default CreditClientAPI