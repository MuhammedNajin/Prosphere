import React, { ReactNode } from 'react'
import { Spinner } from './Loader'
import { Button } from '@/components/ui/button'

interface LoaderSubmitButtonProps {
   state: boolean
   children?: ReactNode
}

const LoaderSubmitButton: React.FC<LoaderSubmitButtonProps> = ({
    state,
    children
}) => {
  return (
    <Button className='inline-flex gap-x-2 bg-gr items-center bg-orange-700'>
      {
        state ? (
            <>
            <Spinner color='#f9fafb' size={20}/>
             <span>Saving...</span>
            </>
        ) : <>{children}</>
      }
    </Button>
  )
}

export default LoaderSubmitButton
