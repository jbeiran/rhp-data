import {useState, useEffect} from 'react'
import axios from 'axios'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if(token){
            
            const getUser = async () => {
                try {
                    //console.log(token)
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: token },
                    });

                    
                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)
                   // console.log(res)
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser()
        }
    },[token])

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin]
    }
}

export default UserAPI