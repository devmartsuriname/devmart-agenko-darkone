import { Icon } from '@iconify/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';
import { useServices } from '../../hooks/useContent';

const LinksMenuList = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Services', href: '/service' },
  { title: 'Portfolio', href: '/portfolio' },
  { title: 'Blog', href: '/blog' },
  { title: 'FAQ', href: '/faq' },
  { title: 'Contact', href: '/contact' },
];

const policyMenuList = [
  { title: 'Terms of Use', href: '/' },
  { title: 'Privacy Policy', href: '/' },
];

// Fallback services for footer
const fallbackServices = [
  { title: 'WP Development', href: '/service' },
  { title: 'UX Research', href: '/service' },
  { title: 'Branding Design', href: '/service' },
  { title: 'Front-End Development', href: '/service' },
  { title: 'Graphics Design', href: '/service' },
];

export default function Footer() {
  const { settings } = useSiteSettingsContext();
  const { services } = useServices();

  // Transform services for footer menu
  const serviceMenuList = services && services.length > 0
    ? services.slice(0, 6).map(s => ({ title: s.title, href: `/service/${s.slug}` }))
    : fallbackServices;

  // Build social links from settings
  const socialBtnList = [
    settings.social_linkedin && { icon: 'fa6-brands:linkedin-in', href: settings.social_linkedin },
    settings.social_twitter && { icon: 'fa6-brands:twitter', href: settings.social_twitter },
    settings.social_facebook && { icon: 'fa6-brands:facebook-f', href: settings.social_facebook },
    settings.social_instagram && { icon: 'fa6-brands:instagram', href: settings.social_instagram },
    settings.social_github && { icon: 'fa6-brands:github', href: settings.social_github },
  ].filter(Boolean);

  // Fallback social links if none configured
  const displaySocialLinks = socialBtnList.length > 0 ? socialBtnList : [
    { icon: 'fa6-brands:linkedin-in', href: '#' },
    { icon: 'fa6-brands:twitter', href: '#' },
    { icon: 'fa6-brands:facebook-f', href: '#' },
  ];

  // Newsletter form handler
  // TODO: Phase F4 will add INSERT mutation to newsletter_subscribers table
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription in Phase F4
    // This will INSERT into newsletter_subscribers table
    console.log('[Newsletter] Submission handler placeholder - Phase F4 will implement');
    alert('Newsletter subscription coming soon!');
  };

  return (
    <footer
      className="cs_fooer cs_bg_filed"
      style={{ backgroundImage: 'url(/images/footer_bg.jpeg)' }}
    >
      <div className="cs_fooer_main">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="cs_footer_item">
                <div className="cs_text_widget">
                  <img src={settings.logo_light_url || '/images/logo_white.svg'} alt={settings.site_name || 'Logo'} />
                </div>
                {settings.tagline && (
                  <p className="cs_footer_tagline">{settings.tagline}</p>
                )}
                <ul className="cs_menu_widget cs_mp0">
                  <li>Contact us for inquiries</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="cs_footer_item">
                <h2 className="cs_widget_title">Services</h2>
                <ul className="cs_menu_widget cs_mp0">
                  {serviceMenuList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.href}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="cs_footer_item">
                <h2 className="cs_widget_title">Links</h2>
                <ul className="cs_menu_widget cs_mp0">
                  {LinksMenuList.map((item, index) => (
                    <li key={index}>
                      <Link to={item.href}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="cs_footer_item">
                <h2 className="cs_widget_title">{settings.newsletter_heading || 'Subscribe Newsletter'}</h2>
                {settings.newsletter_enabled !== false && (
                  <div className="cs_newsletter cs_style_1">
                    <div className="cs_newsletter_text">
                      We make sure to only send emails that are noteworthy and
                      pertinent to the recipient.
                    </div>
                    {/* TODO: Phase F4 will wire this form to INSERT into newsletter_subscribers */}
                    <form onSubmit={handleNewsletterSubmit} className="cs_newsletter_form">
                      <input
                        type="email"
                        className="cs_newsletter_input"
                        placeholder={settings.newsletter_placeholder || 'Email address'}
                        required
                      />
                      <button type="submit" className="cs_btn cs_style_1">
                        Submit
                        <span>
                          <i>
                            <Icon icon="fa6-solid:arrow-right" />
                          </i>
                          <i>
                            <Icon icon="fa6-solid:arrow-right" />
                          </i>
                        </span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="cs_bottom_footer">
          <div className="cs_bottom_footer_left">
            <div className="cs_social_btns cs_style_1">
              {displaySocialLinks.map((item, index) => (
                <Link to={item.href} className="cs_center" key={index}>
                  <Icon icon={item.icon} />
                </Link>
              ))}
            </div>
          </div>
          <div className="cs_copyright">
            {settings.footer_copyright || `Copyright © ${new Date().getFullYear()} Devmart.`}
          </div>
          <div className="cs_bottom_footer_right">
            <ul className="cs_footer_links cs_mp0">
              {policyMenuList.map((item, index) => (
                <li key={index}>
                  <Link to={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
