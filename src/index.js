import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { LoginProvider } from './component/Login/loginProvider'
import Home from './component/Home';
import Login from './component/Login/'
import SingUp from './component/SingUp/SingUp'

const Root = (
  <BrowserRouter>
    <LoginProvider>
      <SnackbarProvider maxSnack={3}>
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/singUp" component={SingUp}/>
            <Route path="/home" component={Home}/>
            <Redirect from="/" to="/login"/>
        </Switch>
      </SnackbarProvider>
    </LoginProvider>
  </BrowserRouter>  
);

ReactDom.render(Root, document.getElementById('root'));