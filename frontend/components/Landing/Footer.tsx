import { IconHeartFilled,IconBrandX,IconBrandGithub,IconBrandLinkedin } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='font-primary_regular flex  text-white h-full bg-zinc-900 bg-clip-padding backdrop-filter z-[100] backdrop-blur-sm bg-opacity-30 md:px-16 px-6 items-center justify-between py-6 border-t-2 border-zinc-800'>
        <div>
        Created with <IconHeartFilled className='inline-block'/> by <span className=''>Subramanian</span>
        </div>

        <div>
        <div className="flex items-center space-x-4">
          <Link href="https://github.com/subbuwu" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-all duration-150">
            <IconBrandGithub className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://twitter.com/subbu67007741" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-all duration-150">
            <IconBrandX className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="https://www.linkedin.com/in/subramanian-narayanan-52900624b" target="_blank" rel="noopener noreferrer" className="hover:placeholder-opacity-90 transition-all duration-150">
            <IconBrandLinkedin className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
        </div>
    </footer>
  )
}

export default Footer