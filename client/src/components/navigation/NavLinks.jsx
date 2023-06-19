import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import { AiOutlineSearch } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import SearchPosts from "../search/SearchPosts";
import SearchGames from "../search/SearchGames";
import Modal from "../UI/modal/Modal";

import "./NavLinks.css";
import Button from "../UI/button/Button";

const NavLinks = ({ cl }) => {
  const auth = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentSearch, setCurrentSearch] = useState({
    posts: true,
    games: false,
  });

  const [isAccessed, setIsAccessed] = useState(false);

  useEffect(() => {
    if (auth.role === "ADMIN" || auth.role === "OWNER") {
      setIsAccessed(true);
      // console.log("ROLEE " + auth.role);
    } else {
      setIsAccessed(false);
      // console.log("ROLEE " + auth.role);
    }
  }, [auth.isLoggedIn]);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const modalHeader = (
    <div className={cl.modal__header}>
      <div>Пошук на сайті</div>
      <GrClose className={cl.close__icon} onClick={closeModalHandler} />
    </div>
  );

  return (
    <>
      <Modal show={showModal} onCancel={closeModalHandler} header={modalHeader}>
        <Button
          label="Пости"
          inverse={currentSearch.posts}
          onClick={() => setCurrentSearch({ posts: true, games: false })}
        />
        <Button
          label="Ігри"
          inverse={currentSearch.games}
          onClick={() => setCurrentSearch({ posts: false, games: true })}
        />
        {currentSearch.posts && <SearchPosts closeModal={closeModalHandler} />}
        {currentSearch.games && <SearchGames closeModal={closeModalHandler} />}
      </Modal>

      <ul className={cl.nav_links}>
        <input
          type="checkbox"
          id="checkbox_toggle"
          onChange={() => setIsMenuOpen(!isMenuOpen)}
          checked={isMenuOpen}
        />
        <label htmlFor="checkbox_toggle" className={cl.hamburger}>
          &#9776;
        </label>
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`${cl.menu} menu ${isMenuOpen && "open"} ${
            isAccessed && cl.menu__admin
          }`}
        >
          <li>
            <AiOutlineSearch className={cl.search} onClick={showModalHandler} />
          </li>
          {/* {auth.role === "ADMIN" && (
            <li>
              <NavLink to="/uitest">UI-test</NavLink>
            </li>
          )} */}
          <li
            onClick={() =>
              localStorage.setItem(
                "sessionData",
                JSON.stringify({ postPage: 0 })
              )
            }
          >
            <NavLink to="/news">НОВИНИ</NavLink>
          </li>
          <li
            onClick={() =>
              localStorage.setItem(
                "sessionData",
                JSON.stringify({ postPage: 0 })
              )
            }
          >
            <NavLink to="/articles">СТАТТІ</NavLink>
          </li>
          <li
            onClick={() =>
              localStorage.setItem(
                "sessionData",
                JSON.stringify({ postPage: 0 })
              )
            }
          >
            <NavLink to="/reviews">ОГЛЯДИ</NavLink>
          </li>
          {auth.isLoggedIn && isAccessed && (
            <>
              <li>
                <NavLink to={`/${auth.userId}/posts`}>МОЇ ПОСТИ</NavLink>
              </li>
              <li>
                <NavLink to="/new-post">СТВОРИТИ ПОСТ</NavLink>
              </li>
              <li>
                <NavLink to="/add-game">ДОДАТИ ГРУ</NavLink>
              </li>
            </>
          )}

          {!auth.isLoggedIn && (
            <li>
              <NavLink to="/login">УВІЙТИ</NavLink>
            </li>
          )}

          {auth.role === "OWNER" && (
            <li>
              <NavLink to="/users">КОРИСТУВАЧІ</NavLink>
            </li>
          )}

          {auth.isLoggedIn && (
            <li
              onClick={() =>
                localStorage.setItem(
                  "sessionData",
                  JSON.stringify({ postPage: 0 })
                )
              }
            >
              <NavLink to={`/profile/${auth.userId}`}>ПРОФІЛЬ</NavLink>
            </li>
          )}

          {auth.isLoggedIn && (
            <li>
              <button
                onClick={() => {
                  auth.logout();
                  // navigate("/");
                }}
              >
                ВИЙТИ
              </button>
            </li>
          )}
        </div>
      </ul>
    </>
  );
};

export default NavLinks;
