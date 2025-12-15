import React from 'react';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import TeamMember from '../TeamMember';
import SectionHeading from '../SectionHeading';
import Hiring from '../Hiring';
import { pageTitle } from '../../helpers/PageTitle';
import { useTeamMembers } from '../../hooks/useContent';

const circularList = [
  { number: '01', title: 'Front - End Developer', href: '/' },
  { number: '02', title: 'UI/UX Designer', href: '/' },
  { number: '03', title: 'Digital Marketer', href: '/' },
  { number: '04', title: 'SEO Expert', href: '/' },
];

// Static fallback data
const fallbackMembers = [
  { memberImg: '/images/studio-agency/team_1.jpeg', memberName: 'James Berline', memberDesignation: 'React Developer', href: '/team-details' },
  { memberImg: '/images/studio-agency/team_2.jpeg', memberName: 'Bella Zubena', memberDesignation: 'Graphic Designer', href: '/team-details' },
  { memberImg: '/images/studio-agency/team_3.jpeg', memberName: 'Kemnei Alekzend', memberDesignation: 'Digital Marketer', href: '/team-details' },
  { memberImg: '/images/studio-agency/team_4.jpeg', memberName: 'Juliya Jesmine', memberDesignation: 'UX Researcher', href: '/team-details' },
  { memberImg: '/images/studio-agency/team_5.jpeg', memberName: 'Bob Mulian', memberDesignation: 'Video Editor', href: '/team-details' },
  { memberImg: '/images/studio-agency/team_6.jpeg', memberName: 'Sindrela Anam', memberDesignation: 'Script Writer', href: '/team-details' },
];

function transformTeamData(members) {
  if (!members || members.length === 0) return fallbackMembers;
  
  return members.map(m => ({
    memberImg: m.avatar_url || '/images/studio-agency/team_1.jpeg',
    memberName: m.name,
    memberDesignation: m.role,
    href: `/team/${m.slug}`,
  }));
}

export default function TeamPage() {
  pageTitle('Team');
  
  const { members, loading } = useTeamMembers();
  const teamData = transformTeamData(members);

  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title="Talented individuals <br/>dedicated to your success"
        subTitle="Team Members"
        shape="shape_4"
      />
      <Spacing lg="75" md="60" />
      <section>
        <div className="container">
          <div className="row cs_gap_y_35">
            {teamData.map((member, index) => (
              <div className="col-lg-4 col-sm-6" key={index}>
                <TeamMember
                  memberImg={member.memberImg}
                  memberName={member.memberName}
                  memberDesignation={member.memberDesignation}
                  href={member.href}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <Spacing lg="130" md="60" />
        <div className="container">
          <SectionHeading
            title="Want to join our team?"
            subTitle="Bellow check our open position right now"
          />
          <Spacing lg="85" md="45" />
        </div>
        <Hiring
          thumbnailSrc="/images/others/hiring_img.jpeg"
          data={circularList}
        />
        <Spacing lg="150" md="80" />
      </section>
    </>
  );
}
