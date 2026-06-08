import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import './index.css'
import Navbar from './Components/SharedComponents/Navbar'
import Footer from './Components/SharedComponents/Footer'
import Hero from './Components/Hero'
import HeroLiveKit from './Components/HeroLiveKit'
import SingleMarquee from './Components/SingleMarquee'
import HowItWorks from './Components/HowItWorks'
import Blogs from './Components/Blogs'
import WhyOpenWakeword from './Components/WhyOpenWakeword'
import Carousel from './Components/Carousel'
import ProvenTechnology from './Components/ProvenTechnology'
import DoubleMarquee from './Components/DoubleMarquee'
import Login from './Components/SharedComponents/Login'
import TalkToExpert from './Pages/TalkToExpert'
import Support from './Pages/Support'
import Industry from './Pages/Industry'
import BlogsPage from './Pages/BlogsPage'
import BlogPost from './Pages/BlogPost'

// Wraps every route except /login with Navbar + Footer
function Layout() {
  return (
    <div className="layout-root">
      <Navbar />
      {/* main content — sits on top, slides up to reveal footer */}
      <main className="layout-main">
        <Outlet />
      </main>
      {/* footer stays sticky at bottom, revealed as main scrolls away */}
      <footer className="layout-footer-anchor">
        <Footer />
      </footer>

      <style>{`
        .layout-root {
          position: relative;
          min-height: 100vh;
        }

        /* Footer pinned to bottom of viewport, behind everything */
        .layout-footer-anchor {
          position: sticky;
          bottom: 0;
          z-index: 0;
        }

        /* Main content sits above footer, covers it initially */
        .layout-main {
          position: relative;
          z-index: 1;
          background-color: #0a0c1a;
          /* rounded bottom corners so it looks like a lifted card */
          border-bottom-left-radius: 1.5rem;
          border-bottom-right-radius: 1.5rem;
          /* shadow so the edge is visible against the footer */
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  )
}

function Home() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#blogs') {
      const el = document.getElementById('blogs')
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location.hash])

  return (
    <>
      {/* <Hero /> */}
      <HeroLiveKit/>
      <SingleMarquee /> {/* singleMarquee.jsx */}
      <HowItWorks /> {/* HowItWorks.jsx */}
      <Blogs /> {/* Blogs.jsx */}
      {/* <WhyOpenWakeword /> WhyOpenWakeword.jsx */}
      {/* <Carousel /> Carousel.jsx */}
      {/* <ProvenTechnology /> ProvenTechnology.jsx */}
      <DoubleMarquee/> {/* DoubleMarquee.jsx */}
    </>
  )
}

function App() {
  return (
    <Routes>
      {/* All routes with Navbar + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/talk-to-expert" element={<TalkToExpert />} />
        <Route path="/support" element={<Support />} />
        <Route path="/industry/:slug" element={<Industry />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
      </Route>

      {/* Login — no Navbar or Footer */}
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
