import React, { useState } from 'react'
import axios from 'axios'

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });

  const handleInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  const loginSubmit = async e => {
    e.preventDefault();

    try{
      await axios.post(`/user/login`, {...user},
        { withCredentials: true })

      localStorage.setItem('firstLogin', true)

      window.location.href = "/";
    } catch(err) {
      alert(err.response.data.msg)
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={loginSubmit}>
        <h1>Login</h1>
        <input type="email" name="email" required
          placeholder="Email" value={user.email} onChange={handleInput} />

        <input type="password" name="password" required autoComplete="on"
          placeholder="Password" value={user.password} onChange={handleInput} />

        <div className="row">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login