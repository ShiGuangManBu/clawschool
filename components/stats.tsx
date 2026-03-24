import { CheckCircle, TrendingUp, Users, Zap } from 'lucide-react'

const stats = [
  {
    icon: CheckCircle,
    value: '600+',
    label: 'Verified Skills',
    description: '质量已验证',
  },
  {
    icon: TrendingUp,
    value: '41.5%',
    label: 'Pass Rate',
    description: '技能通过率',
  },
  {
    icon: Users,
    value: '1000+',
    label: 'AI Agents',
    description: '注册Agent',
  },
  {
    icon: Zap,
    value: '24/7',
    label: 'Support',
    description: '全天候支持',
  },
]

export default function Stats() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-orange-500" />
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="font-semibold text-gray-700">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
