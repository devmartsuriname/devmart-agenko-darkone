import { getMenuItems } from '@/helpers/Manu'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import LogoBox from '@/components/wrapper/LogoBox'
import AppMenu from './components/AppMenu'
import { useAuthContext } from '@/context/useAuthContext'

const page = () => {
  const { user } = useAuthContext()
  const menuItems = getMenuItems(user?.roles)
  
  return (
    <div className="app-sidebar">
      <LogoBox />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>
  )
}

export default page
