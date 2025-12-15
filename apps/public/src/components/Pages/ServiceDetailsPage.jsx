import React from 'react';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import CtaStyle2 from '../Cta/CtaStyle2';
import About from '../About';
import CardStyle3 from '../Card/CardStyle3';
import { pageTitle } from '../../helpers/PageTitle';

export default function ServiceDetailsPage() {
  pageTitle('Service Details');
  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title="Improving website visibility and <br/>user experience"
        subTitle="On Page Optimiztion"
        shape="shape_3"
      />
      <Spacing lg="75" md="60" />
      <div className="cs_service_info">
        <div className="container">
          <div className="row align-items-center cs_gap_y_40">
            <div className="col-lg-6">
              <div
                className="cs_service_info_thumb cs_bg_filed"
                style={{
                  backgroundImage:
                    'url("/images/others/service_details_2.png")',
                }}
              />
            </div>
            <div className="col-lg-6">
              <div className="row cs_gap_y_40">
                <div className="col-sm-6">
                  <CardStyle3
                    number="01"
                    title="Keywords"
                    subTitle="One provide moment. Interesting an a upse you side it all the and don't listen. Cnfiden picture she one the what I nor least absolutes heavily polimer."
                  />
                </div>
                <div className="col-sm-6">
                  <CardStyle3
                    number="02"
                    title="SEO Writing"
                    subTitle="One provide moment. Interesting an a upse you side it all the and don't listen. Cnfiden picture she one the what I nor least absolutes heavily polimer."
                  />
                </div>
                <div className="col-sm-6">
                  <CardStyle3
                    number="03"
                    title="Visual Assets"
                    subTitle="One provide moment. Interesting an a upse you side it all the and don't listen. Cnfiden picture she one the what I nor least absolutes heavily polimer."
                  />
                </div>
                <div className="col-sm-6">
                  <CardStyle3
                    number="04"
                    title="Image Optimization"
                    subTitle="One provide moment. Interesting an a upse you side it all the and don't listen. Cnfiden picture she one the what I nor least absolutes heavily polimer."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Spacing lg="150" md="80" />
      <About
        thumbnailSrc="/images/others/service_details_1.jpeg"
        title="What you will get from this service?"
        subTitle="Our team, specializing in strategic digital marketing, partners with the world's leading brands. Breaking from the norm, we push boundaries and imaginative thinking, consumer behavior, and data-driven design with advanced."
        featureList={[
          'Powerful market strategy use',
          'Trending marketing tools involve',
          'Designing content with AI power',
          'Compatible with all modern browsers',
        ]}
        btnText="Check Live Projects"
        btnUrl="/portfolio"
      />
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
