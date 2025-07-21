import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import MeModel from '../../js/models/me.model'
import { showError } from '../../js/utils/utils'
import { isApiError } from '../../js/api'
import SimpleLoader from '../../components/loader/SimpleLoader'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function signup() {
    try {
      setIsSubmitting(true)
      const response = await MeModel.signup({
        email,
        password,
        code,
      })

      MeModel.saveTokens(response.tokens)
      navigate('/')
      setIsSubmitting(false)
    } catch (error) {
      if (isApiError(error)) {
        switch (error.api_error_code) {
          case 'AUTH_SIGNUP_INVALID_CODE':
            showError('Please enter a valid code or contact the administrator')
            break

          case 'AUTH_SIGNUP_INVALID_DATA':
            showError('Please enter a valid email and password')
            break

          case 'AUTH_SIGNUP_USER_ALREADY_EXISTS':
            showError('User already exists. Please use a different email')
            break

          default:
            break
        }
      } else {
        showError('An error occurred. Please try again')
      }

      setIsSubmitting(false)
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
            {isSubmitting ? (
              <SimpleLoader />
            ) : (
              <button
                className="btn"
                style={{ width: '100%' }}
                onClick={signup}
              >
                Sign Up
              </button>
            )}
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
