#!/bin/bash

# 网球场TSP游戏部署脚本
# 用于自动化部署到GitHub Pages

set -e  # 遇到错误时退出

echo "🚀 开始部署网球场TSP游戏..."

# 检查是否在git仓库中
if [ ! -d ".git" ]; then
    echo "❌ 错误: 当前目录不是git仓库"
    echo "请先初始化git仓库: git init"
    exit 1
fi

# 检查必要文件是否存在
required_files=("index.html" "manifest.json" "sw.js")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 错误: 缺少必要文件 $file"
        exit 1
    fi
done

# 检查icons目录
if [ ! -d "icons" ]; then
    echo "⚠️  警告: icons目录不存在，创建中..."
    mkdir -p icons
    echo "请手动添加 icon-192.png 和 icon-512.png 到 icons 目录"
fi

# 获取当前分支
current_branch=$(git branch --show-current)
echo "📍 当前分支: $current_branch"

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 发现未提交的更改，正在提交..."
    
    # 添加所有文件
    git add .
    
    # 获取提交信息
    if [ -n "$1" ]; then
        commit_message="$1"
    else
        commit_message="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    git commit -m "$commit_message"
    echo "✅ 更改已提交: $commit_message"
else
    echo "✅ 工作区干净，无需提交"
fi

# 推送到远程仓库
echo "📤 推送到远程仓库..."

# 检查是否有远程仓库
if ! git remote | grep -q "origin"; then
    echo "❌ 错误: 未找到origin远程仓库"
    echo "请先添加远程仓库: git remote add origin <repository-url>"
    exit 1
fi

# 推送当前分支
git push origin $current_branch

echo "✅ 代码已推送到 $current_branch 分支"

# 检查GitHub Pages设置
echo ""
echo "🔧 GitHub Pages部署检查清单:"
echo "1. ✅ 代码已推送到GitHub"
echo "2. 🔲 进入仓库Settings → Pages"
echo "3. 🔲 Source选择 'Deploy from a branch'"
echo "4. 🔲 Branch选择 '$current_branch'"
echo "5. 🔲 Folder选择 '/ (root)'"
echo "6. 🔲 点击Save保存设置"
echo ""

# 获取仓库信息
remote_url=$(git remote get-url origin)
if [[ $remote_url == *"github.com"* ]]; then
    # 提取用户名和仓库名
    if [[ $remote_url == *".git" ]]; then
        repo_info=${remote_url%.git}
    else
        repo_info=$remote_url
    fi
    
    repo_info=${repo_info##*/}
    user_info=${remote_url%/*}
    user_info=${user_info##*/}
    
    echo "📍 仓库信息:"
    echo "   用户名: $user_info"
    echo "   仓库名: $repo_info"
    echo ""
    echo "🌐 预期的GitHub Pages地址:"
    echo "   https://$user_info.github.io/$repo_info/"
    echo ""
    echo "⏰ 部署通常需要几分钟时间，请稍后访问上述地址"
fi

echo ""
echo "🎉 部署脚本执行完成！"
echo ""
echo "📋 后续步骤:"
echo "1. 访问GitHub仓库页面"
echo "2. 进入Settings → Pages配置GitHub Pages"
echo "3. 等待部署完成（通常2-10分钟）"
echo "4. 访问您的游戏网站"
echo ""
echo "🐛 如遇问题:"
echo "- 检查仓库是否为Public（免费版GitHub Pages要求）"
echo "- 确认所有文件都已正确上传"
echo "- 查看GitHub Actions页面的部署日志"
echo ""
echo "✨ 祝您游戏开发顺利！"
