import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'

import Login from './features/auth/Login'
import SignUp from './features/users/SignUp'

import NewsList from './features/news/NewsList'
import NewsItem from './features/news/NewsItem'
import NewNewsForm from './features/news/NewNewsForm'
import EditNews from './features/news/EditNews'

import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'

import { ROLES } from './config/roles'
import RequireAuth from './features/auth/RequireAuth'

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route element={<PersistLogin />}>
          <Route path="/" element={<Prefetch />}>
            <Route index element={<NewsList />} />
            <Route path=":id" element={<NewsItem />} />
            <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
              <Route path="new" element={<NewNewsForm />} />
              <Route path="edit/:id" element={<EditNews />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="users">
                <Route index element={<UsersList />} />
              </Route>
            </Route>
            <Route
              element={
                <RequireAuth
                  allowedRoles={[ROLES.User, ROLES.Admin, ROLES.Editor]}
                />
              }
            >
              <Route path="users/edit/:id" element={<EditUser />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
