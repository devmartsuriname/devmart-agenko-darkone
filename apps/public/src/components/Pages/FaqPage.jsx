import React from 'react';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import Accordion from '../Accordion';
import { pageTitle } from '../../helpers/PageTitle';
import { useFaqs } from '../../hooks/useContent';

// Static fallback data
const fallbackFaqs = [
  {
    title: '01. I need your services and how can i contact you?',
    content: 'You can contact us through our contact page or email us directly. We respond to all inquiries within 24-48 business hours.',
  },
  {
    title: '02. What are the different types of services you provide?',
    content: 'We provide a comprehensive range of digital services including web development, UI/UX design, branding, digital marketing, and more.',
  },
  {
    title: '03. What are the different stages of the working process?',
    content: 'Our process typically involves: Discovery & Research, Strategy & Planning, Design & Development, Testing & QA, and Launch & Support.',
  },
  {
    title: '04. What is the difference between direct and digital marketing?',
    content: 'Direct marketing involves reaching customers through physical channels like mail, while digital marketing uses online channels like social media, email, and websites.',
  },
  {
    title: '05. How can I proceed with payment after project completion?',
    content: 'We accept various payment methods including bank transfer, credit cards, and PayPal. Payment terms are discussed and agreed upon before project commencement.',
  },
];

function transformFaqsData(faqs) {
  if (!faqs || faqs.length === 0) return fallbackFaqs;
  
  return faqs.map((f, index) => ({
    title: `${String(index + 1).padStart(2, '0')}. ${f.question}`,
    content: f.answer,
  }));
}

export default function FaqPage() {
  pageTitle('FAQ');
  
  const { faqs, loading } = useFaqs();
  const faqData = transformFaqsData(faqs);

  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title="Frequently Asked Questions"
        subTitle="FAQs"
        variant="text-center"
        shape="shape_5"
      />
      <Spacing lg="75" md="60" />
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              {loading ? (
                <div className="text-center">Loading FAQs...</div>
              ) : (
                <Accordion variant="cs_type_1" data={faqData} />
              )}
            </div>
          </div>
        </div>
        <Spacing lg="120" md="50" />
      </section>
    </>
  );
}
