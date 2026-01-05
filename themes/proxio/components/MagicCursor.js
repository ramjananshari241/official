import { useEffect, useRef } from 'react'

/**
 * MagicCursor Ultra - 0延迟水晶透镜光标
 * 移除 backdrop-filter，改用 CSS 光影模拟玻璃质感，大幅提升性能
 */
const MagicCursor = () => {
  const cursorRef = useRef(null)
  const requestRef = useRef(null)
  
  const mouse = useRef({ x: -100, y: -100 })
  const pos = useRef({ x: -100, y: -100 })
  const state = useRef({
    isHovering: false,
    isClicked: false,
    scale: 1,
    opacity: 0 
  })

  useEffect(() => {
    // 1. 监听逻辑
    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      
      if (state.current.opacity === 0) {
        state.current.opacity = 1
        pos.current = { x: e.clientX, y: e.clientY }
      }

      const target = e.target
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

    // 2. 物理循环 (参数调优：更跟手)
    const animate = () => {
      const cursor = cursorRef.current
      if (!cursor) return

      // ⚡️ 速度系数提升到 0.35 (之前是 0.2)，大幅减少“拖泥带水”的感觉，响应更快
      const speed = 0.35
      
      pos.current.x += (mouse.current.x - pos.current.x) * speed
      pos.current.y += (mouse.current.y - pos.current.y) * speed

      // 悬停时放大一点
      let targetScale = 1
      if (state.current.isClicked) targetScale = 0.8
      else if (state.current.isHovering) targetScale = 1.5

      state.current.scale += (targetScale - state.current.scale) * 0.2

      const x = pos.current.x
      const y = pos.current.y
      const s = state.current.scale

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
      <style jsx global>{`
        /* 隐藏默认鼠标 */
        body, a, button, input, select, textarea {
          cursor: none !important;
        }

        /* 强制隐藏旧主题可能残留的光标 */
        #cursor, .cursor, .custom-cursor, .mouse-cursor {
          display: none !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* ✨ 全新水晶透镜样式 */
        .magic-cursor-lens {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px; 
          height: 40px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          
          /* 🚫 核心改动：禁用模糊，解决卡顿 */
          backdrop-filter: none !important; 
          -webkit-backdrop-filter: none !important;

          /* 💎 视觉核心：用渐变和阴影模拟“球形弧面镜” */
          /* 1. 稍微带一点点白色的透明底 */
          background: rgba(255, 255, 255, 0.03);
          
          /* 2. 细微的白色边框，像镜片边缘 */
          border: 1px solid rgba(255, 255, 255, 0.3);
          
          /* 3. 复杂阴影组模拟立体感：
             - inset 0 0 10px: 内部发光
             - inset 10px 10px 20px: 模拟上方高光反射
             - drop-shadow: 外部投影
          */
          box-shadow: 
            inset 0 0 20px rgba(255, 255, 255, 0.1),
            inset 2px 2px 5px rgba(255, 255, 255, 0.2),
            0 0 15px rgba(255, 255, 255, 0.15);

          will-change: transform;
        }

        /* 中心瞄准点 (可选，增加精密感) */
        .magic-cursor-lens::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }
      `}</style>

      <div ref={cursorRef} className="magic-cursor-lens" />
    </>
  )
}

export default MagicCursor
