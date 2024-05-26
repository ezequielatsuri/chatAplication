import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.headers.common['Content-Type'] ='application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = localStorage.getItem('token');

if(token){
  console.log(`Bearer ${token}`);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}else{
  delete axios.defaults.headers.common['Authorization'];
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
