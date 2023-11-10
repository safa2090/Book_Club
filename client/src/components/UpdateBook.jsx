import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContextProvider';

const UpdateBook = () => {
  const { id } = useParams();
  const { state } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [bookInfo, setBookInfo] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({}); // State to store validation errors

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/books', { withCredentials: true })
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, navigate]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/books/${id}`, { withCredentials: true })
      .then((res) => {
        setBookInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, [id, navigate]);

  const changeHandler = (e) => {
    setBookInfo({
      ...bookInfo,
      [e.target.name]: e.target.value
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: undefined,
    }));
  };
// Function to validate inputs
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (bookInfo.title.trim() === '') {
      errors.title = 'Title is required';
      isValid = false;
    } else if (bookInfo.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
      isValid = false;
    }

    if (bookInfo.description.trim() === '') {
      errors.description = 'Description is required';
      isValid = false;
    } else if (bookInfo.description.length < 5) {
      errors.description = 'Description must be at least 5 characters';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };
// Function user can  update the title and the description of a book
  const updateBook = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    axios
      .put(`http://localhost:8000/api/books/${id}`, bookInfo, { withCredentials: true })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ server: 'An error occurred. Please try again later.' });
        }
      });
  };
// Function can user delete a book
  const deleteBook = (bookId) => {
    axios
      .delete(`http://localhost:8000/api/books/${bookId}`, { withCredentials: true })
      .then((res) => {
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
        navigate('/books');
      })
      .catch((err) => console.log(err));
  };

  const formatDate = (timestamp) => {
    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true 
    };
    return new Date(timestamp).toLocaleString('en-US', options);
  };

  const isUserUploader = state.user?.firstName === bookInfo.addedBy; // To verify if the user is the one who added the book

  return (
    <div className="col-md-5 offset-1">
      <div className="card">
        <div className="card-body">
          {isUserUploader ? (
            <form onSubmit={updateBook}>
              <div>
                <label className="text-start">Title</label>
                <br />
                <input className="form-control" type="text" name="title" value={bookInfo.title} onChange={changeHandler} />
                {errors.title && (
                  <p className="text-danger">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="text-start">Description</label>
                <br />
                <textarea className="form-control" type="text" name="description" value={bookInfo.description} onChange={changeHandler} />
                {errors.description && (
                  <p className="text-danger">{errors.description}</p>
                )}
              </div>
              <button type="submit" className="btn btn-warning">Update</button>
              <button className="btn btn-danger" style={{ marginLeft: "15px" }} onClick={() => deleteBook(id)}>
                Delete
              </button>
            </form>
          ) : (
            <>
              <h1 className="card-title">{bookInfo.title}</h1>
              <p className="text-start">Description: {bookInfo.description}</p>
            </>
          )}
          <p className="text-start">Added by: {bookInfo.addedBy}</p>
          <p className="text-start">Added on: {formatDate(bookInfo.createdAt)}</p>
          <p className="text-start">Last updated on: {formatDate(bookInfo.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
