import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
// import { router } from "./router/roiting";
import { useAuth } from "./hooks/auth-hook";
import { AuthContext } from "./context/auth-context";

import Layout from "./pages/Layout";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import UITestPage from "./pages/UITestPage";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import PostPage from "./pages/PostPage";
import NewPostPage from "./pages/NewPostPage";
import UpdatePostPage from "./pages/UpdatePostPage";
import UserPostsPage from "./pages/UserPostsPage";
import UserProfilePage from "./pages/UserProfilePage";
import GamePage from "./pages/GamePage";
import NewGamePage from "./pages/NewGamePage";
import UpdateGamePage from "./pages/UpdateGamePage";

import.meta.env.MODE;

function App() {
  const { token, login, logout, userId, role } = useAuth();

  console.log(role);
  console.log("refresh");

  useEffect(() => {
    localStorage.setItem("sessionData", JSON.stringify({ postPage: 0 }));
    // console.log(token);
  }, []);

  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/uitest",
          element: token ? <UITestPage /> : <Navigate to="/" />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        // {
        //   path: "/posts",
        //   element: <PostsPage />,
        // },
        {
          path: "/news",
          element: <PostsPage news />,
        },
        {
          path: "/articles",
          element: <PostsPage articles />,
        },
        {
          path: "/reviews",
          element: <PostsPage reviews />,
        },
        {
          path: "/new-post",
          element: role === "ADMIN" ? <NewPostPage /> : <Navigate to="/" />,
        },
        {
          path: "/add-game",
          // element: <NewGamePage />,
          element: role === "ADMIN" ? <NewGamePage /> : <Navigate to="/" />,
        },
        {
          path: "/posts/:postId",
          element: <PostPage />,
        },
        {
          path: "/game/:gameId",
          element: <GamePage />,
        },
        {
          path: "/:userId/posts",
          element: <UserPostsPage />,
        },
        {
          path: "/update-posts/:postId",
          element: <UpdatePostPage />,
        },
        {
          path: "/update-game/:gameId",
          element: <UpdateGamePage />,
        },
        {
          path: "/profile/:uid",
          element: token ? <UserProfilePage /> : <Navigate to="/" />,
        },
      ],
    },
  ]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        role: role,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <RouterProvider router={router}></RouterProvider>
    </AuthContext.Provider>
  );
}

export default App;
