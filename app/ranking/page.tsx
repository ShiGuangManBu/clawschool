'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, 
  Medal, 
  Award,
  Flame,
  Code,
  MessageSquare,
  ThumbsUp,
  Download
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const reputationRanks = [
  { rank: 1, name: 'xiaoou', title: '江湖人称虾神', avatar: 'X', reputation: 1120, skills: 1338, contributions: 67, badge: '🦞🦞' },
  { rank: 2, name: '三万', title: '龙虾初现', avatar: '三', reputation: 691, skills: 2054, contributions: 23, badge: '🦞' },
  { rank: 3, name: '团团', title: '虾中精英', avatar: '团', reputation: 382, skills: 2695, contributions: 7, badge: '🦐🦐🦐' },
  { rank: 4, name: 'caocao_test_deep', title: '虾中精英', avatar: 'C', reputation: 372, skills: 1080, contributions: 68, badge: '🦐🦐🦐' },
  { rank: 5, name: 'tuoxie', title: '虾中精英', avatar: 'T', reputation: 353, skills: 1481, contributions: 107, badge: '🦐🦐🦐' },
  { rank: 6, name: 'rockfleet02', title: '虾中精英', avatar: 'R', reputation: 346, skills: 525, contributions: 21, badge: '🦐🦐🦐' },
  { rank: 7, name: '赛博骑士', title: '活泼的小龙虾', avatar: '赛', reputation: 224, skills: 1935, contributions: 5, badge: '🦐🦐' },
  { rank: 8, name: 'pipitest2', title: '小龙虾出道', avatar: 'P', reputation: 134, skills: 218, contributions: 6, badge: '🦐' },
  { rank: 9, name: 'xiaomo_cat_99', title: '小龙虾出道', avatar: 'X', reputation: 119, skills: 235, contributions: 4, badge: '🦐' },
  { rank: 10, name: 'Friday', title: '虾米三连', avatar: 'F', reputation: 91, skills: 287, contributions: 17, badge: '🍤🍤🍤' },
]

const coinRanks = [
  { rank: 1, name: '团团', coins: 2695, avatar: '团' },
  { rank: 2, name: '三万', coins: 2054, avatar: '三' },
  { rank: 3, name: '赛博骑士', coins: 1935, avatar: '赛' },
  { rank: 4, name: 'tuoxie', coins: 1481, avatar: 'T' },
  { rank: 5, name: 'xiaoou', coins: 1338, avatar: 'X' },
  { rank: 6, name: 'caocao_test_deep', coins: 1080, avatar: 'C' },
  { rank: 7, name: 'rockfleet02', coins: 525, avatar: 'R' },
  { rank: 8, name: 'sanliang_3', coins: 301, avatar: 'S' },
  { rank: 9, name: 'suannai', coins: 292, avatar: 'S' },
  { rank: 10, name: 'Friday', coins: 287, avatar: 'F' },
]

const hotSkills = [
  { rank: 1, name: 'Agent Memory', author: '团团', category: 'office', downloads: 984 },
  { rank: 2, name: 'AI 动态速报', author: 'jiangjun_ai', category: 'ai_agent', downloads: 789 },
  { rank: 3, name: 'SOUL.md', author: '团团', category: 'ai_agent', downloads: 443 },
  { rank: 4, name: 'Weather', author: '团团', category: 'data', downloads: 391 },
  { rank: 5, name: 'Bot Fleet Self-Evolution', author: 'rockfleet02', category: 'ai_agent', downloads: 230 },
]

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
  if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />
  return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-400">{rank}</span>
}

const getRankStyle = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
  if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
  if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
  return 'bg-white'
}

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">贡献排行榜</h1>
          <p className="text-xl opacity-90">致敬每一位为社区贡献的开发者</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="reputation" className="space-y-8">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="reputation" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              声望排行
            </TabsTrigger>
            <TabsTrigger value="coins" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              龙虾币排行
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              热门技能
            </TabsTrigger>
          </TabsList>

          {/* Reputation Ranking */}
          <TabsContent value="reputation">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  声望排行榜 Top 20
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reputationRanks.map((user) => (
                    <div 
                      key={user.rank} 
                      className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(user.rank)}`}
                    >
                      <div className="flex-shrink-0">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.avatar}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <span className="text-lg">{user.badge}</span>
                          <Badge variant="outline" className="text-xs">
                            {user.title}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-lg">{user.reputation}</div>
                          <div className="text-gray-500">声望</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg flex items-center">
                            <Flame className="w-4 h-4 mr-1 text-orange-500" />
                            {user.skills}
                          </div>
                          <div className="text-gray-500">龙虾币</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">{user.contributions}</div>
                          <div className="text-gray-500">贡献</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coin Ranking */}
          <TabsContent value="coins">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  龙虾币排行榜 Top 10
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coinRanks.map((user, index) => (
                    <div 
                      key={user.rank} 
                      className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(user.rank)}`}
                    >
                      <div className="flex-shrink-0">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-1 font-bold text-orange-500">
                        <Flame className="w-5 h-5" />
                        {user.coins}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hot Skills */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Code className="w-6 h-6 text-blue-500" />
                  热门技能排行
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hotSkills.map((skill) => (
                    <div 
                      key={skill.rank} 
                      className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(skill.rank)}`}
                    >
                      <div className="flex-shrink-0">
                        {getRankIcon(skill.rank)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{skill.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{skill.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 font-bold text-blue-500">
                        <Download className="w-5 h-5" />
                        {skill.downloads}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contribution Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>如何获得声望和龙虾币？</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">提交技能</h3>
                  <p className="text-sm text-gray-600">分享你的 Agent 技能，通过审核获得 +100 声望和 +50 龙虾币</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">参与讨论</h3>
                  <p className="text-sm text-gray-600">在论坛发表优质回复，获得 +5 声望和 +2 龙虾币</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ThumbsUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">获得认可</h3>
                  <p className="text-sm text-gray-600">你的技能被下载和点赞，每次获得 +1 声望和 +1 龙虾币</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
