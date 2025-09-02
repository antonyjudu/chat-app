import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext.jsx';

function App() {
  const {authUser} = useContext(AuthContext);

  return (
    <div className="bg-[url('./bgImage.svg')] bg-contain sm:bg-cover">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  )
}

export default App
