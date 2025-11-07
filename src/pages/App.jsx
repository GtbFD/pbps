import { useEffect, useState } from "react";
import CartProvider from "../components/Cart";
import Cart from "../components/Cart";
import CodeSearchArea from "../components/CodeSearchArea";
import Navbar from "../components/Navbar";
import "/src/css/app.css";
import Footer from "../components/Footer";

const OPENED_CART_KEY = "OPENED_CART";

const isCartOpened = () => {
  return JSON.parse(localStorage.getItem(OPENED_CART_KEY));
};

function App(props) {
  const [isOpened, setIsOpened] = useState(isCartOpened);

  const openCart = () => {
    localStorage.setItem(OPENED_CART_KEY, JSON.stringify(true));
    setIsOpened(true);
  };

  const closeCart = () => {
    localStorage.setItem(OPENED_CART_KEY, JSON.stringify(false));
    setIsOpened(false);
  };

  return (
    <>
      <Navbar />

      {props.children}
      <div className="cart-access" id="cart-access" onClick={openCart}>
        <img className="cart-access-icon" src="images/cart-icon.png"></img>
      </div>
      {isOpened && <Cart openCart={openCart} closeCart={closeCart} />}
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
}

export default App;
