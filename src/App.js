import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import ReactLoading from "react-loading";
import logo from "./logo.svg";

export default function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const { loading, error, books, hasMore } = useBookSearch(
    query,
    pageNumber,
    pageSize
  );

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
          setPageSize((prevPageSize) => prevPageSize);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React Infinite Scrolling</h1>
      </header>

      <main className="App-body">
        <input
          type="search"
          value={query}
          className="App-Input"
          placeholder="Search Book..."
          onChange={handleSearch}
        />
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div ref={lastBookElementRef} key={book}>
                {book}
              </div>
            );
          } else {
            return <div key={book}>{book}</div>;
          }
        })}
        <div className="App-loading">
          {loading && (
            <ReactLoading type="bars" color="#61dafb" height={45} width={45} />
          )}
        </div>
        <div>{error && "Error!!"}</div>
      </main>
    </div>
  );
}
