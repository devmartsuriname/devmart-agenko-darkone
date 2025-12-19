import React from 'react';
import Hero from '../Hero';
import Spacing from '../Spacing';
import FunFact from '../FunFact';
import About from '../About';
import WhyChose from '../WhyChose';
import Service from '../Service';
import Portfolio from '../Portfolio';
import Button from '../Button';
import SectionHeading from '../SectionHeading';
import Award from '../Award';
import Cta from '../Cta';
import TestimonialSlider from '../Slider/TestimonialSlider';
import PostCarousel from '../Slider/PostCarousel';
import { pageTitle } from '../../helpers/PageTitle';
import {
  useHeroSections,
  useHomeAboutSections,
  useServices,
  useProjects,
  useTestimonials,
  useAwards,
  useBlogPosts,
} from '../../hooks/useContent';

// ============================================
// STATIC FALLBACK DATA
// Used when CMS data is empty or loading
// ============================================
const fallbackHero = {
  title: ['London Based Creative Agency', '25+ Years of Experience', '30+ Worldwide Partnership', 'Take World-class Service'],
  subtitle: 'Craft Distinct Brand Image with Expert Guidance & Fresh Approach.',
  videoSrc: 'https://www.youtube.com/embed/VcaAVWtP48A',
  bgUrl: '/images/creative-agency/hero_video_bg_1.jpeg',
};

const fallbackFunfact = [
  { title: 'Happy Customers', number: '22k' },
  { title: "Work's Completed", number: '15k' },
  { title: 'Skilled Team Members', number: '121' },
  { title: 'Most Valuable Awards', number: '15' },
];

const fallbackWhyChose = [
  {
    title: 'Talented, professional & expert team',
    content: 'Our team, specializing in strategic digital marketing, are not partners with the world is leading brands. Breaking from the norm, we push boundaries and merge.',
  },
  {
    title: 'Highly accuracy AI based system',
    content: 'Our team, specializing in strategic digital marketing, are not partners with the world is leading brands. Breaking from the norm, we push boundaries and merge.',
  },
  {
    title: 'Secret successful brand strategy formula',
    content: 'Our team, specializing in strategic digital marketing, are not partners with the world is leading brands. Breaking from the norm, we push boundaries and merge.',
  },
];

const fallbackServices = [
  {
    title: 'WP Development',
    subtitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    imgUrl: '/images/creative-agency/service_7.jpeg',
    href: '/service/service-details',
  },
  {
    title: 'UI/UX Design',
    subtitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    imgUrl: '/images/creative-agency/service_8.jpeg',
    href: '/service/service-details',
  },
  {
    title: 'Branding',
    subtitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    imgUrl: '/images/creative-agency/service_9.jpeg',
    href: '/service/service-details',
  },
  {
    title: 'Social Ad Campaign',
    subtitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    imgUrl: '/images/creative-agency/service_10.jpeg',
    href: '/service/service-details',
  },
];

const fallbackProjects = [
  {
    href: '/portfolio/portfolio-details',
    imgUrl: '/images/creative-agency/portfolio_1.jpeg',
    title: 'Awesome colorful artwork',
    btnText: 'See Project',
  },
  {
    href: '/portfolio/portfolio-details',
    imgUrl: '/images/creative-agency/portfolio_2.jpeg',
    title: 'Admin dashboard UI design',
    btnText: 'See Project',
  },
  {
    href: '/portfolio/portfolio-details',
    imgUrl: '/images/creative-agency/portfolio_3.jpeg',
    title: 'Product designing with brand',
    btnText: 'See Project',
  },
  {
    href: '/portfolio/portfolio-details',
    imgUrl: '/images/creative-agency/portfolio_4.jpeg',
    title: 'Kids education website design',
    btnText: 'See Project',
  },
];

const fallbackAwards = [
  {
    brand: 'Behance',
    title: 'UI/UX design of the month',
    subTitle: 'Accusamus et iusto odio dignissimos ducimus qui blanditiis fedarals praesentium voluptatum deleniti atque corrupti quos dolores',
    date: 'December 12, 2023',
    awardImgUrl: '/images/creative-agency/award_img_1.svg',
  },
  {
    brand: 'Awwwards',
    title: 'CSS awards design',
    subTitle: 'Accusamus et iusto odio dignissimos ducimus qui blanditiis fedarals praesentium voluptatum deleniti atque corrupti quos dolores',
    date: 'January 05, 2022',
    awardImgUrl: '/images/creative-agency/award_img_2.svg',
  },
  {
    brand: 'Google',
    title: 'Website of the day',
    subTitle: 'Accusamus et iusto odio dignissimos ducimus qui blanditiis fedarals praesentium voluptatum deleniti atque corrupti quos dolores',
    date: 'March 20, 2021',
    awardImgUrl: '/images/creative-agency/award_img_3.svg',
  },
];

const fallbackTestimonials = [
  {
    text: 'Zivans Motion Graphics did an excellent job on my video related projects. The motion graphics added an extra layer of polish and really brought the video to life. I highly recommend their high quality services and work.',
    avatarName: 'Ansari Patron',
    avatarDesignation: 'CEO at Delta',
  },
  {
    text: 'Zivans Motion Graphics did an excellent job on my video related projects. The motion graphics added an extra layer of polish and really brought the video to life. I highly recommend their high quality services and work.',
    avatarName: 'Jhon Doe',
    avatarDesignation: 'Manager at Delta',
  },
  {
    text: 'Zivans Motion Graphics did an excellent job on my video related projects. The motion graphics added an extra layer of polish and really brought the video to life. I highly recommend their high quality services and work.',
    avatarName: 'Ramatam Coo',
    avatarDesignation: 'MD at Delta',
  },
];

// FAQ section moved to standalone /faq page per Content Contract

const fallbackPosts = [
  { thumbnailSrc: '/images/creative-agency/post_1.jpeg', title: 'How to keep fear from ruining your art business with confident', date: '07 Mar 2023', url: '/blog/blog-details' },
  { thumbnailSrc: '/images/creative-agency/post_2.jpeg', title: 'Artistic mind will be great for creation anything', date: '22 Apr 2023', url: '/blog/blog-details' },
  { thumbnailSrc: '/images/creative-agency/post_3.jpeg', title: 'AI will take over all job for human within few years', date: '13 May 2023', url: '/blog/blog-details' },
  { thumbnailSrc: '/images/creative-agency/post_4.jpeg', title: 'Your agency need to replace some artistic mind people', date: '15 Mar 2023', url: '/blog/blog-details' },
];

const fallbackLayeredImages = [
  '/images/creative-agency/layer_img_1.jpeg',
  '/images/creative-agency/layer_img_2.jpeg',
  '/images/creative-agency/layer_img_3.jpeg',
  '/images/creative-agency/layer_img_4.jpeg',
  '/images/creative-agency/layer_img_5.jpeg',
];

// A12.9: Fallback for Home About section
const fallbackAbout = {
  thumbnail: '/images/creative-agency/about_1.jpeg',
  uperTitle: 'Who We Are',
  title: 'Full-stack creatives and designing agency',
  subTitle: "Our team, specializing in strategic digital marketing, partners with the world's leading brands. Breaking from the norm, we push boundaries and merge imaginative thinking, consumer behavior, and data-driven design with advanced technology to deliver unparalleled brand experiences.",
  featureList: [
    'Designing content with AI power',
    'Trending marketing tools involve',
    'Powerful market strategy use',
  ],
  btnText: 'Learn More',
  btnUrl: '/about',
};

// ============================================
// DATA TRANSFORMERS
// Map CMS data to component props
// ============================================
function transformHeroData(heroes) {
  if (!heroes || heroes.length === 0) return fallbackHero;
  
  const hero = heroes[0]; // Use first active hero
  return {
    title: hero.heading ? [hero.heading] : fallbackHero.title,
    subtitle: hero.subheading || fallbackHero.subtitle,
    videoSrc: hero.background_video_url || fallbackHero.videoSrc,
    bgUrl: hero.background_image_url || fallbackHero.bgUrl,
  };
}

function transformServicesData(services) {
  if (!services || services.length === 0) return fallbackServices;
  
  return services.map(s => ({
    title: s.title,
    subtitle: s.short_description || '',
    imgUrl: s.image_url || '/images/creative-agency/service_7.jpeg',
    href: `/service/${s.slug}`,
  }));
}

function transformProjectsData(projects) {
  if (!projects || projects.length === 0) return fallbackProjects;
  
  return projects.map(p => ({
    href: `/portfolio/${p.slug}`,
    imgUrl: p.thumbnail_url || p.featured_image_url || '/images/creative-agency/portfolio_1.jpeg',
    title: p.title,
    btnText: 'See Project',
  }));
}

function transformAwardsData(awards) {
  if (!awards || awards.length === 0) return fallbackAwards;
  
  return awards.map(a => ({
    brand: a.issuer || 'Award',
    title: a.title,
    subTitle: a.description || '',
    date: a.year ? `Year ${a.year}` : '',
    awardImgUrl: a.image_url || '/images/creative-agency/award_img_1.svg',
  }));
}

function transformTestimonialsData(testimonials) {
  if (!testimonials || testimonials.length === 0) return fallbackTestimonials;
  
  return testimonials.map(t => ({
    text: t.quote,
    avatarName: t.client_name,
    avatarDesignation: t.client_role ? `${t.client_role}${t.client_company ? ` at ${t.client_company}` : ''}` : (t.client_company || ''),
  }));
}

// FAQ transformer removed - FAQ is now standalone /faq page

/**
 * A12.9: Transform home about sections data
 * Supports bullets as: jsonb array OR newline-delimited string
 */
function transformHomeAboutData(sections) {
  if (!sections || sections.length === 0) return fallbackAbout;
  
  const section = sections[0]; // Use first active section
  
  // Parse bullets - handle both jsonb array and newline-delimited string
  let bulletList = fallbackAbout.featureList;
  if (section.bullets) {
    if (Array.isArray(section.bullets)) {
      // jsonb array format (preferred)
      const filtered = section.bullets.filter(b => typeof b === 'string' && b.trim());
      if (filtered.length > 0) {
        bulletList = filtered;
      }
    } else if (typeof section.bullets === 'string') {
      // Newline-delimited string fallback
      const parsed = section.bullets
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      if (parsed.length > 0) {
        bulletList = parsed;
      }
    }
  }
  
  return {
    thumbnail: section.image_url || fallbackAbout.thumbnail,
    uperTitle: section.eyebrow || fallbackAbout.uperTitle,
    title: section.heading || fallbackAbout.title,
    subTitle: section.body || fallbackAbout.subTitle,
    featureList: bulletList,
    btnText: section.cta_text || fallbackAbout.btnText,
    btnUrl: section.cta_link || fallbackAbout.btnUrl,
  };
}

function transformBlogPostsData(posts) {
  if (!posts || posts.length === 0) return fallbackPosts;
  
  return posts.map(p => ({
    thumbnailSrc: p.featured_image_url || '/images/creative-agency/post_1.jpeg',
    title: p.title,
    date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    url: `/blog/${p.slug}`,
  }));
}

// ============================================
// HOME COMPONENT
// ============================================
export default function Home() {
  pageTitle('Zivan');

  // Fetch CMS data (READ-ONLY)
  const { heroes } = useHeroSections();
  const { sections: aboutSections } = useHomeAboutSections();
  const { services } = useServices();
  const { projects } = useProjects({ featuredOnly: true });
  const { testimonials } = useTestimonials();
  const { awards } = useAwards();
  const { posts } = useBlogPosts({ limit: 8 });

  // Transform CMS data with fallbacks
  const heroData = transformHeroData(heroes);
  const aboutData = transformHomeAboutData(aboutSections);
  const serviceListData = transformServicesData(services);
  const portfolioData = transformProjectsData(projects);
  const awardData = transformAwardsData(awards);
  const testimonialData = transformTestimonialsData(testimonials);
  const postData = transformBlogPostsData(posts);

  return (
    <>
      <Hero
        title={heroData.title}
        subtitle={heroData.subtitle}
        videoSrc={heroData.videoSrc}
        bgUrl={heroData.bgUrl}
      />
      <Spacing lg="125" md="70" />
      <div className="container">
        <FunFact data={fallbackFunfact} />
      </div>
      <Spacing lg="125" md="70" />
      <About
        thumbnail={aboutData.thumbnail}
        uperTitle={aboutData.uperTitle}
        title={aboutData.title}
        subTitle={aboutData.subTitle}
        featureList={aboutData.featureList}
        btnText={aboutData.btnText}
        btnUrl={aboutData.btnUrl}
      />
      <Spacing lg="185" md="75" />
      <WhyChose
        sectionTitle="We have depth of market knowledge"
        sectionSubTitle="Why Choose Us"
        whyChoseFeatureData={fallbackWhyChose}
        thumbnailSrc="/images/creative-agency/why_choose_us_img_3.jpeg"
      />
      <Spacing lg="150" md="80" />
      <section className="cs_primary_bg">
        <Spacing lg="143" md="75" />
        <div className="container">
          <SectionHeading
            title="Our core services"
            subTitle="Services"
            variantColor="cs_white_color"
          />
          <Spacing lg="45" md="30" />
        </div>
        <div className="container">
          <Service
            sectionTitle="Our core services"
            sectionSubTitle="Services"
            data={serviceListData}
          />
          <Spacing lg="135" md="65" />
        </div>
      </section>
      <section>
        <Spacing lg="143" md="75" />
        <div className="container">
          <SectionHeading title="Some featured work" subTitle="Portfolio" />
          <Spacing lg="85" md="45" />
          <Portfolio data={portfolioData} />
          <Spacing lg="26" md="30" />
          <div className="text-center">
            <Button btnText="See All Project" btnUrl="/portfolio" />
          </div>
        </div>
        <Spacing lg="150" md="80" />
      </section>
      <section className="cs_primary_bg cs_shape_animation_2">
        <Spacing lg="143" md="75" />
        <div className="cs_shape_1 position-absolute">
          <svg
            width={65}
            height={64}
            viewBox="0 0 65 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M62.4554 25.9314C55.6838 19.6081 40.1618 12.4752 32.1637 20.1537C41.7609 21.9206 53.2379 29.2392 48.3751 39.1677C45.1712 45.7019 38.7353 45.7177 33.3337 41.995C27.338 37.8739 25.7108 31.2667 27.4596 24.5962C26.5312 24.5866 25.6039 24.6605 24.6889 24.8172C9.80991 27.7447 14.0713 47.6353 20.9187 55.948C22.4528 57.8045 19.7488 60.3159 18.1393 58.4837C7.86403 46.8126 6.49349 23.0691 25.5532 19.9295C26.8892 19.7254 28.2446 19.6801 29.5912 19.7945C36.9845 9.42053 56.5698 17.4866 64.055 24.4366C65.1096 25.4175 63.4831 26.8926 62.4554 25.9314ZM33.9938 39.0327C38.3927 42.4636 44.2429 40.8527 44.3919 34.8698C44.6036 28.2263 35.7464 25.0921 29.1457 24.655C27.1454 29.9313 29.4427 35.4836 33.9938 39.0327Z"
                fill="#4F4747"
              />
            </g>
          </svg>
        </div>
        <div className="container">
          <SectionHeading
            title="Our prize achievement"
            subTitle="Awards"
            variantColor="cs_white_color"
          />
          <Spacing lg="85" md="45" />
          <Award data={awardData} />
        </div>
        <Spacing lg="150" md="80" />
      </section>
      <TestimonialSlider
        layeredImages={fallbackLayeredImages}
        data={testimonialData}
      />
      <section>
        <div className="container">
          <Cta
            title="Is there a specific project or goal that you have in mind?"
            btnText="Contact Us"
            btnUrl="/contact"
            bgUrl="/images/creative-agency/cta_bg.jpeg"
          />
        </div>
      </section>
      <section className="cs_p76_full_width">
        <Spacing lg="143" md="75" />
        <div className="container">
          <SectionHeading title="Some recent news" subTitle="Our Blog" />
          <Spacing lg="85" md="45" />
        </div>
        <PostCarousel data={postData} />
      </section>
      {/* FAQ section moved to standalone /faq page per Content Contract */}
      {/* See: apps/public/src/components/Pages/FaqPage.jsx */}
      <Spacing lg="50" md="30" />
    </>
  );
}
