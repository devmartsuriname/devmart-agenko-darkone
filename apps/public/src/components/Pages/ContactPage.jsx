import React from 'react';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import { pageTitle } from '../../helpers/PageTitle';
import { Icon } from '@iconify/react';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';

export default function ContactPage() {
  pageTitle('Contact');
  const { settings } = useSiteSettingsContext();

  /**
   * TODO: Phase F4 will implement contact form submission
   * This will INSERT into contact_submissions table with fields:
   * - name (required)
   * - email (required)
   * - subject (optional)
   * - message (required)
   * - ip_address (captured server-side)
   * - user_agent (captured server-side)
   * 
   * Reference: docs/contracts/Admin_Frontend_Content_Contract.md
   * Reference: docs/tasks/Tasks.md (Phase F4)
   */
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // TODO: Phase F4 - INSERT into contact_submissions
    console.log('[Contact] Form submission placeholder - Phase F4 will implement');
    alert('Contact form submission coming soon!');
  };

  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title="Get in touch for more <br/>information and support"
        subTitle="Contact"
        shape="shape_6"
      />
      <Spacing lg="75" md="60" />
      <section>
        <div className="container">
          <div className="row align-items-center cs_gap_y_45">
            <div className="col-lg-6">
              <h2 className="cs_fs_50">
                Come & visit <br />
                our place!
              </h2>
              <div className="cs_height_55 cs_height_lg_30" />
              <ul className="cs_mp0 cs_contact_info">
                <li>
                  <h3 className="cs_fs_29 cs_semibold">Email:</h3>
                  <p className="mb-0">hello@devmart.com</p>
                </li>
                <li>
                  <h3 className="cs_fs_29 cs_semibold">Phone:</h3>
                  <p className="mb-0">+1 (555) 123-4567</p>
                </li>
                <li>
                  <h3 className="cs_fs_29 cs_semibold">Address:</h3>
                  <p className="mb-0">123 Creative Street, Design City</p>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="cs_contact_form_wrap">
                <div className="cs_gray_bg_3 cs_contact_form_bg" />
                {/* TODO: Phase F4 - Wire to contact_submissions INSERT */}
                <form className="cs_contact_form" onSubmit={handleContactSubmit}>
                  <label className="cs_fs_21 cs_semibold cs_primary_color">
                    Your full name *
                  </label>
                  <input
                    placeholder="Type your name"
                    type="text"
                    className="cs_form_field"
                    name="name"
                    required
                  />
                  <div className="cs_height_38 cs_height_lg_25" />
                  <label className="cs_fs_21 cs_semibold cs_primary_color">
                    Email address *
                  </label>
                  <input
                    placeholder="Type your email address"
                    type="email"
                    className="cs_form_field"
                    name="email"
                    required
                  />
                  <div className="cs_height_38 cs_height_lg_25" />
                  <label className="cs_fs_21 cs_semibold cs_primary_color">
                    Subject
                  </label>
                  <input
                    placeholder="What is this regarding?"
                    type="text"
                    className="cs_form_field"
                    name="subject"
                  />
                  <div className="cs_height_38 cs_height_lg_25" />
                  <label className="cs_fs_21 cs_semibold cs_primary_color">
                    Your message *
                  </label>
                  <textarea 
                    cols={30} 
                    rows={5} 
                    className="cs_form_field"
                    name="message"
                    placeholder="Tell us about your project..."
                    required
                  />
                  <div className="cs_height_38 cs_height_lg_25" />
                  <button type="submit" className="cs_btn cs_style_1">
                    Send Message
                    <span>
                      <i>
                        <Icon icon="fa6-solid:arrow-right" />
                      </i>
                      <i>
                        <Icon icon="fa6-solid:arrow-right" />
                      </i>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="cs_height_0 cs_height_lg_80" />
      </section>
      <div className="cs_map">
        <iframe
          id="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96652.27317354927!2d-74.33557928194516!3d40.79756494697628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3a82f1352d0dd%3A0x81d4f72c4435aab5!2sTroy+Meadows+Wetlands!5e0!3m2!1sen!2sbd!4v1563075599994!5m2!1sen!2sbd"
          allowFullScreen
          title="Google Map"
        />
      </div>
    </>
  );
}
