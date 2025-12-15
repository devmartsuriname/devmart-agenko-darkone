import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DropDown from './DropDown';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';

export default function Header({
  logoUrl,
  colorVariant,
  actionBtnText,
  actionBtnUrl,
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const { settings } = useSiteSettingsContext();
  
  // Use site settings logo if available, otherwise use prop
  const displayLogo = logoUrl || settings.logo_light_url || '/images/logo_white.svg';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`cs_site_header cs_style_1 cs_sticky_header ${
        colorVariant ? colorVariant : 'cs_primary_color'
      } ${isSticky ? 'cs_gescout_show' : ''}`}
    >
      <div className="cs_main_header">
        <div className="container">
          <div className="cs_main_header_in">
            <div className="cs_main_header_left">
              <Link className="cs_site_branding" to="/">
                <img src={displayLogo} alt={settings.site_name || 'Logo'} />
              </Link>
            </div>
            <div className="cs_main_header_center">
              <div className="cs_nav cs_medium cs_primary_font">
                <ul
                  className={`${
                    mobileToggle ? 'cs_nav_list cs_active' : 'cs_nav_list'
                  }`}
                >
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li className="menu-item-has-children">
                    <Link to="/service">Services</Link>
                    <DropDown>
                      <ul>
                        <li>
                          <Link to="/service">All Services</Link>
                        </li>
                      </ul>
                    </DropDown>
                  </li>
                  <li>
                    <Link to="/portfolio">Portfolio</Link>
                  </li>
                  <li className="menu-item-has-children">
                    <Link to="/blog">Blog</Link>
                    <DropDown>
                      <ul>
                        <li>
                          <Link to="/blog">Blog Grid</Link>
                        </li>
                        <li>
                          <Link to="/blog-list">Blog List</Link>
                        </li>
                      </ul>
                    </DropDown>
                  </li>
                  <li className="menu-item-has-children">
                    <Link to="#">Pages</Link>
                    <DropDown>
                      <ul>
                        <li>
                          <Link to="/team">Team</Link>
                        </li>
                        <li>
                          <Link to="/faq">FAQ</Link>
                        </li>
                      </ul>
                    </DropDown>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                </ul>
                <span
                  className={
                    mobileToggle
                      ? 'cs_menu_toggle cs_teggle_active'
                      : 'cs_menu_toggle'
                  }
                  onClick={() => setMobileToggle(!mobileToggle)}
                >
                  <span></span>
                </span>
              </div>
            </div>
            <div className="cs_main_header_right">
              <Link
                to={actionBtnUrl || settings.cta_button_link || '/contact'}
                className={`cs_btn cs_style_1 ${
                  colorVariant ? 'cs_btn_white' : ''
                }`}
              >
                {actionBtnText || settings.cta_button_text || 'Get Started'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
