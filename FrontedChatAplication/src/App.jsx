import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ChatDashboard from './components/ChatDashboard';
import Register from './components/Register';
import TestUpload from './components/TestUpload';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatDashboard />} />
        <Route path="/test-upload" element={<TestUpload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
