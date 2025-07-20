import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MeModel from '../../js/models/me.model'
import { isApiError } from '../../js/api'
import { showError } from '../../js/utils/utils'

export default function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function signin() {
    try {
      const response = await MeModel.signin({
        email,
        password,
      })

      MeModel.saveTokens(response.tokens)
      navigate('/')
    } catch (error) {
      if (isApiError(error)) {
        switch (error.api_error_code) {
          case 'AUTH_SIGNIN_UNAUTHORIZED':
            showError('Invalid email or password. Please try again')
            break

          default:
            showError('An error occurred. Please try again')
            break
        }
      } else {
        showError('An error occurred. Please try again')
      }
    }
  }

  return (
    <div className="page-base">
      <div
        className="is-flex w-100 is-flex-column is-gap-5"
        style={{ maxWidth: '600px' }}
      >
        <div className="w-100 is-flex is-justify-content-center">
          <img src="/aynix logo sidebar.png" />
        </div>

        <h1 className="is-text-center">Sign In</h1>

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
          <div className="w-100 mt-3">
            <button className="btn" style={{ width: '100%' }} onClick={signin}>
              Sign In
            </button>
          </div>

          {/* Signup */}
          <p className="is-text-center mt-2">
            Don't have an account yet? <Link to="/signup">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
