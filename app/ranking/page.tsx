'use client'

import { useState, useEffect } from 'react'
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
  Download,
  Loader2
} from 'lucide-react'
import { rankingApi, Skill, User } from '@/lib/api-client'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" style={{filter:'drop-shadow(0 0 6px rgba(250,204,21,0.8))'}} />
  if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" style={{filter:'drop-shadow(0 0 6px rgba(203,213,225,0.6))'}} />
  if (rank === 3) return <Award className="w-6 h-6 text-orange-400" style={{filter:'drop-shadow(0 0 6px rgba(251,146,60,0.8))'}} />
  return <span className="w-6 h-6 flex items-center justify-center font-bold text-cyan-100/40">{rank}</span>
}

const getRankStyle = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/30'
  if (rank === 2) return 'bg-gradient-to-r from-slate-400/10 to-slate-400/5 border-slate-400/30'
  if (rank === 3) return 'bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/30'
  return 'bg-[#0d1425]/50 border-cyan-500/15'
}

const getRoleBadge = (role: string) => {
  if (role === 'ADMIN') return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">管理员</Badge>
  if (role === 'EXPERT') return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">专家</Badge>
  return null
}

export default function RankingPage() {
  const [userRanking, setUserRanking] = useState<User[]>([])
  const [skillRanking, setSkillRanking] = useState<Skill[]>([])
  const [downloadRanking, setDownloadRanking] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [users, skills, downloads] = await Promise.all([
          rankingApi.getUsers(),
          rankingApi.getSkills(),
          rankingApi.getDownloads(),
        ])
        setUserRanking(users)
        setSkillRanking(skills)
        setDownloadRanking(downloads)
      } catch (error) {
        console.error('Failed to fetch ranking:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-[#020818]">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 via-cyan-500/5 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" style={{filter:'drop-shadow(0 0 20px rgba(250,204,21,0.6))'}} />
          <h1 className="text-4xl font-bold mb-4 text-white neon-text-cyan">贡献排行榜</h1>
          <p className="text-xl text-cyan-100/70">致敬每一位为社区贡献的开发者</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="reputation" className="space-y-8">
          <TabsList className="w-full justify-center bg-[#0d1425] border border-cyan-500/20">
            <TabsTrigger value="reputation" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-100/50">
              <Trophy className="w-4 h-4" />
              声望排行
            </TabsTrigger>
            <TabsTrigger value="coins" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-100/50">
              <Flame className="w-4 h-4" />
              龙虾币排行
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-100/50">
              <Code className="w-4 h-4" />
              热门技能
            </TabsTrigger>
          </TabsList>

          {/* Reputation Ranking */}
          <TabsContent value="reputation">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  声望排行榜 Top 20
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userRanking.slice(0, 20).map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(index + 1)}`}
                      >
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>
                        
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg text-white">{user.name}</h3>
                            {getRoleBadge(user.role)}
                          </div>
                          {user.bio && (
                            <p className="text-sm text-cyan-100/50 truncate">{user.bio}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-lg text-cyan-400">
                              {((user._count?.skills || 0) * 10 + (user._count?.reviews || 0) * 2)}
                            </div>
                            <div className="text-cyan-100/50">声望</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg flex items-center text-orange-400">
                              <Flame className="w-4 h-4 mr-1" />
                              {user._count?.skills || 0}
                            </div>
                            <div className="text-cyan-100/50">龙虾币</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg text-purple-400">{user._count?.reviews || 0}</div>
                            <div className="text-cyan-100/50">贡献</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {userRanking.length === 0 && (
                      <p className="text-center text-cyan-100/40 py-10">暂无数据</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coin Ranking */}
          <TabsContent value="coins">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Flame className="w-6 h-6 text-orange-400" />
                  龙虾币排行榜 Top 10
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userRanking.slice(0, 30).map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(index + 1)}`}
                      >
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>
                        
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{user.name}</h3>
                        </div>
                        
                        <div className="flex items-center gap-1 font-bold text-orange-400">
                          <Flame className="w-5 h-5" />
                          {user._count?.skills || 0}
                        </div>
                      </div>
                    ))}
                    {userRanking.length === 0 && (
                      <p className="col-span-full text-center text-cyan-100/40 py-10">暂无数据</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hot Skills */}
          <TabsContent value="skills">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Code className="w-6 h-6 text-cyan-400" />
                  热门技能排行
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {skillRanking.slice(0, 20).map((skill, index) => (
                      <div 
                        key={skill.id} 
                        className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(index + 1)}`}
                      >
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-white">{skill.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-cyan-100/50">
                            <span>{skill.author.name}</span>
                            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                              {skill.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 font-bold text-yellow-400">
                            <ThumbsUp className="w-4 h-4" />
                            {skill.rating.toFixed(1)}
                          </span>
                          <div className="flex items-center gap-1 font-bold text-cyan-400">
                            <Download className="w-5 h-5" />
                            {skill.downloads}
                          </div>
                        </div>
                      </div>
                    ))}
                    {skillRanking.length === 0 && (
                      <p className="text-center text-cyan-100/40 py-10">暂无数据</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contribution Guide */}
        <Card className="cyber-card mt-8">
          <CardHeader>
            <CardTitle className="text-white">如何获得声望和龙虾币？</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-500/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                  <Code className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">提交技能</h3>
                  <p className="text-sm text-cyan-100/60">分享你的 Agent 技能，通过审核获得 +100 声望和 +50 龙虾币</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">参与讨论</h3>
                  <p className="text-sm text-cyan-100/60">在论坛发表优质回复，获得 +5 声望和 +2 龙虾币</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-yellow-500/30">
                  <ThumbsUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">获得认可</h3>
                  <p className="text-sm text-cyan-100/60">你的技能被下载和点赞，每次获得 +1 声望和 +1 龙虾币</p>
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
