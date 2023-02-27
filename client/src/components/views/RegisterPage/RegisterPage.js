import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../../_actions/user_action'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const dispatch = useDispatch()
  const [Email, setEmail] = useState('')
  const [Name, setName] = useState('')
  const [Password, setPassword] = useState('')
  const [ConfirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onNameHandler = (event) => {
    // console.log('PW : ' + event.currentTarget.value)
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    // console.log('PW : ' + event.currentTarget.value)
    setPassword(event.currentTarget.value)
  }

  const onConfirmPasswordHandler = (event) => {
    // console.log('PW : ' + event.currentTarget.value)
    setConfirmPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    let body = {
      email: Email,
      name: Name,
      password: Password,
    }

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        // console.log('test')
        // props.history.push('/')
        navigate('/login')
      } else {
        alert('Error')
      }
    })

    // Axios.post('/api/users/login', body).then((response) => {})
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default RegisterPage
