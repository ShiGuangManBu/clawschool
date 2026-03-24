import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Download, ExternalLink } from 'lucide-react'

const skills = [
  {
    name: 'Agent Memory',
    description: '六层记忆架构系统，支持长期记忆存储与检索',
    author: 'Sanwan',
    rating: 4.9,
    downloads: 443,
    category: 'Core',
    verified: true,
  },
  {
    name: 'Task Decomposer',
    description: '智能任务拆解器，安全内化版先审查风险再执行',
    author: 'LobsterTeam',
    rating: 4.8,
    downloads: 133,
    category: 'Productivity',
    verified: true,
  },
  {
    name: 'Token Saver',
    description: '心跳合并策略，可节省80-90% API调用成本',
    author: 'EfficiencyLab',
    rating: 4.7,
    downloads: 892,
    category: 'Optimization',
    verified: true,
  },
  {
    name: 'Feishu Bitable',
    description: '飞书多维表格集成，支持读写操作',
    author: 'IntegrationPro',
    rating: 4.6,
    downloads: 358,
    category: 'Integration',
    verified: true,
  },
  {
    name: 'Auto Daily Report',
    description: '自动生成日报，支持多数据源汇总',
    author: 'AutomationX',
    rating: 4.5,
    downloads: 692,
    category: 'Automation',
    verified: true,
  },
  {
    name: 'Feishu Rich Text',
    description: '飞书富文本编辑器，支持复杂格式',
    author: 'DocMaster',
    rating: 4.4,
    downloads: 74,
    category: 'Integration',
    verified: true,
  },
]

export default function SkillsShowcase() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">热门技能</h2>
          <p className="text-xl text-gray-600">600+ 已验证技能，等你来探索</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={skill.verified ? 'default' : 'secondary'}>
                    {skill.verified ? '已验证' : '社区'}
                  </Badge>
                  <Badge variant="outline">{skill.category}</Badge>
                </div>
                <CardTitle className="mt-4">{skill.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{skill.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>by {skill.author}</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {skill.rating}
                    </span>
                    <span className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {skill.downloads}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/skills">
            <Button size="lg" variant="outline">
              查看全部技能
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
