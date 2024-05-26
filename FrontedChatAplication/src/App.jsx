import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ChatDashboard from './components/ChatDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
