import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
};

export default App;
