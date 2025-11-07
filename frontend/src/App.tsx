import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Beer from './pages/Beer'
import Inventory from './pages/Inventory/index'
import Sidenav from './components/Sidenav'


function App() {

  return (
    <Router>
    <div className='flex font-noto'>
      <Sidenav/>
      <div className='w-full flex flex-col bg-[#F4F4F4]'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/inventory' element={<Inventory/>} />
          <Route path='/beer' element={<Beer/>} />
        </Routes>
      </div>
      
    </div>
      
    </Router>
  )
}

export default App
