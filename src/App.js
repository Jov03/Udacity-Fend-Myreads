import React from "react";
import "./App.css";
import Search from "./Components/search";
import { Route } from "react-router-dom";
import Bookshelf from "./Components/bookshelf";

class BooksApp extends React.Component {

  render() {
    return (
      <div className="app">
        <Route exact path="/search" component={Search} />
        <Route exact path="/" component={Bookshelf} />

      </div>
    );
  }
}

export default BooksApp;
