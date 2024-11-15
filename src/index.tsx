import {CssBaseline, ThemeProvider, Typography, useColorScheme} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';

import theme from './utils/theme';
import MainLayout from './layouts/main';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';

// CSS
import "./utils/stylingUtils.css"
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/login';
import SecurePageWrapper from './utils/secureWrapper';
import Home from './pages/home';

// Firebase
import initFirebase from './utils/firebase';
import { DataSnapshot, get, getDatabase, ref, set } from 'firebase/database'

// react-toastify
import {toast, ToastContainer} from 'react-toastify';
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import CreateNewMedia from './pages/admin/createNewMedia';
import { createNewCategoryRoute } from './pages/admin/requests/createNewCategory';
import { createNewMediaRequestRoute } from './pages/admin/requests/createNewMedia';
import { viewPostRoute } from './pages/viewPost';
import { searchRoute } from './pages/search';
import {dashboardRoute} from "./pages/admin/dashboard";
import {manageArticlesRoute} from "./pages/admin/manageArticles";
import {newAdminRoute} from "./pages/admin/newAdmin";
import {newAdminRequestRoute} from "./pages/admin/requests/newAdmin";
import {editHeadlineCategoryRoute} from "./pages/admin/requests/editHeadlineCategory";
import {editCategoryDescriptionRoute} from "./pages/admin/requests/editCategoryDescription";
import {editCategoryImageRoute} from "./pages/admin/requests/editCategoryImage";

// Services
initFirebase()

// Router definition
const websiteRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'admin',
        element: <SecurePageWrapper />,
        children: [
          dashboardRoute,
          manageArticlesRoute,
          newAdminRoute,
          {
            path: 'createNewMedia',
            element: <CreateNewMedia />
          },
          {
            path: 'requests',
            children: [
              createNewMediaRequestRoute,
              createNewCategoryRoute,
              newAdminRequestRoute,
              editHeadlineCategoryRoute,
              editCategoryDescriptionRoute,
              editCategoryImageRoute,
            ]
          }
        ]
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'logout',
            loader: async ({params, request}) => {
              toast.info("Disconnessione avviata.")
              let disconnect = onAuthStateChanged(
                  getAuth(),
                  (user) => {
                    if (user) {
                      toast.promise(
                          signOut(getAuth()).catch((err) => toast.error(err)).finally(() => disconnect()),
                          {
                            pending: "Disconnessione in corso...",
                            success: "Disconnessione effettuata!",
                            error: "Errore nella disconnessione."
                          }
                      )
                    }
                  }
              )

              throw redirect("/")
            }
          }
        ]
      },
      {
        index: true,
        element: <Home />
      },
      viewPostRoute,
      searchRoute
    ]
  }
])

// Page rendering
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline enableColorScheme={true} />
    <RouterProvider router={websiteRouter} />        
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="light"
    />
  </ThemeProvider>
);
