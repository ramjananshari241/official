import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * 英雄区组件 - 终极动效版 (流光背景 + 底部引导)
 */
const Hero = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!siteConfig('PROXIO_HERO_ENABLE', null, CONFIG)) {
    return null
  }

  const scrollToNextSection = () => {
    const heroHeight = document.querySelector('#hero-section')?.clientHeight || window.innerHeight
    window.scrollTo({ top: heroHeight, behavior: 'smooth' })
  }

  return (
    <header
      id="hero-section"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* =================================================================
          1. 动态背景层 (替代了原来的图片)
          这里使用了 CSS 动画光斑 + 网格纹理，营造大厂科技感
         ================================================================= */}
      
      {/* 动态样式定义 (内联 style 避免修改全局 CSS) */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: float 10s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #ffffff05 1px, transparent 1px),
                            linear-gradient(to bottom, #ffffff05 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      <div className="absolute inset-0 z-0">
        {/* 基础背景网格 (增加细腻度) */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.3]"></div>

        {/* 动态光斑 1 (紫色) - 左上 */}
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] animate-blob mix-blend-screen"></div>
        
        {/* 动态光斑 2 (蓝色) - 右下 */}
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
        
        {/* 动态光斑 3 (粉色/强调) - 中间游走 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
      </div>


      {/* =================================================================
          2. 核心内容区域 (标题 + 按钮)
         ================================================================= */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
        
        {/* 标题文字 */}
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight mb-6 drop-shadow-sm">
          {siteConfig('PROXIO_HERO_TITLE_1', null, CONFIG)}
        </h1>
        <h2 className="text-xl md:text-3xl text-gray-400 font-light mb-12 tracking-wide max-w-2xl">
          {siteConfig('PROXIO_HERO_TITLE_2', null, CONFIG)}
        </h2>

        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          
          {/* 按钮 1: BLOG Demo (科技感) */}
          {siteConfig('PROXIO_HERO_BUTTON_1_TEXT', null, CONFIG) && (
            <Link
              href={siteConfig('PROXIO_HERO_BUTTON_1_URL', null, CONFIG)}
              className="group relative"
            >
              <div className={`
                relative px-10 py-4 rounded-full 
                bg-white text-black 
                font-bold text-lg
                overflow-hidden
                transition-all duration-300 ease-out
                group-hover:scale-105 
                group-hover:tracking-widest 
                group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]
              `}>
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                <span className="relative z-10">
                  {siteConfig('PROXIO_HERO_BUTTON_1_TEXT', null, CONFIG)}
                </span>
              </div>
            </Link>
          )}

          {/* 按钮 2: Github (毛玻璃感) */}
          {siteConfig('PROXIO_HERO_BUTTON_2_TEXT', null, CONFIG) && (
            <Link
              href={siteConfig('PROXIO_HERO_BUTTON_2_URL', null, CONFIG)}
              target="_blank"
              className={`
                flex items-center gap-2 px-8 py-4 rounded-full 
                border border-white/10 text-white 
                bg-white/5 backdrop-blur-md
                transition-all duration-300
                hover:bg-white/10 hover:border-white/30
                hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
              `}
            >
              {siteConfig('PROXIO_HERO_BUTTON_2_ICON', null, CONFIG) && (
                <img
                  src={siteConfig('PROXIO_HERO_BUTTON_2_ICON', null, CONFIG)}
                  className="w-5 h-5 transition-filter duration-300 group-hover:brightness-125"
                  alt="icon"
                />
              )}
              {siteConfig('PROXIO_HERO_BUTTON_2_TEXT', null, CONFIG)}
            </Link>
          )}

        </div>
      </div>


      {/* =================================================================
          3. 滚动引导区 (移到底部 absolute bottom-10)
         ================================================================= */}
      <div 
          onClick={scrollToNextSection}
          className="absolute bottom-10 z-20 cursor-pointer group animate-bounce"
      >
          <div className="flex flex-col items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] text-white tracking-[0.3em] font-light uppercase">
                  Scroll
              </span>
              {/* 鼠标形状 */}
              <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2 backdrop-blur-sm">
                  {/* 滚轮点 */}
                  <div className="w-1 h-2 bg-white rounded-full animate-[scroll_1.5s_infinite]"></div>
              </div>
          </div>
      </div>

      {/* 底部渐变遮罩，衔接下一屏 */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-0" />
    </header>
  )
}

// 导出方式 (保持兼容性)
export { Hero }
export default Hero
