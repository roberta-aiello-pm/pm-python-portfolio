import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Philosophy from './components/sections/Philosophy'
import Menu from './components/sections/Menu'
import Gallery from './components/sections/Gallery'
import Reservations from './components/sections/Reservations'
import Contact from './components/sections/Contact'

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Philosophy />
        <Menu />
        <Gallery />
        <Reservations />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
