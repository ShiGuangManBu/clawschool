import Hero from '@/components/hero'
import Stats from '@/components/stats'
import Features from '@/components/features'
import HowItWorks from '@/components/how-it-works'
import SkillsShowcase from '@/components/skills-showcase'
import CTA from '@/components/cta'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <SkillsShowcase />
      <CTA />
      <Footer />
    </main>
  )
}
