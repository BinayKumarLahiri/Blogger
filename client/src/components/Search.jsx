import React, { useState } from "react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

const Search = ({ style }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${query}`);
    setQuery("");
  };
  return (
    <div className={`w-[20rem] md:w-96 ${style}`}>
      <form onSubmit={handleSubmit}>
        <input
          className={
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          }
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder={"Search Blogs..."}
        />
      </form>
    </div>
  );
};

export default Search;
