import React, { useState } from 'react';

function CategorySearch({onSearch}) {
    let [search , setSearch]=useState("");

const handleSearch=()=>{
    onSearch(search);
} 
    return (
        <>
        <div className='search-container'>
            <input type="text" placeholder='Search category' onChange={(e)=> setSearch(e.target.value)}/>
            <button onClick={handleSearch}>Search</button>
        </div>
        </>
    );
}

export default CategorySearch;