import './App.css';
import { useState, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom'
import LogRegister from './components/LogRegister'
import NotFound from './components/NotFound'
import Dashboard from './components/Dashboard';
import BookDetail from './components/BookDetail';
import { UserContext } from './context/UserContextProvider'
import axios from 'axios';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    axios.post('http://localhost:8000/api/users/isLoggedIn', {}, { withCredentials: true })
      .then((user) => {
        console.log(user.data);
        console.log("from app", state);
        dispatch({
          type: "SET_USER",
          payload: user.data
        })
        setIsLoggedIn(true)
      })
      .catch(err => {
        console.log(err)
        dispatch({ type: "NULL_USER" })
      })
  }, [])

  return (
    <div className="App" >
        <Routes>
          {/* <Route path="/" element={<LogRegister isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} /> */}
          <Route path="/" element={<LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/books/" element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/books/:id/' element={<BookDetail isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
