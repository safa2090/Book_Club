import { createContext, useReducer } from "react";
import axios from "axios";

// Create a new context for user-related data.
const UserContext = createContext();

// Initial state for the user context.
const initialState = { user: null };

// Reducer function to handle state updates based on actions.
const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload
            };
        case "NULL_USER":
            return {
                ...state,
                user: null
            };
        case "LOGOUT_USER":
            // Send a POST request to log the user out.
            axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true })
                .then(res => {
                    console.log("logout", res);
                    return {
                        ...state,
                        user: null
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        ...state
                    };
                });
            // This return statement doesn't actually return the updated state.
            // It will be executed before the axios request completes.
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
};

// UserContextProvider component that wraps the application with the UserContext.
const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

// Export the context provider and the context itself.
export { UserContextProvider, UserContext };
