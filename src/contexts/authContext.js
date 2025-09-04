// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import firebase from '@/lib/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userObj, setUserObj] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async (authUser) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                uid: authUser.uid,
            },
            body: JSON.stringify({
                email: authUser.email,
                photoURL: authUser.photoURL,
                displayName: authUser.displayName,
            }),
        });

        const data = await res.json();
        if (data) setUserObj(data);
        setLoading(false);
    }, []);

    const refreshUserData = useCallback(() => {
        if (user) {
            fetchUserData(user);
        }
    }, [user, fetchUserData]);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                console.log(user.toJSON());
                setUser(user.toJSON());
                await fetchUserData(user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [fetchUserData]);

    return <AuthContext.Provider value={{ user, loading, userObj, refreshUserData }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
