import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function HeaderHome() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token') || !!sessionStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // 移动端菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 当前活动链接状态
  const [activeSection, setActiveSection] = useState('hero');
  
  // 加载用户数据
  useEffect(() => {
    // 检查登录状态并加载用户数据
    const loadUserData = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          setUserData(user);
          setIsLoggedIn(true);
          console.log('User data loaded:', user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
          setUserData(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };
    
    // 初始加载用户数据
    loadUserData();
    
    // 监听storage变化
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user' || e.key === null) {
        loadUserData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 滚动监听函数
  useEffect(() => {
    const handleScroll = () => {
      // 获取所有部分
      const heroSection = document.getElementById('hero');
      const destinationsSection = document.getElementById('destinations');
      const featuresSection = document.getElementById('features');
      const toursSection = document.getElementById('tours');
      const aboutSection = document.getElementById('about');
      
      // 获取当前滚动位置和页面尺寸
      const scrollPosition = window.scrollY + 150; // 添加偏移量使高亮更准确
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = window.scrollY + windowHeight;
      
      // 从底部开始检测，确保最后一个部分有最高优先级
      if (aboutSection && (documentHeight - scrollBottom < 200 || scrollPosition >= aboutSection.offsetTop - 100)) {
        setActiveSection('about');
      } else if (toursSection && scrollPosition >= toursSection.offsetTop) {
        setActiveSection('tours');
      } else if (featuresSection && scrollPosition >= featuresSection.offsetTop) {
        setActiveSection('features');
      } else if (destinationsSection && scrollPosition >= destinationsSection.offsetTop) {
        setActiveSection('destinations');
      } else {
        setActiveSection('hero');
      }
    };
    
    // 添加滚动事件监听，使用防抖函数减少触发频率
    const debouncedHandleScroll = debounce(handleScroll, 50);
    window.addEventListener('scroll', debouncedHandleScroll);
    
    // 初始调用一次以设置初始状态
    handleScroll();
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);
  
  // 防抖函数定义
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
  
  // 处理登出
  const handleLogout = () => {
    // 清除所有存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingUserData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('pendingUserData');
    
    // 重置状态
    setIsLoggedIn(false);
    setUserData(null);
    setDropdownOpen(false);
    
    // 跳转到登录页面
    navigate('/login');
    setMobileMenuOpen(false);
  }
  
  // 切换下拉菜单状态
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md ">
      <div className="flex justify-between items-center px-5 py-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500">China Tour</h1>
        </div>

        {/* 桌面端导航 */}
        <nav className="hidden md:block flex-1">
          <ul className="flex gap-8 justify-start pl-8">
            <li><a href="#hero" className={`${activeSection === 'hero' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500'} font-medium pb-1 transition duration-300`}>首页</a></li>
            <li><a href="#destinations" className={`${activeSection === 'destinations' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500'} font-medium pb-1 transition duration-300`}>目的地</a></li>
            <li><a href="#features" className={`${activeSection === 'features' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500'} font-medium pb-1 transition duration-300`}>特色体验</a></li>
            <li><a href="#tours" className={`${activeSection === 'tours' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500'} font-medium pb-1 transition duration-300`}>旅游路线</a></li>
            <li><a href="#about" className={`${activeSection === 'about' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-700 hover:text-blue-500 hover:border-b-2 hover:border-blue-500'} font-medium pb-1 transition duration-300`}>关于我们</a></li>
          </ul>
        </nav>

        {/* 桌面端按钮 */}
        <div className="hidden md:flex gap-4 items-center">
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-300"
              >
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                  {userData?.username ? userData.username.charAt(0).toUpperCase() : '?'}
                </div>
                <span>{userData?.username || '用户'}</span>
                <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* 下拉菜单 */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userData?.username || '用户'}</p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email || ''}</p>
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人资料</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">我的订单</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">收藏夹</a>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-300"
              >
                登录
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                注册
              </button>
            </>
          )}
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
            <li><a href="#hero" onClick={() => setMobileMenuOpen(false)} className={`block ${activeSection === 'hero' ? 'text-blue-500 font-medium' : 'text-gray-700 hover:text-blue-500 transition duration-300'}`}>首页</a></li>
            <li><a href="#destinations" onClick={() => setMobileMenuOpen(false)} className={`block ${activeSection === 'destinations' ? 'text-blue-500 font-medium' : 'text-gray-700 hover:text-blue-500 transition duration-300'}`}>目的地</a></li>
            <li><a href="#features" onClick={() => setMobileMenuOpen(false)} className={`block ${activeSection === 'features' ? 'text-blue-500 font-medium' : 'text-gray-700 hover:text-blue-500 transition duration-300'}`}>特色体验</a></li>
            <li><a href="#tours" onClick={() => setMobileMenuOpen(false)} className={`block ${activeSection === 'tours' ? 'text-blue-500 font-medium' : 'text-gray-700 hover:text-blue-500 transition duration-300'}`}>旅游路线</a></li>
            <li><a href="#about" onClick={() => setMobileMenuOpen(false)} className={`block ${activeSection === 'about' ? 'text-blue-500 font-medium' : 'text-gray-700 hover:text-blue-500 transition duration-300'}`}>关于我们</a></li>
          </ul>
          {/* 移动端用户信息和按钮 */}
          <div className="mt-4">
            {isLoggedIn ? (
              <div className="space-y-3">
                {/* 用户信息卡片 */}
                <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl">
                    {userData?.username ? userData.username.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{userData?.username || '用户'}</p>
                    <p className="text-sm text-gray-500 truncate">{userData?.email || ''}</p>
                  </div>
                </div>
                
                {/* 用户菜单选项 */}
                <div className="border rounded-lg overflow-hidden">
                  <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      个人资料
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      我的订单
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      收藏夹
                    </div>
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }} 
                  className="flex-1 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-300 font-medium"
                >
                  登录
                </button>
                <button 
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }} 
                  className="flex-1 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 font-medium"
                >
                  注册
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}