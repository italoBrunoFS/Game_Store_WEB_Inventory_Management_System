//import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Login from './pages/Login'
import Root from './utils/Root';
import './App.css'
import ProtectedRoutes from './utils/ProtectRoutes';
import Dashboard from './pages/Dashboard';
import Products from './components/Products';
import Logout from './components/Logout';
import Client from './components/Clients';
import Profile from './components/Profile';
import Orders from './components/Orders';
import DashboardPage from './components/Dashboard';
import Employees from './components/Employees';

function App() {
  //const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Root />} />

        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<DashboardPage/>} />
          
          <Route path='products' element={<Products/>} />
          <Route path='orders' element={<Orders/>} />
          <Route path='clients' element={<Client/>} />
          <Route path="employees" element={<Employees/>} />
          <Route path='profile' element={<Profile/>} />
          <Route path='logout' element={<Logout/>} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route 
          path='/unauthorized' 
          element={<p className='font-bold text-3xl mt-20 ml-20'>Unauthorized</p>} 
        />
      </Routes>
    </Router>
  )
}

export default App
