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
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import LayoutAdmin from "components/layout/layout.admin.tsx"
import ProtectedRoute from '@/components/checkAuth/auth';
import CompanyPage from './pages/admin/manage.company';
import DashBoardPage from './pages/admin/dashboard';
import UserPage from './pages/admin/manage.user';
import ResumePage from './pages/admin/manage.resume';
import PermissionPage from './pages/admin/manage.permisson';
import RolePage from './pages/admin/manage.role';
import enUS from 'antd/locale/en_US';
import JobTabs from './components/job/job_manage/job.tab';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewUpsertJob from './components/job/job_manage/upsert.job';
import ClientDetailJobPage from './pages/client/job.detail';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "job/:id", element: <ClientDetailJobPage /> },
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
        children: [
          {
            index: true,
            element: <ProtectedRoute><JobTabs /></ProtectedRoute>
          },
          {
            path: "upsert", element:
              <ProtectedRoute><ViewUpsertJob /></ProtectedRoute>
          }
        ]
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
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>,
)
