import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import ScreenLoader from '../components/ScreenLoader';

const AuthContext = createContext();
const initialState = { isAuthenticated: false, user: { email: "", password: "" } };

const { toastify } = window;

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SET_LOGGED_IN":
            return { ...state, isAuthenticated: true, user: payload.user };
        case "SET_LOGGED_OUT":
            return initialState;
        default:
            return state;
    }
}

export default function AuthContextProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { email, uid } = user;
                dispatch({ type: "SET_LOGGED_IN", payload: { user: { email, uid } } });
            } else {
                dispatch({ type: "SET_LOGGED_OUT" });
            }
            setIsLoading(false);
        });
    }, [dispatch]);


    const login = (email, password) => {
        setIsProcessing(true);
        setIsLoading(true);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("user", user);
                dispatch({ type: "SET_LOGGED_IN", payload: { user } });
                toastify("User Logged In Successfully", "success");
            })
            .catch((error) => {
                console.log("error", error);
                switch (error.code) {
                    case "auth/invalid-credential":
                        toastify("Invalid Email or Password", "error");
                        break;
                    default:
                        toastify("Something went wrong while logging in", "error");
                        break;
                }
            })
            .finally(() => {
                setIsProcessing(false);
                setIsLoading(false);
            });
    }

    const logout = () => {
        setIsLoading(true);
        signOut(auth).then(() => {
            dispatch({ type: "SET_LOGGED_OUT" });
            toastify("User logged out", "error");
        }).catch((error) => {
            if (error.code) {
                toastify("Something went wrong while logging out", "error");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    if (isLoading) {
        return <ScreenLoader />
    }

    return (
        <AuthContext.Provider value={{ state, dispatch, isProcessing, login, logout, user: state.user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
