import { MENU_ITEMS, DEV_MENU_ITEMS } from '@/assets/data/menu-items'
import type { MenuItemType } from '@/types/menu'
import type { AppRole } from '@/lib/supabase'

// ============================================================================
// ROUTE ROLE REQUIREMENTS (must match RequireAuth.tsx)
// ============================================================================
type RouteRoleConfig = {
  pathPrefix: string;
  roles: AppRole[];
};

const ROUTE_ROLE_REQUIREMENTS: RouteRoleConfig[] = [
  { pathPrefix: '/system', roles: ['admin'] },
  { pathPrefix: '/content', roles: ['admin', 'editor'] },
  { pathPrefix: '/crm', roles: ['admin', 'editor'] },
  { pathPrefix: '/marketing', roles: ['admin', 'editor'] },
];

/**
 * Check if a role can access a given path
 */
function canRoleAccessPath(userRoles: AppRole[], path: string | undefined): boolean {
  if (!path) return true; // No path = accessible
  
  for (const config of ROUTE_ROLE_REQUIREMENTS) {
    if (path.startsWith(config.pathPrefix)) {
      // Path requires specific roles
      return config.roles.some(role => userRoles.includes(role));
    }
  }
  
  // No matching prefix = any authenticated user can access
  return true;
}

/**
 * Filter menu items based on user roles
 */
function filterMenuItemsByRole(items: MenuItemType[], userRoles: AppRole[]): MenuItemType[] {
  return items.reduce<MenuItemType[]>((filtered, item) => {
    // Title items are always included
    if (item.isTitle) {
      filtered.push(item);
      return filtered;
    }
    
    // Check if item's URL is accessible
    if (item.url && !canRoleAccessPath(userRoles, item.url)) {
      return filtered; // Skip this item
    }
    
    // If item has children, filter them recursively
    if (item.children && item.children.length > 0) {
      const filteredChildren = item.children.filter(child => 
        canRoleAccessPath(userRoles, child.url)
      );
      
      // Only include parent if it has accessible children
      if (filteredChildren.length > 0) {
        filtered.push({
          ...item,
          children: filteredChildren,
        });
      }
      return filtered;
    }
    
    // Item is accessible
    filtered.push(item);
    return filtered;
  }, []);
}

/**
 * Remove orphaned title items (titles with no following menu items)
 */
function removeOrphanedTitles(items: MenuItemType[]): MenuItemType[] {
  const result: MenuItemType[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (item.isTitle) {
      // Check if there's at least one non-title item after this title
      let hasContent = false;
      for (let j = i + 1; j < items.length; j++) {
        if (items[j].isTitle) break;
        hasContent = true;
        break;
      }
      if (hasContent) {
        result.push(item);
      }
    } else {
      result.push(item);
    }
  }
  
  return result;
}

// ============================================================================
// MENU ITEMS SELECTOR
// Production: returns MENU_ITEMS only (CMS modules), filtered by role
// Development: returns MENU_ITEMS + DEV_MENU_ITEMS (includes Demo Library, UI Kit)
// ============================================================================
export const getMenuItems = (userRoles?: AppRole[]): MenuItemType[] => {
  const baseItems = import.meta.env.DEV 
    ? [...MENU_ITEMS, ...DEV_MENU_ITEMS]
    : MENU_ITEMS;
  
  // If no roles provided, return all items (for compatibility)
  if (!userRoles || userRoles.length === 0) {
    return baseItems;
  }
  
  // Filter by role
  const filtered = filterMenuItemsByRole(baseItems, userRoles);
  
  // Remove orphaned titles
  return removeOrphanedTitles(filtered);
}

export const findAllParent = (menuItems: MenuItemType[], menuItem: MenuItemType): string[] => {
  let parents: string[] = []
  const parent = findMenuItem(menuItems, menuItem.parentKey)
  if (parent) {
    parents.push(parent.key)
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)]
    }
  }
  return parents
}

export const getMenuItemFromURL = (items: MenuItemType | MenuItemType[], url: string): MenuItemType | undefined => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url)
      if (foundItem) {
        return foundItem
      }
    }
  } else {
    if (items.url == url) return items
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item
      }
    }
  }
}

export const findMenuItem = (menuItems: MenuItemType[] | undefined, menuItemKey: MenuItemType['key'] | undefined): MenuItemType | null => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item
      }
      const found = findMenuItem(item.children, menuItemKey)
      if (found) return found
    }
  }
  return null
}
