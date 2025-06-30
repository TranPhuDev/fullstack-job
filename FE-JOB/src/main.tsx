import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import BookPage from 'pages/client/book';
import AboutPage from 'pages/client/about';
import LoginPage from 'pages/client/auth/login';
import RegisterPage from 'pages/client/auth/register';
import 'styles/global.scss'
import HomePage from 'pages/client/home';
import { App } from 'antd';
import { AppProvider } from 'components/context/app.context';
import LayoutAdmin from "components/layout/layout.admin.tsx"
import ProtectedRoute from '@/components/checkAuth/auth';
import CompanyPage from './pages/admin/manage.company';
import DashBoardPage from './pages/admin/dashboard';
import UserPage from './pages/admin/manage.user';
import JobPage from './pages/admin/manage.job';
import ResumePage from './pages/admin/manage.resume';
import PermissionPage from './pages/admin/manage.permisson';
import RolePage from './pages/admin/manage.role';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
    ]
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: (<ProtectedRoute><DashBoardPage /></ProtectedRoute>) },
      {
        path: "company",
        element: (<ProtectedRoute><CompanyPage /></ProtectedRoute>),
      },
      {
        path: "user",
        element: (<ProtectedRoute><UserPage /></ProtectedRoute>),
      },
      {
        path: "job",
        element: (<ProtectedRoute><JobPage /></ProtectedRoute>),
      },
      {
        path: "resume",
        element: (<ProtectedRoute><ResumePage /></ProtectedRoute>),
      },
      {
        path: "permission",
        element: (<ProtectedRoute><PermissionPage /></ProtectedRoute>),
      },
      {
        path: "role",
        element: (<ProtectedRoute><RolePage /></ProtectedRoute>),
      },
      {
        path: "/admin",
        element: (<ProtectedRoute><div>Admin page</div></ProtectedRoute>),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>,
)
