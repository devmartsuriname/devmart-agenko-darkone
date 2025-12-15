import React from 'react';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import ServiceStyle2 from '../Service/ServiceStyle2';
import CtaStyle2 from '../Cta/CtaStyle2';
import { pageTitle } from '../../helpers/PageTitle';
import { useServices } from '../../hooks/useContent';

// Static fallback data
const fallbackServices = [
  {
    number: '01',
    title: 'WP Development',
    subTitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    thumbnailSrc: '/images/studio-agency/service_img_1.jpeg',
    href: '/service/service-details',
  },
  {
    number: '02',
    title: 'Branding Design',
    subTitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    thumbnailSrc: '/images/studio-agency/service_img_2.jpeg',
    href: '/service/service-details',
  },
  {
    number: '03',
    title: 'UI/UX Design',
    subTitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    thumbnailSrc: '/images/studio-agency/service_img_3.jpeg',
    href: '/service/service-details',
  },
  {
    number: '04',
    title: 'On Page Optimization',
    subTitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    thumbnailSrc: '/images/studio-agency/service_img_4.jpeg',
    href: '/service/service-details',
  },
  {
    number: '05',
    title: 'Front-End Development',
    subTitle: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium lorema doloremque laudantium, totam rem aperiam, eaque ipsa quae.',
    thumbnailSrc: '/images/studio-agency/service_img_5.jpeg',
    href: '/service/service-details',
  },
];

function transformServicesData(services) {
  if (!services || services.length === 0) return fallbackServices;
  
  return services.map((s, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: s.title,
    subTitle: s.short_description || '',
    thumbnailSrc: s.image_url || `/images/studio-agency/service_img_${(index % 5) + 1}.jpeg`,
    href: `/service/${s.slug}`,
  }));
}

export default function ServicePage() {
  pageTitle('Service');
  
  const { services, loading } = useServices();
  const serviceData = transformServicesData(services);

  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title="Empowering Your Business with Comprehensive Services"
        subTitle="Our Services"
        shape="shape_2"
      />
      <Spacing lg="75" md="60" />
      <div className="container">
        <ServiceStyle2 data={serviceData} />
      </div>
      <Spacing lg="150" md="80" />
      <CtaStyle2
        title="Is there a specific project or goal <br />that you have in mind?"
        btnText="Send Message"
        btnUrl="/contact"
      />
      <div className="cs_height_150 cs_height_lg_80" />
    </>
  );
}
