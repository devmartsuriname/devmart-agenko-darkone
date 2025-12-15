/**
 * Site Settings Context for Public Frontend
 * 
 * Provides global site settings from Supabase to all components.
 * READ-ONLY - no mutations.
 */
import React, { createContext, useContext } from 'react';
import { useSiteSettings } from '../hooks/useContent';

// Default fallback settings
const defaultSettings = {
  site_name: 'Devmart',
  tagline: 'Creative Digital Agency',
  logo_light_url: '/images/logo_white.svg',
  logo_dark_url: '/images/logo.svg',
  footer_copyright: `Copyright © ${new Date().getFullYear()} Devmart.`,
  social_facebook: null,
  social_twitter: null,
  social_instagram: null,
  social_linkedin: null,
  social_github: null,
  newsletter_enabled: true,
  newsletter_heading: 'Subscribe Newsletter',
  newsletter_placeholder: 'Email address',
  cta_heading: 'Is there a specific project or goal that you have in mind?',
  cta_subheading: null,
  cta_button_text: 'Contact Us',
  cta_button_link: '/contact',
};

const SiteSettingsContext = createContext({
  settings: defaultSettings,
  loading: true,
  error: null,
});

export function SiteSettingsProvider({ children }) {
  const { settings, loading, error } = useSiteSettings();
  
  // Merge with defaults for safe fallback
  const mergedSettings = {
    ...defaultSettings,
    ...(settings || {}),
  };

  return (
    <SiteSettingsContext.Provider value={{ settings: mergedSettings, loading, error }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettingsContext() {
  return useContext(SiteSettingsContext);
}

export { defaultSettings };
