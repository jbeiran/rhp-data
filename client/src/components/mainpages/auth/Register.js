import React, { useState } from 'react'
import axios from 'axios'

function Register() {
  const [user, setUser] = useState({ email: "", password: "" });

  const handleInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  const registerSubmit = async e => {
    e.preventDefault();

    try{
      await axios.post('http://localhost:5000/user/register', {...user})

      localStorage.setItem('firstLogin', true)

      window.location.href = "/";
    } catch(err) {
      alert(err.response.data.msg)
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={registerSubmit}>
        <h1>Register</h1>
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

export default Register