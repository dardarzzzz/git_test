import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import UnitPricing from './pages/UnitPricing'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import NotFound from './pages/NotFound'

import CustomerLayout from './pages/customer/CustomerLayout'
import CustomerDashboard from './pages/customer/Dashboard'
import MyUnits from './pages/customer/MyUnits'
import MyInventory from './pages/customer/MyInventory'
import BrowseUnits from './pages/customer/BrowseUnits'
import Billing from './pages/customer/Billing'

import ManagerLayout from './pages/manager/ManagerLayout'
import ManagerDashboard from './pages/manager/Dashboard'
import ManagerInventory from './pages/manager/Inventory'
import ManagerUnits from './pages/manager/Units'
import ManagerCustomers from './pages/manager/Customers'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/units" element={<UnitPricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="customer">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/units/mine" element={<MyUnits />} />
        <Route path="/inventory" element={<MyInventory />} />
        <Route path="/units/browse" element={<BrowseUnits />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/account" element={<Account />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="manager">
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/units" element={<ManagerUnits />} />
        <Route path="/manager/inventory" element={<ManagerInventory />} />
        <Route path="/manager/customers" element={<ManagerCustomers />} />
        <Route path="/manager/account" element={<Account />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
