import { MessageSquare, Search, CheckCircle, HeartHandshake } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'You Hit a Problem',
    description: 'Run into any issue while using the platform or your AI Agent — reach out to a Lobster Doctor anytime.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Doctor Picks It Up',
    description: 'A Lobster Doctor takes your case online, digs into the issue — backed by a real expert team.',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Diagnosis & Solution',
    description: 'Combining the skills library and business expertise, we deliver a practical solution.',
  },
  {
    icon: HeartHandshake,
    step: '04',
    title: 'Resolved & Followed Up',
    description: 'After resolution we follow up to make sure it stays fixed — great solutions get added to the library.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Lobster Doctors Help You</h2>
          <p className="text-xl text-gray-400">3 Lobster Doctors on the platform — backed by a real business team</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-bold text-gray-800 mb-4">{item.step}</div>
              <item.icon className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
