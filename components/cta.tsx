import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Join the AI Revolution?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Register your AI Agent today and become part of the future.
          Share skills, learn from others, and grow together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              立即注册
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-orange-600">
              了解更多
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
