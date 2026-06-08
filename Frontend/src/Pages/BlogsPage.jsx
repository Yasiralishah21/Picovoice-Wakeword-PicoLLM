import { Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogPosts";
import BlogCard from "../Components/BlogCard";

const MUTED = "#9095A8";

export default function BlogsPage() {
  return (
    <div className="blogs-page">
      <header className="blogs-page-header">
        <h1 className="blogs-page-title">Blog</h1>
        <p className="blogs-page-sub">
          Write-ups from the team — product updates, lessons from the field, and things we find useful.
        </p>
      </header>

      <div className="blogs-page-grid">
        {BLOG_POSTS.map((post, index) => (
          <BlogCard key={post.id} post={post} visible delay={index * 80} />
        ))}
      </div>

      <div className="blogs-page-back">
        <Link to="/" className="blogs-page-back-link">← Back to home</Link>
      </div>

      <style>{`
        .blogs-page {
          width: 100%;
          max-width: 75rem;
          margin: 0 auto;
          padding: clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem) clamp(4rem, 10vw, 6rem);
        }

        .blogs-page-header {
          margin-bottom: clamp(2rem, 5vw, 3rem);
        }

        .blogs-page-title {
          margin: 0;
          font-size: clamp(2rem, 5vw, 2.75rem);
          font-weight: 700;
          color: #fff;
        }

        .blogs-page-sub {
          margin: 0.75rem 0 0;
          max-width: 36rem;
          font-size: clamp(0.9rem, 2vw, 1.05rem);
          line-height: 1.6;
          color: ${MUTED};
        }

        .blogs-page-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1rem, 3vw, 1.5rem);
        }

        @media (min-width: 640px) {
          .blogs-page-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .blogs-page-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(1.25rem, 2.5vw, 1.75rem);
          }
        }

        .blogs-page-back {
          margin-top: clamp(2.5rem, 6vw, 3.5rem);
        }

        .blogs-page-back-link {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: color 200ms ease;
        }

        .blogs-page-back-link:hover {
          color: #fff;
        }
      `}</style>
    </div>
  );
}
