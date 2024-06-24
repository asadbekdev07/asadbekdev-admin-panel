import { NavLink, Outlet, useNavigate } from "react-router-dom"
import menu from '/menu.svg'

function Layout({ loginSuccess, setLoginSuccess }) {

  const navigate = useNavigate()

  const logOut = () => {
    localStorage.removeItem('accessToken')
    setLoginSuccess(false)
    localStorage.setItem('loginSuccess', false)
    navigate('/')
  }

  return (
    <div>
        <header>
            <nav id="nav" className={`flex flex-col bg-cyan-900 py-5 text-white px-20 fixed top-0 left-0 bottom-0 w-[250px] ${loginSuccess ? '' : 'hidden'}`}>
                <NavLink to='/home'>Home</NavLink>
                <NavLink to='/categories'>Categories</NavLink>
                <NavLink to='/brands'>Brands</NavLink>
                <NavLink to='/cities'>Cities</NavLink>
                <NavLink to='/locations'>Locations</NavLink>
                <NavLink to='/cars'>Cars</NavLink>
                <NavLink to='/models'>Models</NavLink>
            </nav>
            <div id="" className={`flex z-50 bg-gray-200 font-semibold justify-between py-5 px-10 fixed top-0 left-0 right-0 ml-[250px] ${loginSuccess ? '' : 'hidden'}`}>
              <button><img src={menu} alt='menu' width={'30'}/></button>
              <button onClick={logOut}>Log out</button>
            </div>
        </header>
        <main className={`p-5 ${loginSuccess ? 'ml-[250px]' : ''}`}>
            <Outlet/>
        </main>
        <footer className={`flex bg-gray-200 font-semibold py-5 fixed bottom-0 left-0 right-0 ml-[250px] ${loginSuccess ? '' : 'hidden'}`}>
          <p className="mx-auto">© Created by LIMSA company 2024</p>
        </footer>
    </div>
  )
}

export default Layout