import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom' // Меняем импорт здесь
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* И меняем обертку здесь */}
      <App />
    </HashRouter>
  </React.StrictMode>,
)