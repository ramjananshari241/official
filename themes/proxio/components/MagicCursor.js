import { useEffect, useState, useRef } from 'react'

/**
 * MagicCursor - 赛博朋克反色透镜光标
 * 效果：反色(Difference)、液态延迟、点击缩放
 */
const MagicCursor = () => {
  const cursorRef = useRef(null)
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  // 使用 requestAnimationFrame 实现平滑跟随 (Lerp算法)
  // 目标位置 (鼠标真实位置)
  const targetPos = useRef({ x: -100, y: -100 })
  
  useEffect(() => {
    // 1. 鼠标移动监听
    const updateMousePosition = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY }
      
      // 检测鼠标是否悬停在可点击元素上 (链接、按钮)
      const target = e.target
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      
      setIsHovering(!!isClickable)
    }

    // 2. 点击监听
    const handleMouseDown = () => setIsClicked(true)
    const handleMouseUp = () => setIsClicked(false)

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    // 3. 动画循环 (实现延迟拖尾效果)
    let animationFrameId
    
    const animate = () => {
      // 这里的 0.15 是延迟系数，越小越慢，越大越跟手
      setPosition(prev => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.15,
        y: prev.y + (targetPos.current.y - prev.y) * 0.15
      }))
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      {/* 隐藏默认鼠标指针 (可选，如果你想完全接管) */}
      <style jsx global>{`
        /* 如果你想保留默认箭头，把下面这行删掉 */
        /* body { cursor: none; } a, button { cursor: none; } */
        
        /* 确保光标不阻挡点击 */
        .magic-cursor {
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference; /* 核心：反色混合模式 */
        }
      `}</style>

      {/* 光标主体 */}
      <div
        ref={cursorRef}
        className="magic-cursor fixed top-0 left-0 rounded-full bg-white flex items-center justify-center transition-all duration-300 ease-out will-change-transform"
        style={{
          // 使用 translate3d 开启硬件加速
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${isClicked ? 0.8 : (isHovering ? 1.5 : 1)})`,
          // 基础尺寸
          width: '32px',
          height: '32px',
          // 额外的玻璃质感 (模拟球体反光)
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), inset 0 0 5px rgba(0, 0, 0, 0.2)' 
        }}
      >
        {/* 中心的小红点 (增加科技精密感) */}
        {/* <div className={`w-1 h-1 bg-red-500 rounded-full transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`} /> */}
      </div>
    </>
  )
}

export default MagicCursor
