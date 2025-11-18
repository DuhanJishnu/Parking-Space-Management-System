import React, { createContext, useState } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser, role, setRole }}>
            {children}
        </UserContext.Provider>
    );
};