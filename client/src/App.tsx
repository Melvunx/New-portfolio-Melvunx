import Profile from "@components/Profile";
import { ThemeProvider } from "@components/theme-provider";
import Auth from "@pages/Auth";
import Home from "@pages/Home";
import NotFoundPage from "@pages/NotFoundPage";
import Project from "@pages/Projets";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/project",
    element: <Project />,
  },
]);

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
