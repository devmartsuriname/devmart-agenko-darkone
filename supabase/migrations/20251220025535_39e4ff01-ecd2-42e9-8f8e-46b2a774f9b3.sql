-- Phase A12.13: Seed 1 active WhyChoose section with 3 features
-- NOTE: This is a data seed, not a schema change

INSERT INTO public.home_whychoose (
  section_title,
  section_subtitle,
  thumbnail_url,
  features,
  is_active,
  sort_order
) VALUES (
  'Why Partner With Our Agency',
  'Why Choose Us',
  '/images/creative-agency/why_choose_us_img_3.jpeg',
  '[
    {
      "title": "Expert Creative Team",
      "content": "Our award-winning designers and strategists bring decades of combined experience to every project, delivering innovative solutions that elevate your brand."
    },
    {
      "title": "Data-Driven Approach",
      "content": "We combine creative excellence with advanced analytics to deliver measurable results, ensuring every campaign drives real business impact."
    },
    {
      "title": "Full-Service Solutions",
      "content": "From branding and design to digital marketing and development, we provide comprehensive services under one roof for seamless execution."
    }
  ]'::jsonb,
  true,
  0
);