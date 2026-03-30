# ClawSchool 部署指南

## 快速部署到 Vercel

### 第一步：推送代码到 GitHub

```bash
cd d:\clawschool

# 初始化 Git（如果还没初始化）
git init

# 添加所有文件
git add .

# 提交
git commit -m "ClawSchool 完整功能版本"

# 添加远程仓库（需要你先在 GitHub 创建仓库）
git remote add origin https://github.com/你的用户名/clawschool.git

# 推送
git push -u origin master
```

### 第二步：在 Vercel 创建项目

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量

### 第三步：配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | 你的 PostgreSQL 连接字符串 |
| `JWT_SECRET` | 一个随机字符串（可用 `openssl rand -base64 32` 生成） |

### 第四步：配置 PostgreSQL 数据库

推荐使用以下服务之一：

#### 选项 A: Vercel Postgres（推荐）
1. 在 Vercel 项目中点击 "Storage" → "Create Database"
2. 选择 "Vercel Postgres"
3. 复制连接字符串到 `DATABASE_URL`

#### 选项 B: Railway
1. 访问 [railway.app](https://railway.app)
2. 创建 PostgreSQL 数据库
3. 复制连接字符串

#### 选项 C: Supabase
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 在 Settings → Database 中找到连接字符串

#### 选项 D: Neon
1. 访问 [neon.tech](https://neon.tech)
2. 创建新项目
3. 复制连接字符串

### 第五步：部署后配置

部署完成后，需要初始化数据库：

1. 在 Vercel 项目中点击 "Deployments"
2. 点击最新部署的 "..." 菜单
3. 选择 "Redeploy"（第一次部署可能自动运行了）

或者手动运行数据库迁移：
```bash
npx prisma db push
```

### 第六步：创建管理员账号

数据库初始化后，需要手动设置一个管理员：

1. 使用 Prisma Studio：
```bash
npx prisma studio
```

2. 或者直接在数据库中执行：
```sql
UPDATE users SET role = 'ADMIN' WHERE email = '你的邮箱';
```

---

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，设置 DATABASE_URL 和 JWT_SECRET

# 初始化数据库
npx prisma db push

# 启动开发服务器
npm run dev
```

## 数据库连接字符串格式

PostgreSQL 连接字符串格式：
```
postgresql://用户名:密码@主机:5432/数据库名?schema=public
```

示例：
```
postgresql://postgres:password123@localhost:5432/clawschool?schema=public
```

## 常见问题

### Q: Prisma 生成失败？
确保 `DATABASE_URL` 环境变量正确设置。

### Q: 部署后页面空白？
检查环境变量是否正确配置。

### Q: 登录后 Token 失效？
确保 `JWT_SECRET` 与数据库中存储的一致。
