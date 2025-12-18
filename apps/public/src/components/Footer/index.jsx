import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';
import { useServices } from '../../hooks/useContent';
import { supabase } from '../../lib/supabase';

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
  
  // Newsletter form state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'exists' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

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

  // Newsletter form handler - INSERT into newsletter_subscribers
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    
    // Basic email validation
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSubmitStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage('');
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: trimmedEmail,
          source: 'public'
        });
      
      if (error) {
        // Handle unique constraint violation (email already exists)
        if (error.code === '23505') {
          setSubmitStatus('exists');
          setStatusMessage('This email is already subscribed!');
        } else {
          throw error;
        }
      } else {
        setSubmitStatus('success');
        setStatusMessage('Thank you for subscribing!');
        setEmail('');
      }
    } catch (err) {
      console.error('[Newsletter] Subscription error:', err);
      setSubmitStatus('error');
      setStatusMessage('Unable to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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
                    <form onSubmit={handleNewsletterSubmit} className="cs_newsletter_form">
                      <input
                        type="email"
                        className="cs_newsletter_input"
                        placeholder={settings.newsletter_placeholder || 'Email address'}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (submitStatus) {
                            setSubmitStatus(null);
                            setStatusMessage('');
                          }
                        }}
                        disabled={isSubmitting}
                        required
                      />
                      <button 
                        type="submit" 
                        className="cs_btn cs_style_1"
                        disabled={isSubmitting}
                        style={{ opacity: isSubmitting ? 0.7 : 1 }}
                      >
                        {isSubmitting ? 'Subscribing...' : 'Submit'}
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
                    {submitStatus && (
                      <div 
                        className="cs_newsletter_status"
                        style={{
                          padding: '10px 15px',
                          marginTop: '15px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          backgroundColor: submitStatus === 'success' 
                            ? 'rgba(34, 197, 94, 0.15)' 
                            : submitStatus === 'exists'
                            ? 'rgba(251, 191, 36, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                          color: submitStatus === 'success' 
                            ? '#22c55e' 
                            : submitStatus === 'exists'
                            ? '#fbbf24'
                            : '#ef4444',
                          border: `1px solid ${
                            submitStatus === 'success' 
                              ? 'rgba(34, 197, 94, 0.3)' 
                              : submitStatus === 'exists'
                              ? 'rgba(251, 191, 36, 0.3)'
                              : 'rgba(239, 68, 68, 0.3)'
                          }`
                        }}
                      >
                        {statusMessage}
                      </div>
                    )}
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
