import { createBrowserRouter } from "react-router-dom";

import Home from "../Home";
import App from "../App";
import PostsPage from "../components/Posts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/news",
    element: <PostsPage />,
  },
]);

export default router;
