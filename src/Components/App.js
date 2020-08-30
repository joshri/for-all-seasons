import React from 'react';
import './App.css';
import {Route} from 'react-router-dom'
import Home from './Home'
import Header from './Header'

function App() {
  return (
    <div className="App">
      <Header />
      <Route exact path='./' render={() => {
        return <Home />
      }}/>
    </div>
  );
}

export default App;
