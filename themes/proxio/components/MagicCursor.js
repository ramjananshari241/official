import { useEffect, useRef } from 'react'

/**
 * MagicCursor Pro - 高性能物理引擎光标
 * 使用直接 DOM 操作而非 React State，解决卡顿问题
 */
const MagicCursor = () => {
  // 使用 useRef 存储 DOM 引用和坐标数据，不触发渲染
  const cursorRef = useRef(null)
  const requestRef = useRef(null)
  
  // 鼠标真实位置 (Target)
  const mouse = useRef({ x: -100, y: -100 })
  // 光标当前位置 (Current) - 用于计算延迟
  const pos = useRef({ x: -100, y: -100 })
  // 状态标记
  const state = useRef({
    isHovering: false,
    isClicked: false,
    scale: 1,
    opacity: 0 // 初始隐藏，动起来再显示
  })

  useEffect(() => {
    // 1. 高性能鼠标监听
    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      
      // 只有第一次移动时才显示光标，防止初始位置闪烁
      if (state.current.opacity === 0) {
        state.current.opacity = 1
        pos.current = { x: e.clientX, y: e.clientY } // 瞬间归位
      }

      // 悬停检测 (使用原生 API 提升性能)
      const target = e.target
      // 检查标签名或 cursor-pointer 类
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      
      state.current.isHovering = isClickable
    }

    const onMouseDown = () => { state.current.isClicked = true }
    const onMouseUp = () => { state.current.isClicked = false }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    // 2. 物理动画循环 (60FPS / 120FPS)
    const animate = () => {
      const cursor = cursorRef.current
      if (!cursor) return

      // 缓动算法 (Lerp): 当前位置 += (目标位置 - 当前位置) * 速度系数
      // 0.2 是速度系数，越大越快，0.1~0.2 之间质感最好
      const speed = 0.2
      pos.current.x += (mouse.current.x - pos.current.x) * speed
      pos.current.y += (mouse.current.y - pos.current.y) * speed

      // 计算目标缩放比例
      let targetScale = 1
      if (state.current.isClicked) targetScale = 0.8 // 点击缩小
      else if (state.current.isHovering) targetScale = 1.8 // 悬停放大

      // 缩放也加一点缓动
      state.current.scale += (targetScale - state.current.scale) * 0.15

      // 直接操作 DOM (核心性能来源)
      const x = pos.current.x
      const y = pos.current.y
      const s = state.current.scale

      // 使用 translate3d 开启 GPU 加速
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${s})`
      cursor.style.opacity = state.current.opacity

      requestRef.current = requestAnimationFrame(animate)
    }
    
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return (
    <>
      {/* 
         全局样式注入：
         1. 隐藏默认鼠标
         2. 暴力隐藏旧光标 (根据常见的类名猜测)
      */}
      <style jsx global>{`
        /* 隐藏默认鼠标 */
        body, a, button, input {
          cursor: none !important;
        }

        /* 🛑 暴力隐藏旧光标 */
        /* 这里列出了所有可能的主题光标类名/ID，统统隐藏 */
        #cursor, .cursor, .custom-cursor, .mouse-cursor, #mouse-cursor, .cursor-outer, .cursor-inner {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* 新光标样式 */
        .magic-cursor-pro {
          position: fixed;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          
          /* 🔮 视觉核心：反色 + 玻璃质感 */
          background: white;
          mix-blend-mode: difference; /* 遇到黑变白，遇到白变黑 */
          
          /* 增加一点内阴影模拟球体 */
          box-shadow: inset 0 0 0 2px rgba(0,0,0,0.1); 
          
          will-change: transform; /* 提示浏览器进行优化 */
        }
      `}</style>

      <div ref={cursorRef} className="magic-cursor-pro" />
    </>
  )
}

export default MagicCursor
