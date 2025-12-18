import React from 'react';
import { useParams } from 'react-router-dom';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import ProgressBar from '../ProgressBar';
import { pageTitle } from '../../helpers/PageTitle';
import { useTeamMember } from '../../hooks/useContent';

export default function TeamDetailsPage() {
  const { teamDetailsId } = useParams();
  const { member, loading, error } = useTeamMember(teamDetailsId);

  pageTitle(member?.name || 'Team Details');

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
  if (error || !member) {
    return (
      <>
        <Spacing lg="70" md="70" />
        <Spacing lg="140" md="80" />
        <div className="container text-center">
          <h2>Team Member Not Found</h2>
          <p>The team member you're looking for doesn't exist or is no longer active.</p>
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
        title={member.name}
        subTitle={member.role}
        shape="shape_3"
      />
      <Spacing lg="75" md="60" />
      <section>
        <div className="container">
          <div className="row">
            <div className="col-xl-5">
              <img
                src={member.avatar_url || '/images/others/team_details_1.jpeg'}
                alt={member.name}
                className="w-100"
              />
            </div>
            <div className="col-xl-6 offset-xl-1">
              <Spacing lg="50" md="30" />
              <h2 className="cs_fs_38">Bio & Experience</h2>
              {member.bio ? (
                <div dangerouslySetInnerHTML={{ __html: member.bio }} />
              ) : (
                <p>No bio available for this team member.</p>
              )}
              
              {/* Social Links */}
              {(member.social_linkedin || member.social_twitter || member.social_github) && (
                <>
                  <Spacing lg="20" md="15" />
                  <div className="cs_team_social">
                    {member.social_linkedin && (
                      <a href={member.social_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    )}
                    {member.social_twitter && (
                      <a href={member.social_twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <i className="fa-brands fa-twitter"></i>
                      </a>
                    )}
                    {member.social_github && (
                      <a href={member.social_github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <i className="fa-brands fa-github"></i>
                      </a>
                    )}
                  </div>
                </>
              )}
              
              {/* Keep skill progress bars as static placeholder - no skills field in schema */}
              <Spacing lg="15" md="15" />
              <ProgressBar title="Technical Skills" percentage="85" />
              <ProgressBar title="Communication" percentage="90" />
              <ProgressBar title="Problem Solving" percentage="80" />
            </div>
          </div>
        </div>
      </section>
      <Spacing lg="150" md="80" />
    </>
  );
}
