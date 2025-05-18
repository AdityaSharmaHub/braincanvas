import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 z-10'>
        <span>Made with ❤️ by </span>
        <Link href="https://adityasharma.vercel.app" className='underline underline-offset-2 hover:text-gray-800 dark:hover:text-gray-300 duration' target="_blank">Aditya Sharma</Link>
    </footer>
  )
}

export default Footer