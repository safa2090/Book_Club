import React, { useContext, useEffect, useState } from 'react';
import AddBook from './AddBook';
import DisplayBooks from './DisplayBooks';
import Navbar from './Navbar';
import { UserContext } from '../context/UserContextProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
  const { state } = useContext(UserContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    console.log('from dashboard', state);
    state.user && navigate('/books');

  }, [state.user]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/books', { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setBooks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addBook = (book) => {
    setBooks([...books, book]);
  };

  return (
    <div className='container'>
      <Navbar isLoggedIn={isLoggedIn} setIsloggedIn={setIsLoggedIn} />
      <div className="row">
        <AddBook addBook={addBook} />
        <DisplayBooks books={books} setBooks={setBooks} />
      </div>
    </div>
  );
};

export default Dashboard;
