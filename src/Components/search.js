import React, { Component } from "react";
import { Link } from "react-router-dom";
import Book from "./book";
import * as BooksAPI from "../BooksAPI";

class Search extends Component {
  state = {
    books: [],
    query: ""
  };

  search = query => {
    if (query) {
      this.setState({
        query: query,
        noSearchResults:false
      });
    } else {
      this.setState({
        query: query,
        books: [],
        noSearchResults:false
      });
    }
  };
  searchSubmit = event => {
    if (event.keyCode === 13) {
      let searchQuery = this.state.query;
      let searchResults;
     

      BooksAPI.search(searchQuery)
        .then(res => {
          if (!res.error) {
            //to have same shelf state as in home screen
            BooksAPI.getAll().then(booksInShelf => {
              searchResults = res.map(resultBook => {
                for (let x = 0; x < booksInShelf.length; x++) {
                  if (booksInShelf[x].id === resultBook.id) {
                    resultBook.shelf = booksInShelf[x].shelf;
                    return resultBook;
                  }
                }
                return resultBook;
              });
              //For books without any imageLink property
              this.setState({
                books: searchResults.filter(book => {
                  if (book.imageLinks) {
                    return book;
                  }else{
                    book.imageLinks={
                      thumbnail:''
                    }
                    return book;
                  }
                })
              });
            });
          }else{
            this.setState({
              books:[],
              noSearchResults:true
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({
            books: [],
            noSearchResults:true
          });
        });
    }
  };

  moveBook = (book, event) => {
    var moveTo = event.target.value;
    if (moveTo !== "none") {
      book.shelf = moveTo;
      BooksAPI.update(book,moveTo).then(()=>{

        this.props.history.push('/');
      });
    }
  };

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
            <input
              type="text"
              value={this.state.query}
              onChange={event => this.search(event.target.value)}
              onKeyDown={this.searchSubmit}
              placeholder="Search by title or author"
            />
          </div>
        </div>
        <div className="search-books-results">
          {(this.state.noSearchResults&&<div style={{textAlign:'center'}}>No results</div>)}
          <ol className="books-grid">
            {this.state.books.map(book => (
              <li key={book.id}>
                <Book
                  book={book}
                  shelf={book.shelf ? book.shelf : ""}
                  moveBook={this.moveBook}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;
