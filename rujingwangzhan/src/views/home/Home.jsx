import React, { useState } from 'react';

const Home = () => {
  // 移动端菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 热门目的地数据
  const featuredDestinations = [
    {
      id: 1,
      name: '桂林山水',
      description: '桂林山水甲天下，阳朔堪称甲桂林。探索令人惊叹的喀斯特地貌，乘坐竹筏漂流在漓江上，欣赏两岸的壮丽景色。',
      image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf',
      price: '¥3,299起'
    },
    {
      id: 2,
      name: '张家界',
      description: '探索令人叹为观止的石英砂岩峰林，这里的奇峰怪石是《阿凡达》电影中"哈利路亚山"的灵感来源。',
      image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4',
      price: '¥2,899起'
    },
    {
      id: 3,
      name: '九寨沟',
      description: '被誉为"人间仙境"的九寨沟，以其五彩斑斓的湖泊、壮观的瀑布和原始的森林而闻名。',
      image: 'https://images.unsplash.com/photo-1545293527-e26058c5b48b',
      price: '¥4,199起'
    }
  ];

  // 热门旅游路线数据
  const popularTours = [
    {
      id: 1,
      title: '丽江古城深度体验',
      days: 5,
      price: '¥3,999',
      highlights: ['丽江古城', '玉龙雪山', '泸沽湖', '束河古镇'],
      image: 'https://images.unsplash.com/photo-1528164344705-47542687000d'
    },
    {
      id: 2,
      title: '海南岛阳光之旅',
      days: 7,
      price: '¥5,699',
      highlights: ['三亚湾', '亚龙湾', '天涯海角', '南山文化旅游区'],
      image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523'
    },
    {
      id: 3,
      title: '北京文化探索之旅',
      days: 6,
      price: '¥4,299',
      highlights: ['故宫', '长城', '颐和园', '天坛'],
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶栏 */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="flex justify-between items-center px-5 py-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-500">China Tour</h1>
          </div>
          
          {/* 桌面端导航 */}
          <nav className="hidden md:block flex-1">
            <ul className="flex gap-8 justify-start pl-8">
              <li><a href="#" className="text-blue-500 font-medium border-b-2 border-blue-500 pb-1">首页</a></li>
              <li><a href="#" className="text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500 pb-1 transition duration-300">目的地</a></li>
              <li><a href="#" className="text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500 pb-1 transition duration-300">旅游路线</a></li>
              <li><a href="#" className="text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500 pb-1 transition duration-300">特色体验</a></li>
              <li><a href="#" className="text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500 pb-1 transition duration-300">关于我们</a></li>
            </ul>
          </nav>

          {/* 桌面端按钮 */}
          <div className="hidden md:flex gap-4">
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-300">登录</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">注册</button>
          </div>
          
          {/* 移动端汉堡菜单按钮 */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* 移动端折叠菜单 */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} px-4 py-2 pb-4 bg-white`}>
          <nav>
            <ul className="space-y-3">
              <li><a href="#" className="block text-blue-500 font-medium">首页</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-blue-500 transition duration-300">目的地</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-blue-500 transition duration-300">旅游路线</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-blue-500 transition duration-300">特色体验</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-blue-500 transition duration-300">关于我们</a></li>
            </ul>
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-300">登录</button>
              <button className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">注册</button>
            </div>
          </nav>
        </div>
      </header>

      {/* 内容区域 */}
      <main className="flex-1">
        {/* 英雄区域 */}
        <section className="h-[80vh] bg-cover bg-center flex items-center justify-center text-white text-center px-4" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd)' }}>
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">探索世界的每一个角落</h2>
            <p className="text-xl mb-8">让我们带您踏上一段难忘的旅程，发现世界各地的自然奇观和文化瑰宝</p>        
          </div>
        </section>

        {/* 热门目的地 */}
        <section className="py-20 px-5 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">热门目的地</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">发现令人惊叹的旅游胜地，开启您的下一次冒险</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredDestinations.map(destination => (
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2" key={destination.id}>
                <div className="relative h-60">
                  <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 right-4 bg-blue-500 bg-opacity-90 text-white py-1 px-3 rounded-md font-medium">{destination.price}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition duration-300">查看详情</button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 py-2 px-6 rounded-md font-medium transition duration-300">查看全部目的地</button>
          </div>
        </section>

        {/* 我们的优势 */}
        <section className="py-20 px-5 md:px-10 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">为什么选择我们？</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">我们致力于为您提供最优质的旅行体验</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:-translate-y-2 transition duration-300">
              <div className="text-5xl mb-6">🌟</div>
              <h3 className="text-xl font-bold mb-4">精选行程</h3>
              <p className="text-gray-600">每一条路线都经过精心设计，确保您能体验目的地的精华</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:-translate-y-2 transition duration-300">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="text-xl font-bold mb-4">价格透明</h3>
              <p className="text-gray-600">无隐藏费用，所见即所得，让您的旅行预算更加清晰</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:-translate-y-2 transition duration-300">
              <div className="text-5xl mb-6">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold mb-4">小团出行</h3>
              <p className="text-gray-600">小团队旅行，提供更加个性化和舒适的旅行体验</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:-translate-y-2 transition duration-300">
              <div className="text-5xl mb-6">🛡️</div>
              <h3 className="text-xl font-bold mb-4">安全保障</h3>
              <p className="text-gray-600">全程专业导游陪同，为您的旅行安全提供全方位保障</p>
            </div>
          </div>
        </section>

        {/* 热门旅游路线 */}
        <section className="py-20 px-5 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">热门旅游路线</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">精心设计的行程，带您领略目的地的精彩</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {popularTours.map(tour => (
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2" key={tour.id}>
                <div className="relative h-48">
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-blue-500 bg-opacity-90 text-white py-1 px-2 rounded-md font-medium">{tour.days}天</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{tour.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tour.highlights.map((highlight, index) => (
                      <span key={index} className="bg-blue-50 text-blue-500 px-3 py-1 rounded-md text-sm">{highlight}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-blue-500">{tour.price}</div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition duration-300">了解更多</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 py-2 px-6 rounded-md font-medium transition duration-300">查看全部路线</button>
          </div>
        </section>

        {/* 预订流程 */}
        <section className="py-20 px-5 md:px-10 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">预订流程</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">简单几步，开启您的完美旅程</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="text-4xl mb-6">🔍</div>
              <h3 className="text-xl font-bold mb-4">选择目的地</h3>
              <p className="text-gray-600">浏览我们的目的地和旅游路线，选择您心仪的行程</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="text-4xl mb-6">📅</div>
              <h3 className="text-xl font-bold mb-4">选择日期</h3>
              <p className="text-gray-600">选择您方便出行的日期，查看价格和可用性</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div className="text-4xl mb-6">📝</div>
              <h3 className="text-xl font-bold mb-4">填写信息</h3>
              <p className="text-gray-600">提供必要的旅行信息和个人资料</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div className="text-4xl mb-6">💳</div>
              <h3 className="text-xl font-bold mb-4">完成支付</h3>
              <p className="text-gray-600">选择您偏好的支付方式，安全完成预订</p>
            </div>
          </div>
        </section>

        {/* 订阅区域 */}
        <section className="py-20 px-5 text-center text-white bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800)' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">订阅我们的旅行资讯</h2>
            <p className="text-lg mb-8">获取最新的旅游优惠、目的地指南和旅行灵感</p>
            <div className="flex max-w-md mx-auto">
              <input type="email" placeholder="请输入您的邮箱" className="flex-1 py-3 px-4 rounded-l-md text-gray-800 bg-gray-100/65" />
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-r-md font-medium transition duration-300">订阅</button>
            </div>
          </div>
        </section>
      </main>

      {/* 尾部 */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-6 px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-6">锐景旅游</h3>
            <p className="mb-6 text-gray-400">我们致力于为您提供难忘的旅行体验，探索世界各地的自然奇观和文化瑰宝。</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">微信</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">微博</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">抖音</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">小红书</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-6">热门目的地</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">桂林</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">张家界</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">九寨沟</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">西藏</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">云南</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">海南</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-6">旅游资源</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">旅游攻略</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">目的地指南</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">旅行博客</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">常见问题</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">旅行保险</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-6">联系我们</h3>
            <ul className="space-y-3 text-gray-400">
              <li>📞 客服热线：400-123-4567</li>
              <li>📧 邮箱：info@rujing.com</li>
              <li>🏢 地址：北京市朝阳区锐景大厦</li>
              <li>⏰ 工作时间：周一至周日 9:00-21:00</li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-gray-800 text-gray-500">
          <p>© 2025 锐景旅游 版权所有 | 京ICP备12345678号</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
