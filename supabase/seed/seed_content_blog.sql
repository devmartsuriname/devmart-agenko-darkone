-- Seed Blog Posts (idempotent)
-- Links to existing team_members by slug for author_id
-- Requires team_members to be seeded first

-- Blog Post 1: Digital Strategy
INSERT INTO blog_posts (slug, title, excerpt, content, category, status, published_at, is_featured, author_id, featured_image_url, tags)
SELECT 
  'digital-strategy-2024',
  'Digital Strategy Trends for 2024',
  'Discover the key digital strategies that will shape business success in 2024 and beyond.',
  '## The Future of Digital Strategy

As we move into 2024, businesses must adapt to rapidly changing digital landscapes. Here are the key trends shaping the future:

### 1. AI-First Approaches
Artificial intelligence is no longer optional. Companies integrating AI into their workflows see 40% improvement in efficiency.

### 2. Customer Experience Focus
User experience remains paramount. Every touchpoint matters in the customer journey.

### 3. Data-Driven Decisions
Analytics and insights drive strategic decisions. Real-time data enables agile responses to market changes.

### Conclusion
Success in 2024 requires embracing these trends while maintaining focus on core business values.',
  'Strategy',
  'published',
  NOW() - INTERVAL '5 days',
  true,
  (SELECT id FROM team_members WHERE slug = 'sarah-chen' LIMIT 1),
  '/images/blog/strategy.jpg',
  ARRAY['strategy', 'digital', 'trends']
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'digital-strategy-2024');

-- Blog Post 2: Web Development Best Practices
INSERT INTO blog_posts (slug, title, excerpt, content, category, status, published_at, is_featured, author_id, featured_image_url, tags)
SELECT 
  'web-development-best-practices',
  'Modern Web Development Best Practices',
  'Essential practices every web developer should follow for building scalable applications.',
  '## Building Better Web Applications

Modern web development requires attention to performance, accessibility, and maintainability.

### Performance Optimization
- Lazy loading for images and components
- Code splitting for faster initial loads
- CDN usage for static assets

### Accessibility Standards
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support

### Code Quality
- TypeScript for type safety
- Component-based architecture
- Comprehensive testing

These practices ensure your applications are ready for production.',
  'Development',
  'published',
  NOW() - INTERVAL '10 days',
  true,
  (SELECT id FROM team_members WHERE slug = 'marcus-johnson' LIMIT 1),
  '/images/blog/development.jpg',
  ARRAY['development', 'web', 'best-practices']
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'web-development-best-practices');

-- Blog Post 3: UI/UX Design Principles
INSERT INTO blog_posts (slug, title, excerpt, content, category, status, published_at, is_featured, author_id, featured_image_url, tags)
SELECT 
  'ui-ux-design-principles',
  'Essential UI/UX Design Principles',
  'Learn the fundamental design principles that create exceptional user experiences.',
  '## Creating User-Centered Designs

Great design starts with understanding your users.

### Visual Hierarchy
Guide users through content with clear visual priorities. Size, color, and spacing create natural reading patterns.

### Consistency
Maintain consistent patterns throughout your application. Users learn faster when interfaces behave predictably.

### Feedback & Response
Every action should have a visible response. Loading states, success messages, and error handling keep users informed.

### Simplicity
Remove unnecessary elements. Each component should serve a clear purpose.

Apply these principles to elevate your design work.',
  'Design',
  'published',
  NOW() - INTERVAL '15 days',
  false,
  (SELECT id FROM team_members WHERE slug = 'elena-rodriguez' LIMIT 1),
  '/images/blog/design.jpg',
  ARRAY['design', 'ui', 'ux']
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'ui-ux-design-principles');

-- Blog Post 4: SEO Optimization Guide
INSERT INTO blog_posts (slug, title, excerpt, content, category, status, published_at, is_featured, author_id, featured_image_url, tags)
SELECT 
  'seo-optimization-guide',
  'Complete SEO Optimization Guide',
  'A comprehensive guide to improving your website search engine rankings.',
  '## Mastering SEO in 2024

Search engine optimization remains critical for online visibility.

### Technical SEO
- Fast page load speeds
- Mobile-first indexing
- Structured data markup
- Clean URL structures

### Content Strategy
- Keyword research and targeting
- Quality content creation
- Regular content updates

### Link Building
- Quality over quantity
- Natural link acquisition
- Internal linking strategy

Implement these strategies for better search visibility.',
  'Marketing',
  'published',
  NOW() - INTERVAL '20 days',
  false,
  (SELECT id FROM team_members WHERE slug = 'david-kim' LIMIT 1),
  '/images/blog/seo.jpg',
  ARRAY['seo', 'marketing', 'optimization']
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'seo-optimization-guide');

-- Blog Post 5: Cloud Architecture Patterns
INSERT INTO blog_posts (slug, title, excerpt, content, category, status, published_at, is_featured, author_id, featured_image_url, tags)
SELECT 
  'cloud-architecture-patterns',
  'Cloud Architecture Patterns for Scale',
  'Design patterns for building scalable and resilient cloud applications.',
  '## Scaling with Cloud Architecture

Building applications that scale requires thoughtful architecture.

### Microservices
Break monoliths into manageable services. Each service handles one responsibility.

### Serverless Computing
Reduce operational overhead with serverless functions. Pay only for what you use.

### Container Orchestration
Docker and Kubernetes enable consistent deployments across environments.

### Database Strategies
- Read replicas for scale
- Caching layers
- Database sharding

These patterns form the foundation of modern cloud applications.',
  'Technology',
  'published',
  NOW() - INTERVAL '25 days',
  true,
  (SELECT id FROM team_members WHERE slug = 'sarah-chen' LIMIT 1),
  '/images/blog/cloud.jpg',
  ARRAY['cloud', 'architecture', 'devops']
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'cloud-architecture-patterns');

-- Blog Post 6: Building Strong Teams
INSERT INTO blog_posts (slug, title, excerpt, content, category, status, published_at, is_featured, author_id, featured_image_url, tags)
SELECT 
  'building-strong-teams',
  'Building Strong Development Teams',
  'Strategies for creating cohesive and high-performing development teams.',
  '## The Art of Team Building

Great products come from great teams.

### Communication
Open and transparent communication prevents misunderstandings. Regular standups and retrospectives keep everyone aligned.

### Collaboration
Pair programming and code reviews share knowledge. No single points of failure.

### Growth Mindset
Invest in learning and development. Conference attendance, training, and mentorship programs.

### Work-Life Balance
Sustainable pace leads to better outcomes. Avoid burnout through reasonable expectations.

Build teams that deliver exceptional results.',
  'Culture',
  'published',
  NOW() - INTERVAL '30 days',
  false,
  (SELECT id FROM team_members WHERE slug = 'james-wilson' LIMIT 1),
  '/images/blog/team.jpg',
  ARRAY['team', 'culture', 'leadership']
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'building-strong-teams');
