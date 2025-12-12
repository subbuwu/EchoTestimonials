import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-700'>
        <SignUp />
    </div>
  )
}