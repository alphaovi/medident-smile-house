import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./Pages/Routes/Routes";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ১. এখানে একটি ইনস্ট্যান্স তৈরি করতে হবে (new QueryClient())
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ২. ছোট হাতের queryClient পাস করতে হবে */}
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 99999 }}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);