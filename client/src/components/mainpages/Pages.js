import React, {useContext} from 'react'
import { Route, Routes } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";

import Receipts from "./receipts/Receipts";
import CreateReceipt from "./receipts/createReceipt/CreateReceipt";

import CreditClient from "./credit_client/CreditClient";
import CreditAgent from "./credit_agent/CreditAgent";

import NotFound from "./utils/not_found/NotFound";

import {GlobalState} from '../../GlobalState'


function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin

    return (
        <section>
            <Routes>
                <Route path="/" exact element={isLogged ? <Receipts /> : <Login />} />

                <Route path="/login" exact element={isLogged ? <NotFound /> : <Login />} />
                <Route path="/register" exact element={isAdmin ? <Register /> : <NotFound />} />
                
                <Route path="/receipts" exact element={isLogged ? <Receipts /> : <NotFound />} />
                <Route path="/create_receipt" exact element={isLogged ? <CreateReceipt /> : <NotFound />} />

                <Route path="/credit_client/:code" exact element={isLogged ? <CreditClient /> : <NotFound />} />
                <Route path="/credit_agent/:code" exact element={isLogged ? <CreditAgent /> : <NotFound />} />

                <Route path="*" element={isLogged ? <NotFound /> : <Login />} />
            </Routes>
        </section>
    );
}

export default Pages;