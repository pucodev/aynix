import { Link } from 'react-router-dom'

export default function Signin() {
  return (
    <div className="page-base">
      <div
        className="is-flex w-100 is-flex-column is-gap-5"
        style={{ maxWidth: '600px' }}
      >
        <h1 className="is-text-center">Sign In</h1>

        <div className="is-flex is-gap-3 is-flex-column">
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="text" placeholder="Email" />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Password" />
          </div>
          <div className="w-100 mt-3">
            <button className="btn" style={{ width: '100%' }}>
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
