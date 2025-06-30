import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from 'components/layout/app.header'
import { fetchAccountAPI } from 'services/api'
import { useCurrentApp } from './components/context/app.context'
import { PacmanLoader } from 'react-spinners'

function Layout() {

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export default Layout
