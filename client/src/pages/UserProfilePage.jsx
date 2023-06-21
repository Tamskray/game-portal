import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/auth-context";

import { getPageCount, getPagesArray } from "../utils/pages";
import { useParams } from "react-router-dom";
import Avatar from "../components/UI/avatar/Avatar";

import cl from "../styles/UserProfile.module.css";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import CommentsList from "../components/posts/comments/CommentsList";
import Button from "../components/UI/Button/Button";
import Pagination from "../components/UI/pagination/Pagination";
import PostItemSkeleton from "../components/posts/PostItemSkeleton";
import Modal from "../components/UI/modal/Modal";
import UpdateUserProfile from "../components/users/UpdateUserProfile";

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

  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);

  const fetchUser = async (limit = 0, page = 0) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/profile/${params.uid}?limit=${limit}&page=${page}`,
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

  const refreshUserProfileInfoHandler = useCallback(() => {
    auth.token && fetchUser(limit, page);
    console.log("Profile info updated");
  }, []);

  const changePageHandler = (page) => {
    setPage(page);
    console.log("Page " + page);
    fetchUser(limit, page);

    localStorage.setItem("sessionData", JSON.stringify({ postPage: page }));
  };

  const closeUpdateUserModalHandler = () => {
    setShowUpdateUserModal(false);
  };

  const showUpdateUserModalHandler = () => {
    setShowUpdateUserModal(true);
  };

  return (
    <>
      {loadedUser && (
        <>
          <Modal
            show={showUpdateUserModal}
            onCancel={closeUpdateUserModalHandler}
            header={`Редагування даних ${loadedUser.username}`}
          >
            <UpdateUserProfile
              user={loadedUser}
              closeModal={closeUpdateUserModalHandler}
              refreshInfo={refreshUserProfileInfoHandler}
            />
          </Modal>
          <div>
            {loadedUser && (
              <>
                <div className={cl.container}>
                  <div className={cl.user__image}>
                    <Avatar
                      image={
                        loadedUser.image && loadedUser.image
                          ? process.env.REACT_APP_URL + loadedUser.image
                          : "https://cdn-icons-png.flaticon.com/512/5397/5397197.png"
                      }
                      alt={loadedUser.username}
                    />
                  </div>
                  <div className={cl.user__info}>
                    <h3>{loadedUser.username}</h3>
                    <h3>{loadedUser.email}</h3>
                    <div>
                      <Button
                        label="Редагувати дані"
                        onClick={showUpdateUserModalHandler}
                      />
                    </div>
                  </div>
                </div>

                {/* <hr /> */}
                <h3>Активність</h3>
                {!loadedUser.comments.length && (
                  <h2>{`${loadedUser.username} не проявляв ніякої активності :(`}</h2>
                )}
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <PostItemSkeleton itemsNumber={2} />
                  </>
                ) : (
                  <CommentsList items={loadedUser.comments} activity />
                )}

                {pagesArray && pagesArray.length > 1 && (
                  <Pagination
                    pagesArray={pagesArray}
                    currentPage={page}
                    changePage={changePageHandler}
                  />
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserProfilePage;
