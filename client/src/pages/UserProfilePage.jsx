import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth-context";

import { getPageCount, getPagesArray } from "../utils/pages";
import { useParams } from "react-router-dom";
import Avatar from "../components/UI/avatar/Avatar";

import cl from "../styles/UserProfile.module.css";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import CommentsList from "../components/posts/comments/CommentsList";
import Button from "../components/UI/Button/Button";

const UserProfilePage = () => {
  const params = useParams();
  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [limit, setLimit] = useState(2);
  const storedData = JSON.parse(localStorage.getItem("sessionData"));
  const [page, setPage] = useState(storedData ? storedData.postPage : 0);

  const [totalPages, setTotalPages] = useState("");
  const pagesArray = getPagesArray(totalPages);
  //   const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //   console.log(localStorage.getItem("userData", "token"));

  const fetchUser = async (limit = 0, page = 0) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/users/profile/${params.uid}?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
            // "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData.message);
      }

      const totalCount = response.headers.get("X-Total-Count");
      setTotalPages(getPageCount(totalCount, limit));

      console.log(responseData);

      setLoadedUser(responseData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    auth.token && fetchUser(limit, page);
  }, [auth.token]);

  const changePageHandler = (page) => {
    setPage(page);
    console.log("Page " + page);
    fetchUser(limit, page);

    localStorage.setItem("sessionData", JSON.stringify({ postPage: page }));
  };

  return (
    <>
      {/* {isLoading && <LoadingSpinner />} */}
      <div>
        {loadedUser && (
          <>
            <div className={cl.container}>
              <div className={cl.user__image}>
                <Avatar
                  image={
                    loadedUser.image && loadedUser.image
                      ? "http://localhost:5000/" + loadedUser.image
                      : "https://external-preview.redd.it/s40RczXEeh8Q0z6sc-u8cFFCpYdoUsjOpY9-Z-CDjms.jpg?auto=webp&s=7b5c42fc8df7cb5730705fd3e70a65f51750056e"
                  }
                  alt={loadedUser.username}
                />
              </div>
              <div className={cl.user__info}>
                <h3>{loadedUser.username}</h3>
                <h3>{loadedUser.email}</h3>
                <div>
                  <Button label="Редагувати дані" />
                </div>
              </div>
            </div>

            {/* <hr /> */}
            <h3>Активність</h3>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <CommentsList items={loadedUser.comments} activity />
            )}

            {pagesArray && pagesArray.length > 1 && (
              <div>
                {pagesArray.map((p) =>
                  page === p ? (
                    <Button
                      key={p}
                      label={p + 1}
                      inverse
                      onClick={() => changePageHandler(p)}
                    />
                  ) : (
                    <Button
                      key={p}
                      label={p + 1}
                      onClick={() => changePageHandler(p)}
                    />
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UserProfilePage;
