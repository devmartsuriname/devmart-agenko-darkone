/**
 * BrandingProvider Component
 * 
 * Applies CMS-driven primary color as a CSS variable at runtime.
 * Falls back to default if no value in site_settings.
 */
import { useEffect } from 'react';
import { useSiteSettingsContext } from '../context/SiteSettingsContext';

// Default fallback color (matches SCSS $accent)
const DEFAULT_PRIMARY_COLOR = '#fd6219';

/**
 * Validates hex color format
 */
function isValidHexColor(color) {
  if (!color || typeof color !== 'string') return false;
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

/**
 * Injects CSS custom properties for branding
 */
function applyPrimaryColor(hexColor) {
  const color = isValidHexColor(hexColor) ? hexColor : DEFAULT_PRIMARY_COLOR;
  
  // Set CSS custom property on :root
  document.documentElement.style.setProperty('--cs-primary-color', color);
  
  // Also create an RGB version for transparency support
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  document.documentElement.style.setProperty('--cs-primary-color-rgb', `${r}, ${g}, ${b}`);
}

export default function BrandingProvider({ children }) {
  const { settings, loading } = useSiteSettingsContext();

  useEffect(() => {
    if (!loading) {
      applyPrimaryColor(settings?.primary_color);
    }
  }, [settings?.primary_color, loading]);

  return children;
}

export { DEFAULT_PRIMARY_COLOR };
