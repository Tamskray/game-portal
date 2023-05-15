import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import UITestPage from "../pages/UITestPage";
import LoginPage from "../pages/LoginPage";
import PostsPage from "../pages/PostsPage";

const testIsLogged = true;

export const router = createBrowserRouter([
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
        element: testIsLogged ? <UITestPage /> : <Navigate to="/" />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/posts",
        element: <PostsPage />,
      },
    ],
  },
]);
