import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { AiOutlineSearch } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import Modal from "../UI/modal/Modal";
import Button from "../UI/Button/Button";

import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";

const NavLinks = ({ cl }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [searchedPosts, setSearchedPosts] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
    setSearchedPosts("");
  };

  const onSearchItem = (postId) => {
    navigate(`/posts/${postId}`);
    closeModalHandler();
  };

  const modalHeader = (
    <div className={cl.modal__header}>
      <div>Пошук постів</div>
      <GrClose className={cl.close__icon} onClick={closeModalHandler} />
    </div>
  );

  const searchPosts = async (search) => {
    // const searchValue = event.target.value;
    const searchValue = search;

    setIsLoading(true);

    const response = await fetch(
      `http://localhost:5000/api/posts/search?q=${searchValue}`
    );

    const responseData = await response.json();

    setSearchedPosts(responseData);
    // console.log(searchedPosts);

    setIsLoading(false);
  };

  useEffect(() => {
    searchPosts("");
    // console.log("searchhed " + searchedPosts);
  }, []);

  return (
    <>
      <Modal show={showModal} onCancel={closeModalHandler} header={modalHeader}>
        <input
          className={cl.search__input}
          type="text"
          onChange={(event) => searchPosts(event.target.value)}
        />
        {/* {console.log(searchedPosts)} */}
        {/* {isLoading && <LoadingSpinner className="center" />} */}
        {!isLoading &&
          searchedPosts &&
          Array.isArray(searchedPosts) &&
          searchedPosts.map((post) => (
            <div
              className={cl.search__item}
              key={post._id}
              onClick={() => onSearchItem(post._id)}
            >
              <div className={cl.search__item__title}>{post.title}</div>
              <div className={cl.search__item__description}>
                {post.description}
              </div>
            </div>
            // }
          ))}
        {!isLoading && searchPosts && !Array.isArray(searchedPosts) && (
          <div>{searchedPosts}</div>
        )}
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
            auth.role === "ADMIN" && cl.menu__admin
          }`}
        >
          <li>
            <AiOutlineSearch className={cl.search} onClick={showModalHandler} />
          </li>
          {auth.role === "ADMIN" && (
            <li>
              <NavLink to="/uitest">UI-test</NavLink>
            </li>
          )}
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
          {auth.isLoggedIn && auth.role === "ADMIN" && (
            <>
              <li>
                <NavLink to={`/${auth.userId}/posts`}>МОЇ ПОСТИ</NavLink>
              </li>
              <li>
                <NavLink to="/new-post">СТВОРИТИ ПОСТ</NavLink>
              </li>
            </>
          )}

          {!auth.isLoggedIn && (
            <li>
              <NavLink to="/login">УВІЙТИ</NavLink>
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
