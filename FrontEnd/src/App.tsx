// Top-level route definitions.
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'

/** Routes "/" to the Home page and everything else to the not-found page. */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
