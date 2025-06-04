import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
    isUser: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isUser, setIsUser] = useState<boolean>(() => localStorage.getItem('isUser') === 'true')

    const login = () => {
        localStorage.setItem('isUser', 'true')
        setIsUser(true)
    }

    const logout = () => {
        localStorage.removeItem('isUser')
        setIsUser(false)
        window.location.reload()
    }

    useEffect(() => {
        const stored = localStorage.getItem('isUser') === 'true'
        setIsUser(stored)
    }, [])

    return <AuthContext.Provider value={{ isUser, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
