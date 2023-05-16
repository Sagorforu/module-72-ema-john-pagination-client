import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { totalProducts } = useLoaderData();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const options = [5, 10, 15];
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  //   const pageNumbers = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     pageNumbers.push(i);
  //   }

  const pageNumbers = [...Array(totalPages).keys()];

  /**
   * Done: 1. Determine the total number of items.
   * TODO: 2. Decide on the of items per page.
   * Done: 3. Calculate the total number of pages.
   * Done: 4. Determine the current page.
   * Done: 5. Load the appropriate data.
   */

  //   useEffect(() => {
  //     fetch("http://localhost:5000/products")
  //       .then((res) => res.json())
  //       .then((data) => setProducts(data));
  //   }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://localhost:5000/products?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await response.json();
      setProducts(data);
    }
    fetchData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const ids = Object.keys(storedCart);
    fetch("http://localhost:5000/productsByIds", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((cartProducts) => {
        const savedCart = [];
        // step 1: get id
        for (const id in storedCart) {
          // console.log(id)
          // step 2: get the product by using id
          const addedProduct = cartProducts.find((product) => product._id === id);
          if (addedProduct) {
            // step 3: get the quantity of the product
            const quantity = storedCart[id];
            addedProduct.quantity = quantity;
            // step 4: add the addedProduct to the saved cart
            savedCart.push(addedProduct);
          }
          //   console.log(addedProduct);
        }
        // step 5: set the cart
        setCart(savedCart);
      });
  }, []);

  const handleAddToCart = (product) => {
    // cart.push(product);
    const newCart = [...cart, product];
    setCart(newCart);
    addToDb(product._id);
  };
  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleSelectChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  return (
    <>
      <div className="shop-container">
        <div className="products-container">
          {products.map((product) => (
            <Product
              key={product._id}
              product={product}
              handleAddToCart={handleAddToCart}
            ></Product>
          ))}
        </div>
        <div className="cart-container">
          <Cart handleClearCart={handleClearCart} cart={cart}>
            <Link className="proceed-link" to="/orders">
              <button className="btn-proceed">
                <span>Review Orders</span>{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </Link>
          </Cart>
        </div>
      </div>
      {/* Pagination */}
      <div className="pagination">
        <p>
          CurrentPage: {currentPage} and items per page: {itemsPerPage}
        </p>
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={currentPage === number ? "selected" : ""}
            onClick={() => setCurrentPage(number)}
          >
            {number + 1}
          </button>
        ))}
        <select value={itemsPerPage} onChange={handleSelectChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Shop;
