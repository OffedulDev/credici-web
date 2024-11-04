import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
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
import { ToastContainer } from 'react-toastify';
import { getAuth, signOut } from 'firebase/auth';
import CreateNewMedia from './pages/admin/createNewMedia';
import { createNewCategoryRoute } from './pages/admin/requests/createNewCategory';
import { createNewMediaRequestRoute } from './pages/admin/requests/createNewMedia';
import { viewPostRoute } from './pages/viewPost';
import { searchRoute } from './pages/search';

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
          {
            path: 'createNewMedia',
            element: <CreateNewMedia />
          },
          {
            path: 'requests',
            children: [
              createNewMediaRequestRoute,
              createNewCategoryRoute
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
    <CssBaseline />
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
