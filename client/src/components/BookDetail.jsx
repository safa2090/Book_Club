import React, { useContext, useEffect } from 'react';
import WhoLikeBook from './WhoLikeBook';
import UpdateBook from './UpdateBook';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';
import { useNavigate, Link } from 'react-router-dom';

const BookDetail = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user) {
      navigate('/');
    }
  }, [state.user, navigate]);

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/logout', { withCredentials: true });
      dispatch({ type: 'LOGOUT_USER' });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
      <nav className="navbar navbar-expand-lg bg-primary-subtle rounded-3 justify-content-center">
        <div className="container-fluid">
          <h1>Welcome, {state.user && state.user.firstName}!</h1>
          <button className="btn btn-danger" onClick={logout}>
            Log Out
          </button>
          <Link to="/books" className="btn btn-outline-success">Home</Link>
        </div>
      </nav>
      <div className="row">
        <UpdateBook />
        <WhoLikeBook />
      </div>
    </div>
  );
};

export default BookDetail;