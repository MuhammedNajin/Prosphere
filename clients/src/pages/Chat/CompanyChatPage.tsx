import Chat from '@/components/Chat/Chat'
import { ROLE } from '@/types/chat'
import React from 'react'

const CompanyChatPage: React.FC = () => {
  return (
    <div>
      <Chat context={ROLE.COMPANY} />
    </div>
  )
}

export default CompanyChatPage;
