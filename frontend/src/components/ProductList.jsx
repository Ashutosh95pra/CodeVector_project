import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import CategorySearch from "./CategorySearch";

const BASE_URL = "https://codevector-project-2.onrender.com/products";

function ProductList() {
  const [data, setData] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [message, setMessage] = useState("");
  const [currentCursor, setCurrentCursor] = useState(null);
const [cursorHistory, setCursorHistory] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("");

  const fetchProducts = async (url) => {
    try {
      const response = await axios.get(url);
      setData(response.data.products);
      setNextCursor(response.data.nextCursor);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(`${BASE_URL}?limit=20`);
  }, []);

  const handleNext = () => {
  if (!nextCursor) return;

  setCursorHistory((prev) => [...prev, currentCursor]);
  setCurrentCursor(nextCursor);

  let url =
    `${BASE_URL}?limit=20` +
    `&cursorCreateAt=${encodeURIComponent(nextCursor.cursorCreateAt)}` +
    `&cursorId=${encodeURIComponent(nextCursor.cursorId)}`;

  if (selectedCategory) {
    url += `&category=${encodeURIComponent(selectedCategory)}`;
  }

  fetchProducts(url);
};
  const handlePrevious = () => {
  const history = [...cursorHistory];
  const previousCursor = history.pop();

  setCursorHistory(history);
  setCurrentCursor(previousCursor || null);

  let url = `${BASE_URL}?limit=20`;

  if (previousCursor) {
    url +=
      `&cursorCreateAt=${encodeURIComponent(previousCursor.cursorCreateAt)}` +
      `&cursorId=${encodeURIComponent(previousCursor.cursorId)}`;
  }

  if (selectedCategory) {
    url += `&category=${encodeURIComponent(selectedCategory)}`;
  }

  fetchProducts(url);
};

 
const handleCategorySearch = async (category) => {
  try {
    setSelectedCategory(category);

    // Reset pagination
    setCursorHistory([]);
    setCurrentCursor(null);

    const response = await axios.get(
      `${BASE_URL}?category=${encodeURIComponent(category)}&limit=20`
    );

    setData(response.data.products);
    setNextCursor(response.data.nextCursor);

    if (response.data.products.length === 0) {
      setMessage("No products found for this category.");
    } else {
      setMessage("");
    }
  } catch (error) {
    setMessage("Something went wrong.");
  }
};

  return (
    <>
    <CategorySearch onSearch={handleCategorySearch}/>
    {message && <p className="error-message">{message}</p>}
      <div className="container">
        {data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="pagination">
        <button
    onClick={handlePrevious}
    disabled={cursorHistory.length === 0}
  >
    Previous
  </button>
        <button onClick={handleNext} disabled={!nextCursor}>
          Next
        </button>
      </div>
    </>
  );
}

export default ProductList;