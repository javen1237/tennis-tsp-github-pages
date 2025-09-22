const CACHE_NAME = 'tennis-tsp-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
  'https://unpkg.com/@supabase/supabase-js@2'
];

// 安装事件 - 缓存资源
self.addEventListener('install', event => {
  console.log('Service Worker: 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 缓存文件');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: 安装完成');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: 安装失败', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('Service Worker: 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 删除旧缓存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: 激活完成');
      return self.clients.claim();
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，直接返回
        if (response) {
          return response;
        }
        
        // 否则发起网络请求
        return fetch(event.request).then(response => {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应
          const responseToCache = response.clone();

          // 添加到缓存
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // 网络失败时的后备方案
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// 后台同步
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: 后台同步');
    event.waitUntil(doBackgroundSync());
  }
});

// 推送通知
self.addEventListener('push', event => {
  console.log('Service Worker: 收到推送消息');
  
  const options = {
    body: event.data ? event.data.text() : '您有新的游戏挑战！',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '开始游戏',
        icon: './icons/icon-192.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: './icons/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('TSP游戏', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: 通知被点击');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// 后台同步函数
async function doBackgroundSync() {
  try {
    // 获取本地存储的数据
    const localData = JSON.parse(localStorage.getItem('tsp_game_data') || '[]');
    
    if (localData.length > 0) {
      // 这里可以添加上传到服务器的逻辑
      console.log('Service Worker: 找到', localData.length, '条待同步数据');
    }
  } catch (error) {
    console.error('Service Worker: 后台同步失败', error);
  }
}
