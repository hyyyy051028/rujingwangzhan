import React, { useState } from 'react'

export default function HeaderHome() {
  // 移动端菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md ">
      <div className="flex justify-between items-center px-5 py-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500">China Tour</h1>
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
            <svg className="size-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="size-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 移动端折叠菜单 */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} px-4 py-4 pb-4 bg-white`}>
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
  )
}