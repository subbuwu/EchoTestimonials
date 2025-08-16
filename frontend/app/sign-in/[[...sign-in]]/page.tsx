import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-700'>
        <SignIn />
    </div>
  )
}