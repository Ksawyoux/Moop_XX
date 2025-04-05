import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

export default function App() {
  const [hmrTest, setHmrTest] = useState(0)
  return (
    <div className="app">
      <ReactNotifications />
      <div style={{ position: 'fixed', top: 10, right: 10, background: '#eee', padding: '5px 10px', borderRadius: 5 }}>
        HMR Test: {hmrTest}
        <button onClick={() => setHmrTest(c => c + 1)} style={{ marginLeft: 10 }}>+</button>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/budget">Budget</Link>
          </li>
          <li>
            <Link to="/notifications">Notifications</Link>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}