import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../GlobalState'
//import Dropdown from './Dropdown';


function Header() {
    const state = useContext(GlobalState)
    //console.log(state)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin

    const [click, setClick] = useState(false)
    const [dropdown, setDropdown] = useState(false);

    const handleClick = () => setClick(!click)

    const logoutUser = async () => {
        await axios.get('/user/logout')
        localStorage.removeItem('firstLogin')
        window.location.href = "/login";
    }

    const onMouseEnter = () => {
        if (window.innerWidth < 960) setDropdown(false);
        else setDropdown(true);
    };

    const onMouseLeave = () => {
        if (window.innerWidth < 960) setDropdown(false);
        else setDropdown(false);
    };

    const adminRouter = () => {
        return (
            <>

                <li className="nav-item">
                    <Link to="/register" className="nav-links" onClick={handleClick}>
                        Register agent
                    </Link>
                </li>
                
                {isLogged ? loggedRouter() : <li className="nav-item"/>}
            </>
        )
    }

    const loggedRouter = () => {
        return (
            <>
                
                <li className="nav-item">
                    <Link to="/receipts" className="nav-links" onClick={handleClick}>
                        Ricevutas
                    </Link>
                </li>

                {/*<li className="nav-item" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <Link className="nav-links">
                        Créditos <i className="fas fa-caret-down" />
                    </Link>
                    {dropdown && <Dropdown />}
                </li>*/}

                <li className="nav-item">
                    <Link to="/login" className="nav-links" onClick={logoutUser}>
                        Logout
                    </Link>
                </li>
            </>
        )
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-logo">
                    RHP
                </Link>

                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    {
                        isAdmin ? adminRouter() : isLogged ? loggedRouter() : <li className="nav-item"/>
                    }
                </ul>
            </nav>
        </>
    )
}

export default Header;