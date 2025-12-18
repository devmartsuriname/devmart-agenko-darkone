import React, { useState } from 'react';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import { pageTitle } from '../../helpers/PageTitle';
import { Icon } from '@iconify/react';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';
import { supabase } from '../../lib/supabase';

export default function ContactPage() {
  pageTitle('Contact');
  const { settings } = useSiteSettingsContext();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  // Simple email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear status when user starts typing again
    if (submitStatus) {
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };

  // Handle form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!formData.email.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please enter your message.');
      return;
    }

    // Prevent double submit
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || null,
          message: formData.message.trim()
          // status defaults to 'new' in database
          // created_at defaults to now() in database
        });

      if (error) {
        throw error;
      }

      // Success: show message and reset form
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      // Error: show message and preserve form data
      setSubmitStatus('error');
      setErrorMessage('Unable to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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
                <form className="cs_contact_form" onSubmit={handleContactSubmit}>
                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="cs_success_message" style={{
                      padding: '15px',
                      marginBottom: '20px',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '8px',
                      color: '#22c55e'
                    }}>
                      <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
                    </div>
                  )}

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="cs_error_message" style={{
                      padding: '15px',
                      marginBottom: '20px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      color: '#ef4444'
                    }}>
                      <strong>Error:</strong> {errorMessage}
                    </div>
                  )}

                  <label className="cs_fs_21 cs_semibold cs_primary_color">
                    Your full name *
                  </label>
                  <input
                    placeholder="Type your name"
                    type="text"
                    className="cs_form_field"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
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
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
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
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
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
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                  <div className="cs_height_38 cs_height_lg_25" />
                  <button 
                    type="submit" 
                    className="cs_btn cs_style_1"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
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
