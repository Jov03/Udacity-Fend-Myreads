import React, { Component } from "react";
import { Link } from "react-router-dom";
import Book from "./book";
import * as BooksAPI from "../BooksAPI";

class Bookshelf extends Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: []
  };
  componentDidMount() {
  
    BooksAPI.getAll().then(res => {
      res.forEach(book => {
        if (book.shelf === "currentlyReading") {
          this.setState(prevState => ({
            currentlyReading: [...prevState.currentlyReading, book]
          }));
        }
        if (book.shelf === "wantToRead") {
          this.setState(prevState => ({
            wantToRead: [...prevState.wantToRead, book]
          }));
        }
        if (book.shelf === "read") {
          this.setState(prevState => ({
            read: [...prevState.read, book]
          }));
        }
      });
    });
  }
  moveBook = (book, event) => {
    var moveTo = event.target.value;
    if (moveTo !== "none") {
      var fromShelf = book.shelf;
      book.shelf = moveTo;
      this.setState(prevState => ({
        [fromShelf]: prevState[fromShelf].filter(
          bookInArray => bookInArray !== book
        ),
        [moveTo]: [...prevState[moveTo], book]
      }));
      BooksAPI.update(book,moveTo);
    }
  };

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Currently Reading</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {this.state.currentlyReading.map(book => (
                    <li key={book.title}>
                      <Book
                        book={book}
                        shelf="currentlyReading"
                        moveBook={this.moveBook}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Want to Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {this.state.wantToRead.map(book => (
                    <li key={book.title}>
                      <Book
                        book={book}
                        shelf="wantToRead"
                        moveBook={this.moveBook}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {this.state.read.map(book => (
                    <li key={book.title}>
                      <Book book={book} shelf="read" moveBook={this.moveBook} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    );
  }
}

export default Bookshelf;
