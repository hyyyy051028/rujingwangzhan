export default function FooterHome() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-6 px-5 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div>
          <h3 className="text-xl font-bold text-white mb-6">China Tour</h3>
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
            <li>🏢 地址：xxxxxxxx</li>
            <li>⏰ 工作时间：周一至周日 9:00-21:00</li>
          </ul>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-gray-800 text-gray-500">
        <p>© 2025 China Tour 版权所有 | 京ICP备12345678号</p>
      </div>
    </footer>
  )
}