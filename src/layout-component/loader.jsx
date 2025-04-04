import { Spinner } from '@heroui/react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className='h-dvh flex items-center justify-center bg-white dark:bg-black relative z-[99999]'>
      <Spinner
        size='lg'
        classNames={
          {
            circle1 : "!border-b-[#7E41A2]",
            circle2 : "!border-b-[#7E41A2]",
          }
        }
      />
    </div>
  )
}

export default PageLoader
