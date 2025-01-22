import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import React from 'react'

import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUP"
import Home from "./pages/Home/Home"

const App = () => {
  return (
    <div className='text-red-600 font-bold text-5xl'>
      <Router>
        <Routes>
          <Route path='/dashboard' exact element={<Home/>}/>
          <Route path='/Login' exact element={<Login/>}/>
          <Route path='/SignUp' exact element={<SignUp/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;