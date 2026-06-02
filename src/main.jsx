import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

if (typeof document !== 'undefined') {
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.backgroundColor = '#111111';
  document.body.style.color = '#ffffff';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)