import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import { Icon } from '@iconify/react';
import { pageTitle } from '../../helpers/PageTitle';
import { useProject } from '../../hooks/useContent';

export default function PortfolioDetailsPage() {
  const { portfolioDetailsId } = useParams();
  const { project, loading, error } = useProject(portfolioDetailsId);

  pageTitle(project?.title || 'Portfolio Details');

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
  if (error || !project) {
    return (
      <>
        <Spacing lg="70" md="70" />
        <Spacing lg="140" md="80" />
        <div className="container text-center">
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist or has been removed.</p>
        </div>
        <Spacing lg="150" md="80" />
      </>
    );
  }

  // Parse gallery URLs (stored as array in DB)
  const galleryImages = project.gallery_urls || [];

  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title={project.title}
        subTitle={project.category || 'Portfolio Details'}
      />
      <Spacing lg="75" md="60" />
      <div className="container">
        <div className="cs_portfolio_details">
          {/* Featured Image */}
          <img 
            src={project.featured_image_url || project.thumbnail_url || '/images/others/portfolio_details_1.jpeg'} 
            alt={project.title} 
          />
          <Spacing lg="100" md="40" />
          
          <div className="cs_portfolio_details_in">
            {/* Project Info */}
            <ul className="cs_portfolio_details_info cs_mp0">
              {project.client_name && (
                <li>
                  <h3 className="cs_fs_21 mb-0 cs_semibold">Client:</h3>
                  <p className="mb-0">{project.client_name}</p>
                </li>
              )}
              {project.category && (
                <li>
                  <h3 className="cs_fs_21 mb-0 cs_semibold">Category:</h3>
                  <p className="mb-0">{project.category}</p>
                </li>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <li>
                  <h3 className="cs_fs_21 mb-0 cs_semibold">Technologies:</h3>
                  <p className="mb-0">{project.technologies.join(', ')}</p>
                </li>
              )}
              {project.project_url && (
                <li>
                  <h3 className="cs_fs_21 mb-0 cs_semibold">Project URL:</h3>
                  <p className="mb-0">
                    <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                      View Live Project
                    </a>
                  </p>
                </li>
              )}
            </ul>
            
            {/* Project Summary */}
            <div className="cs_portfolio_details_right">
              <h2>Project Summary</h2>
              {project.content ? (
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
              ) : project.short_description ? (
                <p>{project.short_description}</p>
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>
          
          {/* Gallery */}
          {galleryImages.length > 0 && (
            <>
              <Spacing lg="115" md="60" />
              <div className="cs_portfolio_details_gallery">
                {galleryImages.map((imgUrl, index) => (
                  <div key={index}>
                    <img src={imgUrl} alt={`${project.title} gallery ${index + 1}`} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <Spacing lg="90" md="60" />
        <div className="cs_page_navigation cs_center">
          <div>
            <Link to="/portfolio" className="cs_text_btn cs_type1">
              <Icon icon="cil:arrow-left" className="cs_fs_21" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
      <Spacing lg="150" md="80" />
    </>
  );
}
