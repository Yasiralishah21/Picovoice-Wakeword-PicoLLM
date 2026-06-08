import { Link } from "react-router-dom";

const ACCENT = "#5B6BF8";

export default function BlogCard({ post, visible = true, delay = 0 }) {
  return (
    <article
      className={`blogs-card ${visible ? "blogs-card--visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="blogs-card-accent" aria-hidden="true" />
      <div className="blogs-card-body">
        <time className="blogs-date">{post.date}</time>
        <h3 className="blogs-card-title">
          <Link to={`/blogs/${post.slug}`} className="blogs-card-link">
            {post.title}
          </Link>
        </h3>
        <p className="blogs-card-excerpt">{post.excerpt}</p>
        <div className="blogs-card-footer">
          <span className="blogs-read-time">{post.readMins}</span>
          <Link to={`/blogs/${post.slug}`} className="blogs-read-more">
            Read more
          </Link>
        </div>
      </div>

      <style>{`
        .blogs-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 0.875rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            160deg,
            rgba(22, 26, 52, 0.55) 0%,
            rgba(14, 16, 32, 0.85) 100%
          );
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
          overflow: hidden;
          opacity: 0;
          transform: translateY(1.5rem);
          transition:
            opacity 450ms ease,
            transform 450ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .blogs-card--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .blogs-card-accent {
          height: 3px;
          width: 100%;
          background: ${ACCENT};
          opacity: 0.85;
          transition: opacity 220ms ease;
        }

        .blogs-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
          padding: clamp(1.25rem, 3vw, 1.625rem);
        }

        @media (hover: hover) {
          .blogs-card:hover {
            border-color: rgba(255, 255, 255, 0.18);
            box-shadow: 0 10px 32px rgba(0, 0, 0, 0.28);
            transform: translateY(-4px);
          }

          .blogs-card--visible:hover {
            transform: translateY(-4px);
          }

          .blogs-card:hover .blogs-card-accent {
            opacity: 1;
          }

          .blogs-card:hover .blogs-read-more {
            color: ${ACCENT};
          }

          .blogs-card-link:hover {
            color: rgba(255, 255, 255, 0.95);
          }
        }

        .blogs-date {
          font-size: 0.8125rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.42);
        }

        .blogs-card-title {
          margin: 0;
          font-size: clamp(1.0625rem, 2.2vw, 1.1875rem);
          font-weight: 600;
          line-height: 1.38;
        }

        .blogs-card-link {
          color: #ffffff;
          text-decoration: none;
          transition: color 200ms ease;
        }

        .blogs-card-excerpt {
          margin: 0;
          flex: 1;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #9095A8;
        }

        .blogs-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.25rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .blogs-read-time {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.38);
        }

        .blogs-read-more {
          font-size: 0.8125rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: color 200ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .blogs-card,
          .blogs-card-accent,
          .blogs-read-more,
          .blogs-card-link {
            transition: none;
          }

          .blogs-card {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </article>
  );
}
