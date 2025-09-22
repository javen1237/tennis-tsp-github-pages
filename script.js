class TennisCourtGame {
    constructor() {
        this.balls = [];
        this.visitedBalls = [];
        this.currentDistance = 0;
        this.gameStarted = false;
        this.gameTime = 0;
        this.timer = null;
        this.optimalPath = [];
        this.optimalDistance = 0;
        this.courtWidth = 800;
        this.courtHeight = 600;
        this.ballCount = 6;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateBalls();
    }
    
    initializeElements() {
        this.court = document.getElementById('tennisCourt');
        this.currentDistanceEl = document.getElementById('currentDistance');
        this.visitedCountEl = document.getElementById('visitedCount');
        this.totalBallsEl = document.getElementById('totalBalls');
        this.gameTimeEl = document.getElementById('gameTime');
        this.progressFill = document.getElementById('progressFill');
        this.comparisonPanel = document.getElementById('comparisonPanel');
        this.solverInfo = document.getElementById('solverInfo');
        this.optimalInfo = document.getElementById('optimalInfo');
        this.optimalDistanceEl = document.getElementById('optimalDistance');
        
        // Settings elements
        this.courtWidthSlider = document.getElementById('courtWidth');
        this.courtHeightSlider = document.getElementById('courtHeight');
        this.ballCountSlider = document.getElementById('ballCount');
        this.widthValueEl = document.getElementById('widthValue');
        this.heightValueEl = document.getElementById('heightValue');
        this.ballCountValueEl = document.getElementById('ballCountValue');
    }
    
    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateBalls());
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('showOptimalBtn').addEventListener('click', () => this.showOptimalSolution());
        
        // Settings listeners
        this.courtWidthSlider.addEventListener('input', (e) => {
            this.courtWidth = parseInt(e.target.value);
            this.widthValueEl.textContent = this.courtWidth + 'px';
            this.updateCourtSize();
        });
        
        this.courtHeightSlider.addEventListener('input', (e) => {
            this.courtHeight = parseInt(e.target.value);
            this.heightValueEl.textContent = this.courtHeight + 'px';
            this.updateCourtSize();
        });
        
        this.ballCountSlider.addEventListener('input', (e) => {
            this.ballCount = parseInt(e.target.value);
            this.ballCountValueEl.textContent = this.ballCount + '个';
            this.generateBalls();
        });
    }
    
    updateCourtSize() {
        this.court.style.width = this.courtWidth + 'px';
        this.court.style.height = this.courtHeight + 'px';
        this.generateBalls(); // 重新生成球的位置
    }
    
    generateBalls() {
        this.clearCourt();
        this.balls = [];
        this.visitedBalls = [];
        this.currentDistance = 0;
        this.gameStarted = false;
        this.gameTime = 0;
        this.optimalPath = [];
        this.optimalDistance = 0;
        
        // 生成随机位置的网球
        for (let i = 0; i < this.ballCount; i++) {
            const ball = {
                id: i,
                x: Math.random() * (this.courtWidth - 40) + 20,
                y: Math.random() * (this.courtHeight - 40) + 20
            };
            this.balls.push(ball);
            this.createBallElement(ball);
        }
        
        this.updateDisplay();
        this.comparisonPanel.style.display = 'none';
        this.solverInfo.style.display = 'none';
        this.optimalInfo.style.display = 'none';
    }
    
    createBallElement(ball) {
        const ballEl = document.createElement('div');
        ballEl.className = 'tennis-ball';
        ballEl.style.left = (ball.x - 8) + 'px';
        ballEl.style.top = (ball.y - 8) + 'px';
        ballEl.dataset.id = ball.id;
        
        ballEl.addEventListener('click', () => this.clickBall(ball.id));
        
        this.court.appendChild(ballEl);
    }
    
    clearCourt() {
        const balls = this.court.querySelectorAll('.tennis-ball');
        const lines = this.court.querySelectorAll('.path-line, .optimal-path-line');
        balls.forEach(ball => ball.remove());
        lines.forEach(line => line.remove());
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    startGame() {
        if (this.balls.length === 0) {
            alert('请先生成网球！');
            return;
        }
        
        this.gameStarted = true;
        this.gameTime = 0;
        this.visitedBalls = [];
        this.currentDistance = 0;
        
        // 清除之前的路径
        const lines = this.court.querySelectorAll('.path-line');
        lines.forEach(line => line.remove());
        
        // 重置所有球的状态
        const ballElements = this.court.querySelectorAll('.tennis-ball');
        ballElements.forEach(ball => {
            ball.classList.remove('visited', 'current');
        });
        
        this.startTimer();
        this.updateDisplay();
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('generateBtn').disabled = true;
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.gameTime++;
            this.gameTimeEl.textContent = this.gameTime;
        }, 1000);
    }
    
    clickBall(ballId) {
        if (!this.gameStarted) {
            alert('请先点击"开始游戏"！');
            return;
        }
        
        const ball = this.balls.find(b => b.id === ballId);
        if (!ball) return;
        
        // 检查是否已经访问过
        if (this.visitedBalls.some(b => b.id === ballId)) {
            return;
        }
        
        // 添加到访问列表
        this.visitedBalls.push(ball);
        
        // 计算距离
        if (this.visitedBalls.length > 1) {
            const prevBall = this.visitedBalls[this.visitedBalls.length - 2];
            const distance = this.calculateDistance(prevBall, ball);
            this.currentDistance += distance;
            
            // 绘制路径线
            this.drawPathLine(prevBall, ball);
        }
        
        // 更新球的视觉状态
        this.updateBallStates();
        this.updateDisplay();
        
        // 检查游戏是否完成
        if (this.visitedBalls.length === this.balls.length) {
            this.endGame();
        }
    }
    
    updateBallStates() {
        const ballElements = this.court.querySelectorAll('.tennis-ball');
        ballElements.forEach(ballEl => {
            const ballId = parseInt(ballEl.dataset.id);
            ballEl.classList.remove('visited', 'current');
            
            if (this.visitedBalls.some(b => b.id === ballId)) {
                ballEl.classList.add('visited');
            }
        });
        
        // 标记当前球
        if (this.visitedBalls.length > 0) {
            const currentBallId = this.visitedBalls[this.visitedBalls.length - 1].id;
            const currentBallEl = this.court.querySelector(`[data-id="${currentBallId}"]`);
            if (currentBallEl) {
                currentBallEl.classList.add('current');
            }
        }
    }
    
    drawPathLine(from, to) {
        const line = document.createElement('div');
        line.className = 'path-line';
        
        const distance = this.calculateDistance(from, to);
        const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
        
        line.style.left = from.x + 'px';
        line.style.top = from.y + 'px';
        line.style.width = distance + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        
        this.court.appendChild(line);
    }
    
    drawOptimalPathLine(from, to) {
        const line = document.createElement('div');
        line.className = 'optimal-path-line';
        
        const distance = this.calculateDistance(from, to);
        const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
        
        line.style.left = from.x + 'px';
        line.style.top = from.y + 'px';
        line.style.width = distance + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        
        this.court.appendChild(line);
    }
    
    calculateDistance(ball1, ball2) {
        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    updateDisplay() {
        this.currentDistanceEl.textContent = Math.round(this.currentDistance);
        this.visitedCountEl.textContent = this.visitedBalls.length;
        this.totalBallsEl.textContent = this.balls.length;
        
        const progress = (this.visitedBalls.length / this.balls.length) * 100;
        this.progressFill.style.width = progress + '%';
        
        if (this.optimalDistance > 0) {
            this.optimalDistanceEl.textContent = Math.round(this.optimalDistance);
        }
    }
    
    endGame() {
        this.gameStarted = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('generateBtn').disabled = false;
        
        // 计算最优解
        this.calculateOptimalSolution();
        
        // 显示结果对比
        this.showComparison();
        
        alert(`🎉 恭喜完成！\n你的路径长度: ${Math.round(this.currentDistance)}\n用时: ${this.gameTime}秒`);
    }
    
    resetGame() {
        this.gameStarted = false;
        this.visitedBalls = [];
        this.currentDistance = 0;
        this.gameTime = 0;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 清除路径线
        const lines = this.court.querySelectorAll('.path-line');
        lines.forEach(line => line.remove());
        
        // 重置球状态
        const ballElements = this.court.querySelectorAll('.tennis-ball');
        ballElements.forEach(ball => {
            ball.classList.remove('visited', 'current');
        });
        
        this.updateDisplay();
        this.comparisonPanel.style.display = 'none';
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('generateBtn').disabled = false;
    }
    
    // TSP求解算法 - 最近邻 + 2-opt优化
    calculateOptimalSolution() {
        if (this.balls.length < 2) return;
        
        // 使用最近邻算法获得初始解
        let path = this.nearestNeighborTSP();
        let distance = this.calculatePathDistance(path);
        
        // 使用2-opt算法优化
        const optimizedResult = this.twoOptImprovement(path);
        path = optimizedResult.path;
        distance = optimizedResult.distance;
        
        this.optimalPath = path;
        this.optimalDistance = distance;
    }
    
    nearestNeighborTSP() {
        const unvisited = [...this.balls];
        const path = [];
        
        // 从第一个球开始
        let current = unvisited.shift();
        path.push(current);
        
        while (unvisited.length > 0) {
            let nearest = unvisited[0];
            let nearestDistance = this.calculateDistance(current, nearest);
            let nearestIndex = 0;
            
            for (let i = 1; i < unvisited.length; i++) {
                const distance = this.calculateDistance(current, unvisited[i]);
                if (distance < nearestDistance) {
                    nearest = unvisited[i];
                    nearestDistance = distance;
                    nearestIndex = i;
                }
            }
            
            path.push(nearest);
            unvisited.splice(nearestIndex, 1);
            current = nearest;
        }
        
        return path;
    }
    
    twoOptImprovement(initialPath) {
        let path = [...initialPath];
        let bestDistance = this.calculatePathDistance(path);
        let improved = true;
        
        while (improved) {
            improved = false;
            
            for (let i = 1; i < path.length - 2; i++) {
                for (let j = i + 1; j < path.length; j++) {
                    if (j - i === 1) continue; // 跳过相邻的边
                    
                    const newPath = this.twoOptSwap(path, i, j);
                    const newDistance = this.calculatePathDistance(newPath);
                    
                    if (newDistance < bestDistance) {
                        path = newPath;
                        bestDistance = newDistance;
                        improved = true;
                    }
                }
            }
        }
        
        return { path, distance: bestDistance };
    }
    
    twoOptSwap(path, i, j) {
        const newPath = [...path];
        // 反转i到j之间的路径
        while (i < j) {
            [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
            i++;
            j--;
        }
        return newPath;
    }
    
    calculatePathDistance(path) {
        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            totalDistance += this.calculateDistance(path[i], path[i + 1]);
        }
        return totalDistance;
    }
    
    showOptimalSolution() {
        if (this.optimalPath.length === 0) {
            this.calculateOptimalSolution();
        }
        
        // 清除之前的最优路径线
        const optimalLines = this.court.querySelectorAll('.optimal-path-line');
        optimalLines.forEach(line => line.remove());
        
        // 绘制最优路径
        for (let i = 0; i < this.optimalPath.length - 1; i++) {
            this.drawOptimalPathLine(this.optimalPath[i], this.optimalPath[i + 1]);
        }
        
        this.solverInfo.style.display = 'block';
        this.optimalInfo.style.display = 'block';
        this.updateDisplay();
    }
    
    showComparison() {
        if (this.optimalDistance === 0) return;
        
        const playerDistance = Math.round(this.currentDistance);
        const optimalDistance = Math.round(this.optimalDistance);
        const gap = ((playerDistance - optimalDistance) / optimalDistance * 100);
        
        document.getElementById('playerResult').textContent = playerDistance;
        document.getElementById('optimalResult').textContent = optimalDistance;
        document.getElementById('gapResult').textContent = gap.toFixed(1) + '%';
        
        // 性能评价
        const messageEl = document.getElementById('performanceMessage');
        if (gap <= 5) {
            messageEl.textContent = '🏆 完美！你找到了接近最优的解决方案！';
            messageEl.className = 'performance-message performance-excellent';
        } else if (gap <= 15) {
            messageEl.textContent = '👍 很好！你的解决方案相当不错！';
            messageEl.className = 'performance-message performance-good';
        } else {
            messageEl.textContent = '💪 继续努力！尝试寻找更短的路径！';
            messageEl.className = 'performance-message performance-poor';
        }
        
        this.comparisonPanel.style.display = 'block';
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new TennisCourtGame();
});
