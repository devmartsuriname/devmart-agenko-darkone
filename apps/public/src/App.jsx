import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout2 from './components/Layout/Layout2';
import Layout from './components/Layout';
import Home from './components/Pages/Home';
import ServicePage from './components/Pages/ServicePage';
import ServiceDetailsPage from './components/Pages/ServiceDetailsPage';
import AboutPage from './components/Pages/AboutPage';
import BlogPage from './components/Pages/BlogPage';
import BlogListPage from './components/Pages/BlogListPage';
import BlogDetailsPage from './components/Pages/BlogDetailsPage';
import PortfolioPage from './components/Pages/PortfolioPage';
import PortfolioDetailsPage from './components/Pages/PortfolioDetailsPage';
import TeamPage from './components/Pages/TeamPage';
import TeamDetailsPage from './components/Pages/TeamDetailsPage';
import ContactPage from './components/Pages/ContactPage';
import ErrorPage from './components/Pages/ErrorPage';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      {/* Creative Agency Homepage (Dark Mode Default) */}
      <Route path="/" element={<Layout2 darkMode />}>
        <Route index element={<Home />} />
      </Route>

      {/* Inner Pages (Dark Mode) */}
      <Route path="/" element={<Layout darkMode />}>
        <Route path="about" element={<AboutPage darkMode />} />
        <Route path="service" element={<ServicePage />} />
        <Route path="service/:serviceDetailsId" element={<ServiceDetailsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog-list" element={<BlogListPage />} />
        <Route path="blog/:blogDetailsId" element={<BlogDetailsPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="portfolio/:portfolioDetailsId" element={<PortfolioDetailsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="team/:teamDetailsId" element={<TeamDetailsPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Light Mode Routes */}
      <Route path="/light" element={<Layout2 />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/light" element={<Layout />}>
        <Route path="about" element={<AboutPage />} />
        <Route path="service" element={<ServicePage />} />
        <Route path="service/:serviceDetailsId" element={<ServiceDetailsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog-list" element={<BlogListPage />} />
        <Route path="blog/:blogDetailsId" element={<BlogDetailsPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="portfolio/:portfolioDetailsId" element={<PortfolioDetailsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="team/:teamDetailsId" element={<TeamDetailsPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
