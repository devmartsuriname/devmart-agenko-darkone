import React from 'react';
import { useParams } from 'react-router-dom';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import CtaStyle2 from '../Cta/CtaStyle2';
import About from '../About';
import { pageTitle } from '../../helpers/PageTitle';
import { useService } from '../../hooks/useContent';

export default function ServiceDetailsPage() {
  const { serviceDetailsId } = useParams();
  const { service, loading, error } = useService(serviceDetailsId);

  pageTitle(service?.title || 'Service Details');

  // Loading state
  if (loading) {
    return (
      <>
        <Spacing lg="70" md="70" />
        <Spacing lg="140" md="80" />
        <div className="container text-center">
          <div className="cs_loader">Loading...</div>
        </div>
        <Spacing lg="150" md="80" />
      </>
    );
  }

  // Not found state
  if (error || !service) {
    return (
      <>
        <Spacing lg="70" md="70" />
        <Spacing lg="140" md="80" />
        <div className="container text-center">
          <h2>Service Not Found</h2>
          <p>The service you're looking for doesn't exist or has been removed.</p>
        </div>
        <Spacing lg="150" md="80" />
      </>
    );
  }

  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title={service.title}
        subTitle={service.short_description || 'Service Details'}
        shape="shape_3"
      />
      <Spacing lg="75" md="60" />
      
      {/* Service Image */}
      {service.image_url && (
        <div className="container">
          <div className="cs_service_info">
            <div
              className="cs_service_info_thumb cs_bg_filed"
              style={{
                backgroundImage: `url("${service.image_url}")`,
                minHeight: '400px',
                borderRadius: '15px',
              }}
            />
          </div>
        </div>
      )}
      
      <Spacing lg="75" md="60" />
      
      {/* Service Content */}
      {service.content && (
        <About
          thumbnailSrc={service.image_url || '/images/others/service_details_1.jpeg'}
          title="What you will get from this service?"
          subTitle={service.content}
          featureList={[]}
          btnText="Check Live Projects"
          btnUrl="/portfolio"
        />
      )}
      
      <Spacing lg="150" md="80" />
      <div className="cs_height_140 cs_height_lg_70" />
      <CtaStyle2
        title="Is there a specific project or goal <br />that you have in mind?"
        btnText="Send Message"
        btnUrl="/contact"
      />
      <div className="cs_height_150 cs_height_lg_80" />
    </>
  );
}
