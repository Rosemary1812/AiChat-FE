import { create } from 'zustand'

import { useConversationStore } from './useConversationStore'

import type { MessageContent } from '../types/chat'
import type { Role } from '../types/common'

export type MessageProps = {
  content: MessageContent[] // 兼容旧格式，支持多种内容类型
  role: Role // 消息角色类型
}

export type ChatMessageProps = Map<string, MessageProps[]>


export interface ChatStoreProps {
  messages: ChatMessageProps // 消息存储
  addMessage: ({ content, role }: MessageProps) => void // 添加完整消息
  addChunkMessage: (chunk: string) => void // 添加消息片段
}


export const useChatStore = create<ChatStoreProps>((set) => ({
  // 初始化消息存储为空Map
  messages: new Map(),

  addMessage: ({ content, role }: MessageProps) => {
    // 获取实时的选中会话ID
    const { selectedId } = useConversationStore.getState()
    
    set((state) => ({
      messages: state.messages.set(selectedId as string, [
        // 获取现有消息列表，如果不存在则使用空数组
        ...(state.messages.get(selectedId as string) || []),
        // 在末尾添加新消息
        { content, role }
      ])
    }))
  },


  addChunkMessage: (chunk: string) => {
    // 获取实时的选中会话ID
    const { selectedId } = useConversationStore.getState()
    
    set((state) => {
      // 获取当前会话的消息列表
      const currentMessages = state.messages.get(selectedId as string) || []
      // 获取最后一条消息
      const lastMessage = currentMessages[currentMessages.length - 1]

      if (lastMessage && lastMessage.role === 'system') {
        // 情况1：最后一条消息是AI助手的回复，需要追加内容
        
        // 获取最后一条消息的内容数组
        const lastContent = lastMessage.content
        // 获取最后一个内容项
        const lastTextContent = lastContent[lastContent.length - 1]

        // 如果最后一个内容项是文本类型，则直接追加新内容
        if (lastTextContent && lastTextContent.type === 'text') {
          lastTextContent.content += chunk
        }
      } else {
        // 情况2：最后一条消息不是AI助手的回复，需要创建新消息
        
        // 在消息列表末尾添加新的系统消息
        currentMessages.push({
          content: [
            {
              type: 'text', // 内容类型为文本
              content: chunk // 初始内容为当前片段
            }
          ],
          role: 'system' // 角色为AI助手
        })
      }

      // 更新状态，将修改后的消息列表重新设置到Map中
      return {
        messages: state.messages.set(selectedId as string, currentMessages)
      }
    })
  }
}))