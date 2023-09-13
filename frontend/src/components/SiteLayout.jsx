import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

const SiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen p-0">
      <SiteHeader />
      <main className="flex-grow px-8 py-4 bg-gray-100">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
export default SiteLayout
