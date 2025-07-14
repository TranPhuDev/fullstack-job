import { Outlet } from 'react-router-dom'
import AppHeader from 'components/layout/app.header'
import AppFooter from './components/layout/app.footer'
import { FiPhoneCall } from 'react-icons/fi';
import './styles/phone-float.scss';


function PhoneFloatingButton() {
  return (
    <a
      href="tel:0774530086"
      className="phone-float-btn"
      title="Liên lạc"
    >
      <FiPhoneCall size={32} />
    </a>
  );
}


function Layout() {

  return (
    <>
      <AppHeader />
      <Outlet />
      <AppFooter />
      <PhoneFloatingButton />
    </>
  )
}

export default Layout
