import React, { useCallback, useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { useAuth } from "../hooks/auth-hook";
import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";

import cl from "../styles/UsersPage.module.css";
import UsersList from "../components/users/UsersList";

const UsersPage = () => {
  const auth = useAuth(AuthContext);
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchUser, setSearchUser] = useState("");

  const fetchUsers = useCallback(async (token) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/users?token=${token}`
      );

      setLoadedUsers(responseData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const updateUserList = () => {
    console.log("Users list updated");
    auth.token && fetchUsers(auth.token);
  };

  useEffect(() => {
    auth.token && fetchUsers(auth.token);
  }, [sendRequest, auth.token]);

  const userSearchHandler = (event) => {
    setSearchUser(event.target.value);
  };

  let filteredUsers;

  if (loadedUsers) {
    filteredUsers = loadedUsers.filter((user) =>
      user.username.toLowerCase().includes(searchUser.toLowerCase())
    );
  }

  return (
    <>
      {error && (
        <div style={{ fontSize: 24 }}>
          {error}
          <p>What are you doing here?</p>
          <h1>-_-</h1>
        </div>
      )}
      {isLoading && <LoadingSpinner />}

      {!isLoading && loadedUsers && (
        <div className={cl.users__container}>
          <h2>Список користувачів</h2>
          <input
            className={cl.search__input}
            type="text"
            placeholder="Знайти користувача..."
            value={searchUser}
            onChange={userSearchHandler}
          />
          <UsersList items={filteredUsers} updateUserList={updateUserList} />
        </div>
      )}
    </>
  );
};

export default UsersPage;
