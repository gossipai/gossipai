import React, { useContext, useState, useEffect } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth"
import { auth } from "./firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState()
  const [isLoading, setLoading] = useState(true)

  const clear = () => {
    setAuthUser(null);
    setLoading(false);
  };
  
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth).then(clear);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(true);
      if (!user) {
        clear();
        return;
      }
      let newUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      
      };
      setAuthUser(newUser);
      setLoading(false);
    });
      
    return unsubscribe;
  }, []);

  const value = {
    authUser,
    login,
    signup,
    logout,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}