import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
import Root from './routes/root.tsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard.tsx';
import SignIn from './components/forms/SignIn.tsx';
import SignUp from './components/forms/SignUp.tsx';
import App from './App.tsx';
import { Account } from './auth/Account.tsx';
import PrivateComponent from './auth/PrivateComponent.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <App />,
      },
      {
        path: '/dashboard',
        element: (
          <PrivateComponent>
            <Dashboard />
          </PrivateComponent>
        ),
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/signin',
        element: <SignIn />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Account>
      <RouterProvider router={router} />
    </Account>
  </React.StrictMode>
);
