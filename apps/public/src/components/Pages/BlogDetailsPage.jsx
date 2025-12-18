import React from 'react';
import { useParams } from 'react-router-dom';
import Spacing from '../Spacing';
import SectionHeadingStyle3 from '../SectionHeading/SectionHeadingStyle3';
import { Icon } from '@iconify/react';
import AuthorWidget from '../Widget/AuthorWidget';
import { pageTitle } from '../../helpers/PageTitle';
import { useBlogPost } from '../../hooks/useContent';
import { format } from 'date-fns';

export default function BlogDetailsPage() {
  const { blogDetailsId } = useParams();
  const { post, loading, error } = useBlogPost(blogDetailsId);

  pageTitle(post?.title || 'Blog Details');

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
  if (error || !post) {
    return (
      <>
        <Spacing lg="70" md="70" />
        <Spacing lg="140" md="80" />
        <div className="container text-center">
          <h2>Blog Post Not Found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
        </div>
        <Spacing lg="150" md="80" />
      </>
    );
  }

  // Format date
  const formattedDate = post.published_at 
    ? format(new Date(post.published_at), 'dd MMM yyyy')
    : '';

  return (
    <>
      <Spacing lg="70" md="70" />
      <Spacing lg="140" md="80" />
      <SectionHeadingStyle3
        title={post.title}
        variant="text-center"
        shape="shape_5"
        category={post.category || 'Blog'}
        date={formattedDate}
        avatar="Author"
        avatarLink="/"
      />
      <Spacing lg="75" md="60" />
      <div className="container">
        {/* Featured Image */}
        {post.featured_image_url && (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="cs_radius_15 w-100"
          />
        )}
        <div className="cs_height_60 cs_height_lg_40" />
        
        {/* Post Content */}
        <div className="cs_post_details">
          {post.excerpt && (
            <h3>{post.excerpt}</h3>
          )}
          
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>No content available.</p>
          )}
        </div>
        
        <div className="cs_height_30 cs_height_lg_10" />
        
        {/* Tags and Share */}
        <div className="cs_post_share">
          <div className="cs_categories">
            {post.category && (
              <span className="cs_category">{post.category}</span>
            )}
            {post.tags && post.tags.map((tag, index) => (
              <span key={index} className="cs_category">{tag}</span>
            ))}
          </div>
          <div className="text-center">
            <div className="cs_post_share_btns">
              <a href="/" aria-label="Share on Twitter">
                <Icon icon="fa6-brands:twitter" />
              </a>
              <a href="/" aria-label="Share on Facebook">
                <Icon icon="fa6-brands:facebook-f" />
              </a>
              <a href="/" aria-label="Share on LinkedIn">
                <Icon icon="fa6-brands:linkedin-in" />
              </a>
            </div>
            <span className="cs_post_share_title">Share this</span>
          </div>
        </div>
        
        <div className="cs_height_50 cs_height_lg_40" />
        <AuthorWidget />
        
        {/* Comment Form - Keep as placeholder UI */}
        <div className="cs_height_88 cs_height_lg_60" />
        <h2 className="text-center cs_fs_50 mb-0">Leave A Reply</h2>
        <div className="cs_height_60 cs_height_lg_30" />
        <form action="#" className="row">
          <div className="col-lg-6">
            <input
              type="text"
              className="cs_form_field_2"
              placeholder="What's Your Name?"
            />
            <div className="cs_height_50 cs_height_lg_30" />
          </div>
          <div className="col-lg-6">
            <input
              type="text"
              className="cs_form_field_2"
              placeholder="What's Your Email?"
            />
            <div className="cs_height_50 cs_height_lg_30" />
          </div>
          <div className="col-lg-12">
            <textarea
              cols={30}
              rows={7}
              className="cs_form_field_2"
              placeholder="Feel Free To Write Your Comment"
            />
            <div className="cs_height_60 cs_height_lg_30" />
          </div>
          <div className="col-lg-12 text-center">
            <button className="cs_btn cs_style_1" type="button">
              Post Comment{' '}
              <span>
                <i className="fa-solid fa-arrow-right" />
              </span>
            </button>
          </div>
        </form>
        <div className="cs_height_150 cs_height_lg_80" />
      </div>
    </>
  );
}
