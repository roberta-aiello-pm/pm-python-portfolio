import { motion } from 'framer-motion'

export function ButtonPrimary({ children, href, onClick, type = 'button' }) {
  const cls = `
    inline-block px-8 py-3.5 text-sm tracking-[0.18em] uppercase font-sans font-medium
    border border-[#B8963E] text-[#B8963E] bg-transparent
    transition-colors duration-300
  `
  const inner = (
    <motion.span
      className="block"
      whileHover={{ letterSpacing: '0.22em' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.span>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={cls}
        whileHover={{ backgroundColor: '#B8963E', color: '#F5F0E8' }}
        transition={{ duration: 0.25 }}
      >
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cls}
      whileHover={{ backgroundColor: '#B8963E', color: '#F5F0E8' }}
      transition={{ duration: 0.25 }}
    >
      {inner}
    </motion.button>
  )
}

export function ButtonGhost({ children, href, onClick }) {
  const cls = `
    inline-block px-8 py-3.5 text-sm tracking-[0.18em] uppercase font-sans font-medium
    border border-[#F5F0E8] text-[#F5F0E8] bg-transparent
    transition-colors duration-300
  `
  if (href) {
    return (
      <motion.a
        href={href}
        className={cls}
        whileHover={{ backgroundColor: '#F5F0E8', color: '#2C4A35' }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cls}
      whileHover={{ backgroundColor: '#F5F0E8', color: '#2C4A35' }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.button>
  )
}
