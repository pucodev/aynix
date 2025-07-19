import { Link } from 'react-router-dom'
import { useState } from 'react'
import MeModel from '../../js/models/me.model'

export default function Signup() {
  const [email, setEmail] = useState('email@yopmail.com')
  const [password, setPassword] = useState('password')
  const [code, setCode] = useState('1234')

  async function signup() {
    await MeModel.signup({
      email,
      password,
      code,
    })
  }
  return (
    <div className="page-base">
      <div
        className="is-flex w-100 is-flex-column is-gap-5"
        style={{ maxWidth: '600px' }}
      >
        <h1 className="is-text-center">Sign Up</h1>

        <div className="is-flex is-gap-3 is-flex-column">
          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label">Code</label>
            <input
              className="input"
              type="text"
              placeholder="Code"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </div>

          <div className="w-100 mt-3">
            <button className="btn" style={{ width: '100%' }} onClick={signup}>
              Sign Up
            </button>
          </div>

          {/* Signin */}
          <p className="is-text-center mt-2">
            Already have an account? <Link to="/signin">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
