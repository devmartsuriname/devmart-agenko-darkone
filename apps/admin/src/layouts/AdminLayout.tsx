import AnimationStar from '@/components/AnimationStar'
import Footer from '@/components/layout/Footer'
import FallbackLoading from '@/components/FallbackLoading'
import { ChildrenType } from '@/types/component-props'
import { lazy, Suspense } from 'react'
import { Container } from 'react-bootstrap'

const TopNavigationBar = lazy(() => import('@/components/layout/TopNavigationBar/page'))
const VerticalNavigationBar = lazy(() => import('@/components/layout/VerticalNavigationBar/page'))

const AdminLayout = ({ children }: ChildrenType) => {
  return (
    <div className="wrapper">
      <Suspense fallback={<FallbackLoading />}>
        <TopNavigationBar />
      </Suspense>
      <Suspense fallback={null}>
        <VerticalNavigationBar />
      </Suspense>
      <AnimationStar />
      <div className="page-content">
        <Container fluid>
          <Suspense fallback={<FallbackLoading />}>
            {children}
          </Suspense>
        </Container>
        <Footer />
      </div>
    </div>
  )
}

export default AdminLayout
