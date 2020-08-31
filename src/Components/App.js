import React from 'react';
import './App.css';
import {Route} from 'react-router-dom'
import Home from './Home'
import Header from './Header'

function App() {
  return (
    <div >
      <Header />
      <Home />
      
    </div>
  );
}

export default App;
