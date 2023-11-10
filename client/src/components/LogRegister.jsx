import React,{ useContext, useEffect } from 'react'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { UserContext } from '../context/UserContextProvider'
import { useNavigate } from 'react-router-dom'

const LogRegister = (props) => {
  const { state } = useContext(UserContext);
  const navigate = useNavigate();
  const {isLoggedIn, setIsloggedIn}=props;

  useEffect(()=>{
    console.log("from logRegister",state);
    state.user && navigate("/books")
},[state.user, navigate])

  return (
    <div className='container'>
      <div className='row column-gap-3' style={{margin: "50px"}} >
          <RegisterForm isLoggedIn={isLoggedIn} setIsloggedIn={setIsloggedIn} />
          <LoginForm  isLoggedIn={isLoggedIn} setIsloggedIn={setIsloggedIn} />
      </div>
    </div>
  )
}

export default LogRegister