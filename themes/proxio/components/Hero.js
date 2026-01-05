import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * 英雄区组件 - 科幻标题 & 按钮交互优化版
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
      {/* 动态背景 CSS */}
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
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #ffffff05 1px, transparent 1px),
                            linear-gradient(to bottom, #ffffff05 1px, transparent 1px);
          background-size: 50px 50px;
        }
        /* 标题文字的霓虹光晕 */
        .text-glow {
          text-shadow: 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(100,200,255,0.1);
        }
      `}</style>

      {/* 1. 背景动效层 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.3]"></div>
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] animate-blob mix-blend-screen"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
      </div>

      {/* 2. 核心内容区域 */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
        
        {/* ✨ 优化点 1：标题样式大改 (科幻感) */}
        {/* font-black(最粗), tracking-tighter(紧凑), text-transparent(镂空), text-glow(自定义发光) */}
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 tracking-tighter mb-6 text-glow drop-shadow-2xl">
          {siteConfig('PROXIO_HERO_TITLE_1', null, CONFIG)}
        </h1>
        
        <h2 className="text-lg md:text-2xl text-gray-400 font-medium mb-12 tracking-wide max-w-2xl">
          {siteConfig('PROXIO_HERO_TITLE_2', null, CONFIG)}
        </h2>

        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          
          {/* ✨ 优化点 3：BLOG Demo 按钮 (新标签页打开) */}
          {siteConfig('PROXIO_HERO_BUTTON_1_TEXT', null, CONFIG) && (
            <Link
              href={siteConfig('PROXIO_HERO_BUTTON_1_URL', null, CONFIG)}
              target="_blank" // 🔗 在新标签页打开
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
                group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]
              `}>
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                <span className="relative z-10">
                  {siteConfig('PROXIO_HERO_BUTTON_1_TEXT', null, CONFIG)}
                </span>
              </div>
            </Link>
          )}

          {/* ✨ 优化点 2：右侧按钮 (视觉增强 + 尺寸对齐) */}
          {siteConfig('PROXIO_HERO_BUTTON_2_TEXT', null, CONFIG) && (
            <Link
              href={siteConfig('PROXIO_HERO_BUTTON_2_URL', null, CONFIG)}
              // 默认当前页打开，无需 target="_blank"
              className={`
                flex items-center gap-2 
                px-10 py-4 /* 📏 尺寸调整：由 px-8 改为 px-10，与左侧按钮保持一致 */
                rounded-full 
                border-2 border-white/20 /* 🎨 边框加粗，更显眼 */
                text-white font-semibold text-lg
                bg-white/10 backdrop-blur-md /* 🎨 背景加深，防止看不清 */
                transition-all duration-300
                hover:bg-white/20 hover:border-white/50 hover:scale-105
                hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] /* 增加悬停发光 */
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

      {/* 3. 滚动引导区 (底部) */}
      <div 
          onClick={scrollToNextSection}
          className="absolute bottom-10 z-20 cursor-pointer group animate-bounce"
      >
          <div className="flex flex-col items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] text-white tracking-[0.3em] font-light uppercase">
                  Scroll
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2 backdrop-blur-sm">
                  <div className="w-1 h-2 bg-white rounded-full animate-[scroll_1.5s_infinite]"></div>
              </div>
          </div>
      </div>

      {/* 底部遮罩 */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-0" />
    </header>
  )
}

export { Hero }
export default Hero
