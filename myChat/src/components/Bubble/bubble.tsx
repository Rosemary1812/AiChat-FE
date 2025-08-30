import { UserOutlined } from '@ant-design/icons'
import { Bubble } from '@ant-design/x'
import { useRef } from 'react'

import { useChatStore, useConversationStore } from '../../store'  
import { allMessageContent } from './content'
import './bubble.css'
import 'highlight.js/styles/github.css'
import type { GetRef, GetProp } from 'antd'

export const ChatBubble = () => {
  const listRef = useRef<GetRef<typeof Bubble.List>>(null)
  const { messages } = useChatStore();
  const { selectedId } = useConversationStore();
  

  const rolesAsObject: GetProp<typeof Bubble.List, 'roles'> = {
    system: {
      placement: 'start',
      avatar: {
        icon: <UserOutlined />,
        style: {
          background: '#fde3cf'
        }
      },
      variant: 'borderless',
      style: {
        maxWidth: '100%'
      }
    },
    user: {
      placement: 'end',
      avatar: {
        icon: <UserOutlined />,
        style: {
          background: '#87d068'
        }
      }
    },
    file: {
      placement: 'end',
      variant: 'borderless'
    },
    image: {
      placement: 'end',
      variant: 'borderless'
    }
  }

  const chatMessage = selectedId ? messages.get(selectedId) : []

  const renderMessageContent = (content: MessageContent[]) => {
    if (!content || content.length === 0) return null;

    return content.map((item, index) => {
      return (
        <div key={index}>
          {allMessageContent[item.type as keyof typeof allMessageContent](item as any)}
        </div>
      )
    })
  }

  return (
    <Bubble.List
      ref={listRef}
      className="chat-bubble-list"
      style={{
        paddingInline: 16,
        height: '100%',
        width: '50vw',
        overflowY: 'auto',
        paddingBottom: '25%'
      }}
      roles={rolesAsObject}
      items={chatMessage?.map((message,index)=>({
        key:index,
        role:message.role,
        content:renderMessageContent(message.content)
      }))}
    />
  )
}



