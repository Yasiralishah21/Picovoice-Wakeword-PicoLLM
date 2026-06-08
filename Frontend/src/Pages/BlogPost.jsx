import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostBySlug } from "../data/blogPosts";

const MUTED = "#9095A8";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="blog-post-page blog-post-page--empty">
        <h1>Post not found</h1>
        <Link to="/blogs" className="blog-post-back">← All posts</Link>
      </div>
    );
  }

  return (
    <article className="blog-post-page">
      <header className="blog-post-header">
        <button type="button" className="blog-post-back-btn" onClick={() => navigate("/blogs")}>
          ← All posts
        </button>
        <time className="blog-post-date">{post.date}</time>
        <h1 className="blog-post-title">{post.title}</h1>
        <p className="blog-post-meta">{post.readMins}</p>
      </header>

      <div className="blog-post-content">
        {post.content.map((paragraph, i) => (
          <p key={i} className="blog-post-para">{paragraph}</p>
        ))}
      </div>

      <footer className="blog-post-footer">
        <Link to="/blogs" className="blog-post-back">← Back to all posts</Link>
      </footer>

      <style>{`
        .blog-post-page {
          width: 100%;
          max-width: 42rem;
          margin: 0 auto;
          padding: clamp(3rem, 8vw, 5rem) clamp(1.25rem, 4vw, 2rem) clamp(4rem, 10vw, 6rem);
        }

        .blog-post-page--empty {
          text-align: center;
          color: #fff;
        }

        .blog-post-back-btn {
          display: inline-block;
          margin-bottom: 2rem;
          padding: 0;
          border: none;
          background: none;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.55);
          cursor: pointer;
          transition: color 200ms ease;
        }

        .blog-post-back-btn:hover {
          color: #fff;
        }

        .blog-post-date {
          display: block;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.42);
        }

        .blog-post-title {
          margin: 0.75rem 0 0;
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          color: #fff;
        }

        .blog-post-meta {
          margin: 0.75rem 0 0;
          font-size: 0.875rem;
          color: ${MUTED};
        }

        .blog-post-content {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .blog-post-para {
          margin: 0;
          font-size: 1.0625rem;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.78);
        }

        .blog-post-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .blog-post-back {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: color 200ms ease;
        }

        .blog-post-back:hover {
          color: #fff;
        }
      `}</style>
    </article>
  );
}
