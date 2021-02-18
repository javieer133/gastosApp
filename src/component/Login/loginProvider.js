import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../../config/Firebase'

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}



export function LoginProvider({ children }){
    
    const [currentUser, setCurrentUser] = useState()
    
    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout(){
        return auth.signOut()
    }

    function singUp(email, password){
        return auth.createUserWithEmailAndPassword(email, password)
    }

    useEffect(() =>{
        const unsuscribe = auth.onAuthStateChanged( user => {
            setCurrentUser(user)
        })
        return unsuscribe
    }, [])
    
    const value = {
        currentUser, 
        login,
        logout,
        singUp
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}