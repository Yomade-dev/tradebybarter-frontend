import React from 'react';

const SearchBar = ({ value, onChange, onSubmit, inputRef }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="search-label" htmlFor="home-search">Search</label>
      <div className="search-row">
        <input
          id="home-search"
          ref={inputRef}
          type="text"
          className="form-control search-input"
          placeholder="Items or people"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        {value.trim() && (
          <button type="submit" className="search-go" aria-label="Search">
            Search
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;