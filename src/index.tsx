import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';

import theme from './utils/theme';
import MainLayout from './layouts/main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// CSS
import "./utils/stylingUtils.css"
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/login';
import SecurePageWrapper from './utils/secureWrapper';
import Home from './pages/home';
import Dashboard from './pages/admin/dashboard';

// Firebase
import initFirebase from './utils/firebase';

// react-toastify
import { ToastContainer } from 'react-toastify';
import { getAuth, signOut } from 'firebase/auth';

// Services
initFirebase()

// Router definition
const websiteRouter = (
  <BrowserRouter>
    <Routes>
      <Route path='/admin' element={<SecurePageWrapper />}>
        <Route index path='dashboard' element={<Dashboard />} />
        <Route index element={<Dashboard />} />
      </Route>

      <Route path='/auth'>
        <Route path='login' element={<Login />} />
      </Route>
      <Route path="/logout" loader={() => {
        signOut(getAuth())
        return true
      }} />

      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
)

// Page rendering
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout>
        {websiteRouter}
      </MainLayout>
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
  </React.StrictMode>
);
