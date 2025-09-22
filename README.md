# tennis-tsp-github-pages
# 🎾 网球场TSP数据采集游戏

一个基于旅行商问题(TSP)的路径优化挑战游戏，用于研究人类解决复杂优化问题的认知策略。

## 🎮 游戏特色

- **路径优化挑战**：找到访问所有网球的最短路径
- **数据采集**：记录玩家的决策过程和策略
- **移动端优化**：支持触屏操作，响应式设计
- **PWA支持**：可添加到主屏幕，离线使用
- **实时统计**：显示路径长度、用时等数据

## 🚀 快速开始

### 在线体验
访问 GitHub Pages 链接即可直接游玩！

### 本地部署
1. 克隆仓库
2. 直接打开 `index.html` 文件
3. 或使用任何静态文件服务器

### 数据上传配置
如需启用数据上传功能，请配置 Supabase：

1. 注册 [Supabase](https://supabase.com) 账号
2. 创建新项目
3. 在 `index.html` 中替换配置：
   ```javascript
   const SUPABASE_URL = 'your-project-url';
   const SUPABASE_ANON_KEY = 'your-anon-key';
