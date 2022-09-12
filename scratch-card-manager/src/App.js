import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {toast} from 'react-toastify'

// CSS
import './App.css'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import MainPage from './pages/main-page'
import AdminPage from './pages/admin-page'

// Configures toast messages
toast.configure({
  autoClose: 8000,
  className: 'toast-container',
  position: toast.POSITION.TOP_CENTER
})

const App = () => (
  <Router>
    <Route exact path="/" component={MainPage} />
    <Route exact path="/admin" component={AdminPage} />
  </Router>
)

export default App
