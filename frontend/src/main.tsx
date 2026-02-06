import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * Punto de entrada principal de la aplicación Algorint
 * 
 * Esta aplicación educativa está diseñada para enseñar
 * Algoritmos y Estructuras de Datos con Python, preparando
 * a los usuarios para entrevistas técnicas tipo FAANG.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
