import Chat from '@/components/Chat/Chat'
import { ROLE } from '@/types/chat'
import React from 'react'

const UserChatPage: React.FC = () => {
  return (
    <div>
      <Chat context={ROLE.USER} />
    </div>
  )
}

export default UserChatPage;
