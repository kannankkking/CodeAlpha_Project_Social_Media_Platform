import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from "../firebase/firebase";
import { query, where, collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AppContext = ({ children }) => {
    const collectionUserRef = collection(db, "users");
    const provider = new GoogleAuthProvider();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    // Google Sign-In
    const signInWithGoogle = async () => {
        try {
            const popup = await signInWithPopup(auth, provider);
            const user = popup.user;
            const q = query(collectionUserRef, where("uid", "==", user.uid));
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
                await addDoc(collectionUserRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    image: user.photoURL,
                    authProvider: popup.providerId,
                });
            }
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    // Email and Password Login
    const loginWithEmailAndPassword = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    // Register with Email and Password
    const registerWithEmailAndPassword = async (name, email, password) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            await addDoc(collectionUserRef, {
                uid: user.uid,
                name: name,
                providerId: "email/password",
                email: user.email,
            });
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    // Send Password Reset Email
    const sendPasswordToUser = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("New password sent to your email");
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    // Sign out
    const signOutUser = async () => {
        await signOut(auth);
    };

    // Monitor Authentication State
    const userStateChanged = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const q = query(collectionUserRef, where("uid", "==", user.uid));
                const unsubscribe = onSnapshot(q, (doc) => {
                    setUserData(doc?.docs[0]?.data());
                });
                setUser(user);

                return () => unsubscribe(); // Clean up listener
            } else {
                setUser(null);
                setUserData(null);
                navigate("/login");
            }
        });
    };

    useEffect(() => {
        userStateChanged();
    }, []); // Empty dependency array to run only once on mount

    useEffect(() => {
        if (user || userData) {
            navigate("/");
        }
    }, [user, userData]); // Navigate when user or userData changes

    const initialState = {
        signInWithGoogle,
        loginWithEmailAndPassword,
        registerWithEmailAndPassword,
        sendPasswordToUser,
        signOutUser,
        user,
        userData,
    };
    

    return (
        <AuthContext.Provider value={initialState}>
            {children}
        </AuthContext.Provider>
    );
};

export default AppContext;
