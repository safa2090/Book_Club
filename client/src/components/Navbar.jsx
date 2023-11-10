import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';

const Navbar = ({ setIsLoggedIn }) => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/', { withCredentials: true });
        const user = response.data;
        dispatch({
          type: 'SET_USER',
          payload: user
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (!state.user) {
      checkUser();
    }
  }, [state.user, dispatch]);

  // Function to let the user logout
  const logout = () => {
    axios
      .post('http://localhost:8000/api/users/logout', {}, { withCredentials: true })
      .then(res => {
        console.log("logout", res);
        dispatch({
          type: "LOGOUT_USER",
          payload: null
        });
        setIsLoggedIn(false);
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
      <nav className="navbar navbar-expand-lg bg-primary-subtle rounded-3 justify-content-center" 
      style={{paddingLeft:"150px"}}>
        <div className="container-fluid">
          <h1>
            Welcome, {state.user && state.user.firstName}!
          </h1>
          <button className='btn btn-danger' onClick={logout}>Log Out</button>
          <hr />
        </div>
      </nav>
  );
};
export default Navbar;
