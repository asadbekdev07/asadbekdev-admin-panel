import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom'

import Layout from './layout/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Brands from './pages/Brands'
import Cities from './pages/Cities'
import Locations from './pages/Locations'
import Cars from './pages/Cars'
import Models from './pages/Models'
import { useState } from 'react'

function App() {

  const [loginSuccess, setLoginSuccess] = useState(localStorage.getItem('loginSuccess') || false)

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout loginSuccess={loginSuccess} setLoginSuccess={setLoginSuccess}/>}>
        <Route path='/' element={<Login setLoginSuccess={setLoginSuccess}/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='/brands' element={<Brands/>}/>
        <Route path='/cities' element={<Cities/>}/>
        <Route path='/locations' element={<Locations/>}/>
        <Route path='/cars' element={<Cars/>}/>
        <Route path='/models' element={<Models/>}/>
      </Route>
    )
  )

  return (
    <div>
      <RouterProvider router={routes}/>
    </div>
  )
}

export default App