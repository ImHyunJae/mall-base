import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'

function App() {
  const AuthLandingPage = Auth(LandingPage, null)
  const AuthLoginPage = Auth(LoginPage, false)
  const AuthRegisterPage = Auth(RegisterPage, false)

  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthLandingPage />}></Route>
        <Route path="login" element={<AuthLoginPage />}></Route>
        <Route path="register" element={<AuthRegisterPage />}></Route>
        <Route path="*" element={<NoMatch />}></Route>
      </Routes>
    </div>
  )
}

export default App

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
