import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContextProvider";
import bookClub from '../assets/bookClub.jpg'

const LoginForm = ({ setIsLoggedIn }) => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log(state);
    state.user && navigate("/books");
  }, [state.user, navigate]);

  const changeHandler = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: undefined,
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    // Email validation
    if (!userInfo.email) {
      formIsValid = false;
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      formIsValid = false;
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!userInfo.password) {
      formIsValid = false;
      newErrors.password = "Password is required";
    } else if (userInfo.password.length < 8) {
      formIsValid = false;
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  // Function to submit login inputs
  const submitHandler = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios
        .post("http://localhost:8000/api/users/login", userInfo, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          dispatch({
            type: "SET_USER",
            payload: res.data.user,
          });
          setIsLoggedIn(true);
          console.log(state);
          navigate("/books");
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response && err.response.data && err.response.data.errors) {
            setErrors(err.response.data.errors);
          } else {
            setErrors({ server: "An error occurred. Please try again later." });
          }
        });
    }
  };

  return (
    <section className="vh-100" style={{backgroundColor: "rgb(154, 97, 109, 0.4)"}}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{borderRadius: "1rem"}}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src={bookClub}
                    alt="login form"
                    className="img-thumbnail"
                    style={{borderRadius: "1rem 0 0 1rem", height:"100%"}}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={submitHandler}>
                      <h3 className="text-center">Login</h3>
                      <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={userInfo.email}
                          onChange={changeHandler}
                        />
                        {errors.email && (
                          <p className="text-danger">{errors.email}</p>
                        )}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={userInfo.password}
                          onChange={changeHandler}
                        />
                        {errors.password && (
                          <p className="text-danger">{errors.password}</p>
                        )}
                      </div>
                      {errors.server && (
                        <p className="text-danger">{errors.server}</p>
                      )}
                      <div className="pt-1 mb-4">
                        <button className="btn btn-dark btn-lg btn-block" type="submit">Login</button>
                      </div>
                      <p className="mb-5 pb-lg-2" style={{color: "#393f81"}}>Don't have an account?
                      <Link style={{color: "#393f81"}} to={"/register"}>
                        Register & join our community
                      </Link></p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
