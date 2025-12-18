import React from 'react';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import About from '../About';
import FunFact from '../FunFact';
import IconBoxStyle6 from '../IconBox/IconBoxStyle6';
import SectionHeadingStyle5 from '../SectionHeading/SectionHeadingStyle5';
import SectionHeading from '../SectionHeading';
import TeamSlider from '../Slider/TeamSlider';
import Marquee from '../Marquee';
import Brands from '../Brands';
import { pageTitle } from '../../helpers/PageTitle';
import { useTeamMembers } from '../../hooks/useContent';

const funfactData = [
  { title: 'Happy Customers', number: '22k' },
  { title: "Work's Completed", number: '15k' },
  { title: 'Skilled Team Members', number: '121' },
  { title: 'Most Valuable Awards', number: '15' },
];

const brandList = [
  { logoSrc: '/images/marketing-agency/brand_1.svg', logoAlt: 'Brand' },
  { logoSrc: '/images/marketing-agency/brand_2.svg', logoAlt: 'Brand' },
  { logoSrc: '/images/marketing-agency/brand_3.svg', logoAlt: 'Brand' },
  { logoSrc: '/images/marketing-agency/brand_4.svg', logoAlt: 'Brand' },
];

const brandListDark = [
  { logoSrc: '/images/marketing-agency/brand_1_dark.svg', logoAlt: 'Brand' },
  { logoSrc: '/images/marketing-agency/brand_2_dark.svg', logoAlt: 'Brand' },
  { logoSrc: '/images/marketing-agency/brand_3_dark.svg', logoAlt: 'Brand' },
  { logoSrc: '/images/marketing-agency/brand_4_dark.svg', logoAlt: 'Brand' },
];

export default function AboutPage({ darkMode }) {
  pageTitle('About');
  
  // Fetch team members from Supabase
  const { members, loading: teamLoading } = useTeamMembers();
  
  // Transform team members data to match slider format
  const teamData = members.map((member) => ({
    memberImg: member.avatar_url || '/images/studio-agency/team_1.jpeg',
    memberName: member.name,
    memberDesignation: member.role,
    href: `/team/${member.slug}`,
  }));
  
  // If we have team data, duplicate it for smoother slider experience (if needed)
  const sliderTeamData = teamData.length > 0 
    ? (teamData.length < 4 ? [...teamData, ...teamData] : teamData)
    : [];

  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title="Adding value to your business, <br>making it worthy"
        subTitle="About Us"
        variant="text-center"
        shape="shape_1"
      />
      <Spacing lg="75" md="60" />
      
      {/* About Section using available About component */}
      <About
        thumbnail="/images/digital-agency/about_1.jpeg"
        uperTitle="Company Info"
        title="Marketing agency for your business"
        subTitle="Our team, specializing in strategic digital marketing, partners with the world's leading brands. Breaking from the norm, we push boundaries and merge imaginative thinking with real possibilities."
        featureList={[
          'Strategic Digital Marketing',
          'Brand Development',
          'Creative Solutions',
          'Data-Driven Results',
        ]}
        btnText="See Our Services"
        btnUrl="/service"
      />
      
      <Spacing lg="125" md="70" />
      <div className="container">
        <FunFact data={funfactData} />
      </div>
      <Spacing lg="125" md="70" />
      
      {/* What We Do Section */}
      <About
        thumbnail="/images/digital-agency/about_2.jpeg"
        uperTitle="What We Do"
        title="Best value service provider agency"
        subTitle="We specialize in strategic digital marketing, partnering with the world's leading brands. Breaking from the norm, we push boundaries and merge imaginative thinking with real possibilities."
        featureList={[
          'Digital Marketing Excellence',
          'Brand Strategy Development',
          'Competitor Analysis',
          'Performance Optimization',
        ]}
        btnText="Learn More"
        btnUrl="/service"
      />
      
      <Spacing lg="150" md="80" />
      <section className="cs_primary_bg">
        <Spacing lg="140" md="70" />
        <div className="container">
          <SectionHeadingStyle5 title="How we work" />
          <Spacing lg="85" md="45" />
          <div className="cs_working_process_wrap cs_center">
            <div className="cs_working_process">
              <div className="cs_working_process_col">
                <IconBoxStyle6
                  bgSrc="/images/others/process_1.png"
                  iconSrc="/images/icons/search.svg"
                  title="Research"
                  subTitle="Sed ut perspiciatis unde omnis iste natus error sit voluptatem own disilope accusantium doloremque laudantium, totam remen."
                />
              </div>
              <div className="cs_working_process_col">
                <IconBoxStyle6
                  bgSrc="/images/others/process_2.png"
                  iconSrc="/images/icons/idea.svg"
                  title="Idea Generate"
                  subTitle="Sed ut perspiciatis unde omnis iste natus error sit voluptatem own disilope accusantium doloremque laudantium, totam remen."
                />
              </div>
              <div className="cs_working_process_col">
                <IconBoxStyle6
                  bgSrc="/images/others/process_3.png"
                  iconSrc="/images/icons/gear.svg"
                  title="Implement"
                  subTitle="Sed ut perspiciatis unde omnis iste natus error sit voluptatem own disilope accusantium doloremque laudantium, totam remen."
                />
              </div>
            </div>
          </div>
        </div>
        <Spacing lg="150" md="80" />
      </section>
      
      {/* Team Section - Now uses dynamic data from Supabase */}
      <section className="cs_p76_full_width">
        <Spacing lg="143" md="75" />
        <div className="container">
          <SectionHeading
            title="Meet our experts team behind <br />the zivan agency"
            subTitle="Our Team"
          />
          <Spacing lg="85" md="45" />
        </div>
        {teamLoading ? (
          <div className="container text-center">
            <div className="cs_loader">Loading team...</div>
          </div>
        ) : sliderTeamData.length > 0 ? (
          <TeamSlider data={sliderTeamData} />
        ) : (
          <div className="container text-center">
            <p>No team members available.</p>
          </div>
        )}
      </section>
      
      <Spacing lg="135" md="70" />
      <Marquee text="We Create Design - Build App - Website - Branding - SEO" />
      <Spacing lg="84" md="50" />
      <div className="container">
        <Brands data={darkMode ? brandListDark : brandList} />
      </div>
      <Spacing lg="135" md="80" />
    </>
  );
}
