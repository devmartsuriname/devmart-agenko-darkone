/**
 * CMS Content Hooks for Public Frontend
 * 
 * READ-ONLY hooks for fetching content from Supabase.
 * All queries respect RLS policies - only published/active content is returned.
 */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Fetch site settings (singleton)
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setSettings(data);
      } catch (err) {
        console.error('Error fetching site settings:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return { settings, loading, error };
}

/**
 * Fetch active hero sections (ordered by sort_order)
 */
export function useHeroSections() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHeroes() {
      try {
        const { data, error } = await supabase
          .from('hero_sections')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('updated_at', { ascending: false }); // A12.7: Tie-breaker for deterministic ordering

        if (error) throw error;
        setHeroes(data || []);
      } catch (err) {
        console.error('Error fetching hero sections:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHeroes();
  }, []);

  return { heroes, loading, error };
}

/**
 * Fetch active home about sections (ordered by sort_order)
 * A12.9: Wire public Home About to database
 */
export function useHomeAboutSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSections() {
      try {
        const { data, error } = await supabase
          .from('home_about_sections')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('updated_at', { ascending: false }); // Tie-breaker for deterministic ordering

        if (error) throw error;
        setSections(data || []);
      } catch (err) {
        console.error('Error fetching home about sections:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, []);

  return { sections, loading, error };
}

/**
 * Fetch published services (ordered by sort_order)
 */
export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('status', 'published')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return { services, loading, error };
}

/**
 * Fetch published projects (ordered by sort_order, optionally featured only)
 */
export function useProjects({ featuredOnly = false } = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        let query = supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .order('sort_order', { ascending: true });

        if (featuredOnly) {
          query = query.eq('is_featured', true);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [featuredOnly]);

  return { projects, loading, error };
}

/**
 * Fetch active testimonials (ordered by sort_order)
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
}

/**
 * Fetch active awards (ordered by sort_order)
 */
export function useAwards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAwards() {
      try {
        const { data, error } = await supabase
          .from('awards')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setAwards(data || []);
      } catch (err) {
        console.error('Error fetching awards:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAwards();
  }, []);

  return { awards, loading, error };
}

/**
 * Fetch published blog posts (ordered by published_at desc)
 */
export function useBlogPosts({ limit = 10 } = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * Fetch active team members (ordered by sort_order)
 */
export function useTeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setMembers(data || []);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  return { members, loading, error };
}

/**
 * Fetch active FAQs (ordered by sort_order)
 */
export function useFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setFaqs(data || []);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  return { faqs, loading, error };
}

/**
 * Fetch a single published page by slug
 */
export function usePage(slug) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (error) throw error;
        setPage(data);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [slug]);

  return { page, loading, error };
}

/**
 * Fetch a single published service by slug
 */
export function useService(slug) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchService() {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (error) throw error;
        setService(data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [slug]);

  return { service, loading, error };
}

/**
 * Fetch a single published project by slug
 */
export function useProject(slug) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  return { project, loading, error };
}

/**
 * Fetch a single published blog post by slug
 */
export function useBlogPost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  return { post, loading, error };
}

/**
 * Fetch a single active team member by slug
 */
export function useTeamMember(slug) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMember() {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        setMember(data);
      } catch (err) {
        console.error('Error fetching team member:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [slug]);

  return { member, loading, error };
}
