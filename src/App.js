import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
//npm i react-router-dom
//BrowserRouter allows us to use React router throughout app.
//Switch grabs only the first Route that matches.
//Route directs to a specific jsx file.

//IMPORTING COMPONENTS:
import Navbar from "./components/layout/Navbar";
import Splash from "./components/dashboard/Splash";
import Home from "./components/dashboard/Home";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import HostPrivateGame from "./components/dashboard/HostPrivateGame";
import Game from "./components/games/Game";
import CreatingGamePage from "./components/games/CreatingGamePage";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/splash" component={Splash} />
            <Route path="/hostPrivateGame" component={HostPrivateGame} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/game/:id" component={Game} />
            <Route path="/createGame/:id" component={CreatingGamePage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
