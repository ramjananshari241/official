import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * 英雄区组件 - 动效增强版
 */
const Hero = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 如果未开启 Hero 区，直接返回 null
  if (!siteConfig('PROXIO_HERO_ENABLE', null, CONFIG)) {
    return null
  }

  // 滚动到下一屏的函数
  const scrollToNextSection = () => {
    const heroHeight = document.querySelector('#hero-section')?.clientHeight || window.innerHeight
    window.scrollTo({ top: heroHeight, behavior: 'smooth' })
  }

  return (
    <header
      id="hero-section"
      className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden z-10"
    >
      {/* 背景图层 (保持原有逻辑) */}
      <div className="absolute inset-0 z-0">
        {/* 优先显示 Iframe 背景 */}
        {siteConfig('PROXIO_HERO_BANNER_IFRAME_URL', null, CONFIG) ? (
          <iframe
            src={siteConfig('PROXIO_HERO_BANNER_IFRAME_URL', null, CONFIG)}
            className="w-full h-full border-none object-cover pointer-events-none"
          />
        ) : (
          /* 图片背景 */
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-[20s] ease-in-out transform scale-100 hover:scale-110"
            style={{
              backgroundImage: `url('${siteConfig('PROXIO_HERO_BANNER_IMAGE', null, CONFIG)}')`
            }}
          />
        )}
        {/* 黑色遮罩，确保文字清晰 */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        
        {/* ✨ 动效优化 1：滚动引导 (替代原来的手指 Emoji) */}
        <div 
            onClick={scrollToNextSection}
            className="mb-8 cursor-pointer group"
        >
            <div className="flex flex-col items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                {/* 动态圆圈 */}
                <div className="w-12 h-20 rounded-full border-2 border-white/30 flex justify-center p-2 relative backdrop-blur-sm">
                    {/* 内部滚动的小球 */}
                    <div className="w-1.5 h-3 bg-white rounded-full animate-[bounce_2s_infinite]"></div>
                </div>
                {/* 辅助文字 (可选，如果不需要可删除) */}
                <span className="text-xs text-white/50 tracking-widest font-light group-hover:text-white/80 transition-colors uppercase">
                    Scroll
                </span>
            </div>
        </div>

        {/* 标题文字 */}
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
          {siteConfig('PROXIO_HERO_TITLE_1', null, CONFIG)}
        </h1>
        <h2 className="text-xl md:text-3xl text-gray-200 font-light mb-10 tracking-wide">
          {siteConfig('PROXIO_HERO_TITLE_2', null, CONFIG)}
        </h2>

        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          
          {/* ✨ 动效优化 2：BLOG Demo 按钮 (扁平 + 科技感) */}
          {siteConfig('PROXIO_HERO_BUTTON_1_TEXT', null, CONFIG) && (
            <Link
              href={siteConfig('PROXIO_HERO_BUTTON_1_URL', null, CONFIG)}
              className="group relative"
            >
              {/* 按钮主体 */}
              <div className={`
                relative px-10 py-4 rounded-full 
                bg-white text-black 
                font-bold text-lg
                overflow-hidden
                transition-all duration-300 ease-out
                /* 悬停效果：放大、增加字间距、添加白色光晕 */
                group-hover:scale-105 
                group-hover:tracking-widest 
                group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]
              `}>
                {/* 掠光特效 (Shine Effect) */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                
                <span className="relative z-10">
                  {siteConfig('PROXIO_HERO_BUTTON_1_TEXT', null, CONFIG)}
                </span>
              </div>
            </Link>
          )}

          {/* 按钮 2 (Github) - 保持幽灵按钮风格但稍微优化交互 */}
          {siteConfig('PROXIO_HERO_BUTTON_2_TEXT', null, CONFIG) && (
            <Link
              href={siteConfig('PROXIO_HERO_BUTTON_2_URL', null, CONFIG)}
              target="_blank"
              className={`
                flex items-center gap-2 px-8 py-4 rounded-full 
                border border-white/30 text-white backdrop-blur-md
                transition-all duration-300
                hover:bg-white hover:text-black hover:border-white
                hover:shadow-lg
              `}
            >
              {siteConfig('PROXIO_HERO_BUTTON_2_ICON', null, CONFIG) && (
                <img
                  src={siteConfig('PROXIO_HERO_BUTTON_2_ICON', null, CONFIG)}
                  className="w-5 h-5 transition-filter duration-300 group-hover:invert"
                  alt="icon"
                />
              )}
              {siteConfig('PROXIO_HERO_BUTTON_2_TEXT', null, CONFIG)}
            </Link>
          )}

        </div>
      </div>

      {/* 底部渐变遮罩，让 Hero 区和下方内容自然过渡 */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </header>
  )
}

export default Hero
