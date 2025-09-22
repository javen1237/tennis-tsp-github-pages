#!/bin/bash

# 网球旅行商问题游戏 - 部署脚本
# Tennis TSP Game Deployment Script

echo "🎾 网球旅行商问题游戏 - 自动部署脚本"
echo "================================================"

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必要文件
echo -e "${BLUE}📋 检查项目文件...${NC}"
required_files=("index.html" "styles.css" "script.js" "README.md")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
        echo -e "${RED}❌ 缺少文件: $file${NC}"
    else
        echo -e "${GREEN}✅ 找到文件: $file${NC}"
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo -e "${RED}❌ 部署失败：缺少必要文件${NC}"
    exit 1
fi

# 创建部署目录
DEPLOY_DIR="tennis-tsp-game"
echo -e "${BLUE}📁 创建部署目录: $DEPLOY_DIR${NC}"

if [ -d "$DEPLOY_DIR" ]; then
    echo -e "${YELLOW}⚠️  目录已存在，正在清理...${NC}"
    rm -rf "$DEPLOY_DIR"
fi

mkdir -p "$DEPLOY_DIR"

# 复制文件
echo -e "${BLUE}📄 复制项目文件...${NC}"
cp index.html "$DEPLOY_DIR/"
cp styles.css "$DEPLOY_DIR/"
cp script.js "$DEPLOY_DIR/"
cp README.md "$DEPLOY_DIR/"

# 创建额外的部署文件
echo -e "${BLUE}🔧 创建部署配置文件...${NC}"

# 创建 .gitignore
cat > "$DEPLOY_DIR/.gitignore" << 'EOF'
# 系统文件
.DS_Store
Thumbs.db

# 编辑器文件
.vscode/
.idea/
*.swp
*.swo

# 日志文件
*.log

# 临时文件
*.tmp
*.temp

# 备份文件
*.bak
*.backup
EOF

# 创建 package.json (如果需要npm部署)
cat > "$DEPLOY_DIR/package.json" << 'EOF'
{
  "name": "tennis-tsp-game",
  "version": "1.0.0",
  "description": "一个基于旅行商问题的互动网球游戏",
  "main": "index.html",
  "scripts": {
    "start": "python -m http.server 8080",
    "serve": "python3 -m http.server 8080",
    "dev": "python -m http.server 3000"
  },
  "keywords": [
    "tsp",
    "traveling-salesman",
    "game",
    "algorithm",
    "tennis",
    "optimization"
  ],
  "author": "Monica Assistant",
  "license": "MIT",
  "homepage": "https://github.com/username/tennis-tsp-game",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/tennis-tsp-game.git"
  }
}
EOF

# 创建简单的HTTP服务器启动脚本
cat > "$DEPLOY_DIR/start-server.sh" << 'EOF'
#!/bin/bash
echo "🚀 启动网球TSP游戏服务器..."
echo "📍 访问地址: http://localhost:8080"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

# 检查Python版本并启动服务器
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    python -m http.server 8080
else
    echo "❌ 错误: 未找到Python，请安装Python后重试"
    echo "💡 或者直接用浏览器打开 index.html 文件"
fi
EOF

# 创建Windows批处理文件
cat > "$DEPLOY_DIR/start-server.bat" << 'EOF'
@echo off
echo 🎾 启动网球TSP游戏服务器...
echo 📍 访问地址: http://localhost:8080
echo 🛑 按 Ctrl+C 停止服务器
echo.

REM 检查Python并启动服务器
python --version >nul 2>&1
if %errorlevel% == 0 (
    python -m http.server 8080
) else (
    echo ❌ 错误: 未找到Python，请安装Python后重试
    echo 💡 或者直接用浏览器打开 index.html 文件
    pause
)
EOF

# 设置执行权限
chmod +x "$DEPLOY_DIR/start-server.sh"

# 创建部署说明文件
cat > "$DEPLOY_DIR/DEPLOY.md" << 'EOF'
# 部署说明

## 🚀 快速启动

### 方法1: 直接打开
直接用浏览器打开 `index.html` 文件即可开始游戏。

### 方法2: 本地服务器
```bash
# Linux/Mac
./start-server.sh

# Windows
start-server.bat

# 手动启动
python -m http.server 8080
# 或
python3 -m http.server 8080
```

然后访问: http://localhost:8080

## 📦 部署到Web服务器

### GitHub Pages
1. 将项目上传到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择主分支作为源
4. 访问生成的GitHub Pages链接

### Netlify
1. 将整个文件夹拖拽到Netlify部署页面
2. 或连接GitHub仓库自动部署

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### 传统Web服务器
将所有文件上传到Web服务器的根目录或子目录即可。

## 🔧 配置要求

- **浏览器**: 支持ES6+的现代浏览器
- **服务器**: 任何能提供静态文件的Web服务器
- **依赖**: 无外部依赖，纯前端项目

## 📱 兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移动端浏览器

## 🛠️ 自定义配置

可以在 `script.js` 中修改以下参数：
- 默认场地大小
- 网球数量范围
- 算法参数
- 动画速度
EOF

echo -e "${GREEN}✅ 项目文件复制完成${NC}"
echo -e "${GREEN}✅ 配置文件创建完成${NC}"

# 显示部署结果
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${BLUE}📁 部署目录: $DEPLOY_DIR${NC}"
echo ""
echo -e "${YELLOW}🚀 启动方法:${NC}"
echo -e "   1. 直接打开: $DEPLOY_DIR/index.html"
echo -e "   2. 本地服务器: cd $DEPLOY_DIR && ./start-server.sh"
echo -e "   3. Windows: cd $DEPLOY_DIR && start-server.bat"
echo ""
echo -e "${BLUE}📖 更多部署选项请查看: $DEPLOY_DIR/DEPLOY.md${NC}"

# 询问是否立即启动
echo ""
read -p "是否立即启动本地服务器？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🚀 启动服务器...${NC}"
    cd "$DEPLOY_DIR"
    echo -e "${BLUE}📍 访问地址: http://localhost:8080${NC}"
    echo -e "${YELLOW}🛑 按 Ctrl+C 停止服务器${NC}"
    echo ""
    
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8080
    elif command -v python &> /dev/null; then
        python -m http.server 8080
    else
        echo -e "${RED}❌ 未找到Python，请手动打开 index.html${NC}"
    fi
fi

echo -e "${GREEN}✨ 感谢使用网球旅行商问题游戏！${NC}"
