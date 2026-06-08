import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogPosts";
import BlogCard from "./BlogCard";

const MUTED = "#9095A8";

const HOME_POSTS = BLOG_POSTS.slice(0, 3);

export default function Blogs() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="blogs-section" id="blogs">
      <div className={`blogs-inner ${visible ? "blogs-inner--visible" : ""}`}>
        <header className="blogs-header">
          <h2 className="blogs-heading">Blogs</h2>
          <p className="blogs-sub">
            Occasional write-ups from the team — product updates, lessons from the field, and things we find useful.
          </p>
        </header>

        <div className="blogs-grid">
          {HOME_POSTS.map((post, index) => (
            <BlogCard key={post.id} post={post} visible={visible} delay={100 + index * 100} />
          ))}
        </div>

        <div className={`blogs-cta-wrap ${visible ? "blogs-cta-wrap--visible" : ""}`}>
          <Link to="/blogs" className="blogs-cta">
            See more posts
          </Link>
        </div>
      </div>

      <style>{`
        .blogs-section {
          position: relative;
          width: 100%;
          margin-top: clamp(-5rem, -10vh, -2.5rem);
          padding: clamp(0.75rem, 2vw, 1.25rem) clamp(1rem, 4vw, 2rem) clamp(2.5rem, 6vw, 4rem);
          background: transparent;
          scroll-margin-top: 5rem;
        }

        /* Laptop: clear gap below How It Works — no upward overlap */
        @media (min-width: 768px) and (max-width: 1279px) {
          .blogs-section {
            margin-top: clamp(2.5rem, 6vw, 4rem);
            padding-top: clamp(1.25rem, 3vw, 2rem);
          }
        }

        @media (min-width: 1280px) {
          .blogs-section {
            margin-top: clamp(1rem, 3vw, 2rem);
            padding-top: clamp(1rem, 2.5vw, 1.5rem);
          }
        }

        .blogs-inner {
          width: 100%;
          max-width: 75rem;
          margin: 0 auto;
        }

        .blogs-header {
          margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
          text-align: center;
          opacity: 0;
          transform: translateY(1.25rem);
          transition: opacity 500ms ease, transform 500ms ease;
        }

        @media (min-width: 768px) {
          .blogs-header {
            text-align: left;
          }
        }

        .blogs-inner--visible .blogs-header {
          opacity: 1;
          transform: translateY(0);
        }

        .blogs-heading {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 700;
          line-height: 1.2;
          color: #ffffff;
        }

        .blogs-sub {
          margin: 0.75rem auto 0;
          max-width: 34rem;
          font-size: clamp(0.875rem, 2vw, 1rem);
          line-height: 1.6;
          color: ${MUTED};
        }

        @media (min-width: 768px) {
          .blogs-sub {
            margin-left: 0;
            margin-right: 0;
          }
        }

        .blogs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1rem, 3vw, 1.25rem);
          width: 100%;
        }

        @media (min-width: 640px) {
          .blogs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: clamp(1rem, 2.5vw, 1.5rem);
          }
        }

        @media (min-width: 1024px) {
          .blogs-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(1.25rem, 2vw, 1.75rem);
          }
        }

        .blogs-cta-wrap {
          display: flex;
          justify-content: center;
          margin-top: clamp(2rem, 5vw, 3rem);
          opacity: 0;
          transform: translateY(0.75rem);
          transition: opacity 500ms ease 400ms, transform 500ms ease 400ms;
        }

        .blogs-cta-wrap--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .blogs-cta {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.04);
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          transition: background 200ms ease, border-color 200ms ease, color 200ms ease;
        }

        @media (hover: hover) {
          .blogs-cta:hover {
            color: #ffffff;
            border-color: rgba(91, 107, 248, 0.4);
            background: rgba(91, 107, 248, 0.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .blogs-header,
          .blogs-cta-wrap,
          .blogs-cta {
            transition: none;
          }

          .blogs-header,
          .blogs-cta-wrap {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
