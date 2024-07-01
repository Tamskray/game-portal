import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home/Home";
import PostsPage from "../pages/PostsPage/PostsPage";
import Layout from "../pages/Layout/Layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/news",
        element: <PostsPage rubric={"news"} />,
      },
      {
        path: "/articles",
        element: <PostsPage rubric={"articles"} />,
      },
      {
        path: "/reviews",
        element: <PostsPage rubric={"reviews"} />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
