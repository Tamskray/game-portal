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

function App() {
  const { token, login, logout, userId, role } = useAuth();

  useEffect(() => {
    localStorage.clear();
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
        {
          path: "/posts",
          element: <PostsPage />,
        },
        {
          path: "/new-post",
          element: role === "ADMIN" ? <NewPostPage /> : <Navigate to="/" />,
        },
        {
          path: "/posts/:postId",
          element: <PostPage />,
        },
        {
          path: "/:userId/posts",
          element: <UserPostsPage />,
        },
        {
          path: "/update-posts/:postId",
          element: <UpdatePostPage />,
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
