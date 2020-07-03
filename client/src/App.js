import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Admin from './components/Admin';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Verify from './components/Verify';
import Error from './components/Error';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (

    <div>

      <Router>
      <Switch >
        
        <Route exact path="/" component={Admin}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/verify" component={Verify} />
        <Route exact path="/dashboard" component={Dashboard} />

        
        <Route  path="*" component={Error} />
        </Switch>
        
        
      </Router>
    </div>
  );
}

export default App;
