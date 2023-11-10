import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';
import { useNavigate } from 'react-router-dom';

const AddBook = ({ addBook }) => {
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    !state.user && navigate('/');
  }, [state.user, navigate]);

  const [bookInfo, setBookInfo] = useState({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({}); // State to store validation errors

  const changeHandler = (e) => {
    setBookInfo({
      ...bookInfo,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/books/', bookInfo, { withCredentials: true })
      .then((res) => {
        console.log(res);
        addBook(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else {
          console.log(err);
        }
      });
  };

  return (
    <div className="col-md-5 offset-1">
      <form onSubmit={submitHandler}>
        <h3 className="text-center text-white">Add a New Book</h3>
        <div className="form-group">
          <label className="form-label text-white">Title:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={bookInfo.title}
            onChange={changeHandler}
          />
          {errors.title && (
            <p className="text-danger">{errors.title.message}</p>
          )}
        </div>
        <div className="form-group">
          <label className="form-label text-white">Description:</label>
          <textarea
            type="text"
            className="form-control"
            name="description"
            rows="3"
            value={bookInfo.description}
            onChange={changeHandler}
          />
          {errors.description && (
            <p className="text-danger">{errors.description.message}</p>
          )}
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary mt-3">
            Add a book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
