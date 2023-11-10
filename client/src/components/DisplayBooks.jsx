import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContextProvider';

const DisplayBooks = (props) => {
  const {books, setBooks }= props;
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    !state.user && navigate('/');
  }, [state.user, navigate]);

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
// Function can user like a book 
  const addToFavorites = (bookId) => {
    axios
      .put(`http://localhost:8000/api/books/${bookId}/favorite`, null, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setBooks((prevBooks) => {
          return prevBooks.map((book) => {
            if (book._id === bookId) {
              return {
                ...book,
                likedBy: [...book.likedBy, state.user.firstName],
              };
            }
            return book;
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="col-md-5">
      <h3>All Books</h3>
      {books.length === 0 ? (
        <p>Loading...</p>
      ) : (
        books.map((book, index) => {
          return (
            <div key={index} className="card bg-primary-subtle" 
            style={{ margin: '5px', padding:"5px" }}
            >
              <h4>
                <Link to={`/books/${book._id}`} className="card-title">
                  {book.title}
                </Link>
              </h4>
              <p className="card-text">(added by {book.addedBy})</p>
              {state.user && (
                <div>
                  {!book.likedBy.includes(state.user.firstName) ? (
                    <button className="btn btn-info" onClick={() => addToFavorites(book._id)}>
                      Add to favorites
                    </button>
                  ) : (
                    <p>this one is one of your favorites.</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default DisplayBooks;
