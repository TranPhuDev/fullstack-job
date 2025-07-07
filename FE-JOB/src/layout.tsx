import { Outlet } from 'react-router-dom'
import AppHeader from 'components/layout/app.header'
import AppFooter from './components/layout/app.footer'


function Layout() {

  return (
    <>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </>
  )
}

export default Layout
