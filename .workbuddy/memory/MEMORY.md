# ClawSchool 项目记忆

## 项目概述
ClawSchool 是一个 AI Agent 技能分享平台，采用 Next.js 14 + PostgreSQL + Prisma 技术栈。

## 技术栈
- **框架**: Next.js 14 (App Router)
- **数据库**: PostgreSQL + Prisma ORM
- **样式**: Tailwind CSS (赛博朋克暗色主题)
- **UI组件**: Radix UI + shadcn/ui
- **认证**: JWT (bcryptjs + jsonwebtoken)

## 数据库模型
- **User**: 用户 (支持 USER/ADMIN/EXPERT 角色)
- **Agent**: AI智能体
- **Skill**: 技能 (带审核流程)
- **Review**: 评论
- **Post/PostComment**: 论坛帖子和评论
- **AuditLog**: 审计日志

## API结构
- `/api/auth/*` - 认证 (register, login, me, profile)
- `/api/skills/*` - 技能管理
- `/api/agents/*` - 智能体管理
- `/api/forum/posts/*` - 论坛功能
- `/api/ranking` - 排行榜
- `/api/admin/skills/*` - 管理员审核

## 前端页面
- 首页 `/`
- 技能市场 `/skills`
- 技能详情 `/skills/[id]`
- 发布技能 `/skills/create`
- Agents `/agents`
- 论坛 `/forum`
- 帖子详情 `/forum/posts/[id]`
- 发布帖子 `/forum/create`
- 排行榜 `/ranking`
- 关于 `/about`
- 登录 `/login`
- 注册 `/signup`, `/register`
- 个人中心 `/profile`
- 管理员后台 `/admin`

## 重要配置
- `.env` - 数据库连接和JWT密钥
- `prisma/schema.prisma` - 数据库模型定义

## 最近更新 (2026-03-30)
- 完成所有页面的赛博朋克暗色主题改造
- 实现完整的后端API系统
- 前端页面对接真实API
- 扩展schema支持论坛功能 (Post, PostComment)
- 新增功能页面：
  - 技能详情页（含评论、下载功能）
  - 发布技能页（含分类、标签、风险等级）
  - 帖子详情页（含评论、点赞功能）
  - 发布帖子页
  - 用户个人中心（含资料编辑）
  - 管理员后台（含技能审核、用户管理）

## 上线检查清单
1. 配置 PostgreSQL 数据库
2. 运行 `npx prisma db push` 初始化表结构
3. 运行 `npx prisma generate` 生成客户端
4. 配置 `.env` 文件（DATABASE_URL、JWT_SECRET）
5. 可选：创建管理员账号

## 部署信息
- **Vercel 项目**: ysls-projects-16670d67/clawschool
- **生产地址**: https://clawschool-three.vercel.app
- **GitHub 仓库**: ShiGuangManBu/clawschool
- **Neon 数据库**: neondb (已连接)
