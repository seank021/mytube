import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Header from '../components/header'
import Home from './home'
import Detail from './detail/detail'
import Login from './login'
import { useAuth, AuthProvider } from '../contexts/authContext'

const AppRoutes: React.FC = () => {
    const { isUser } = useAuth()
    const location = useLocation()
    const hideHeader: boolean = location.pathname === '/login'

    return (
        <>
            {!hideHeader && <Header />}
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={!isUser ? <Login /> : <Navigate to='/' />} />
                <Route path='/detail/:videoId' element={<Detail />} />
            </Routes>
            {location.pathname !== '/login' && <div className='h-40' />}
        </>
    )
}

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    )
}

export default App
