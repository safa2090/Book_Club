import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContextProvider';

const WhoLikeBook = () => {
  const { id } = useParams();
  const [bookInfo, setBookInfo] = useState([]);
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    !state.user && navigate('/'); // Redirect to homepage if user is not logged in
  }, [state.user, navigate]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/books/${id}`, { withCredentials: true })
      .then((res) => {
        setBookInfo(res.data.likedBy);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const toggleFavorite = () => {
    if (isBookFavorited) {
      unfavoriteBook();
    } else {
      favoriteBook();
    }
  };
  // Function can user like a book
  const favoriteBook = () => {
    axios
      .put(`http://localhost:8000/api/books/${id}/favorite`, {}, { withCredentials: true })
      .then((res) => {
        setBookInfo([...bookInfo, state.user.firstName]);
      })
      .catch((err) => console.log(err));
  };
  // Function can user dislike a book
  const unfavoriteBook = () => {
    axios
      .put(`http://localhost:8000/api/books/${id}/unfavorite`, {}, { withCredentials: true })
      .then((res) => {
        const updatedLikedBy = bookInfo.filter((user) => user !== state.user.firstName);
        setBookInfo(updatedLikedBy);
      })
      .catch((err) => console.log(err));
  };

  // To verrify if the user is the one who uploaded the book
  const isUserUploader = state.user && bookInfo[0] && bookInfo[0].addedBy === state.user.firstName;
  // To verrify if the user likes the book
  const isBookFavorited = bookInfo.some((user) => user === state.user.firstName);

  return (
    <div className="col-md-5">
      <div className="card">
        <div className="card-body">
          <h3>Users Who Like This Book</h3>

          {isUserUploader ? (
            <div>
              <p>You are the one who uploaded this book.</p>
              {isBookFavorited && (
                <button className="btn btn-info" onClick={toggleFavorite}>
                  Un-Favorite
                </button>
              )}
            </div>
          ) : (
            state.user && (
              <ul className="list-group">
                {bookInfo.map((user, id) => (
                  <li key={id} className="list-group-item">{user}</li>

                ))}
                <button className="btn btn-info" onClick={toggleFavorite}>
                  {isBookFavorited ? 'Un-Favorite' : 'Add to Favorite'}
                </button>
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default WhoLikeBook;
