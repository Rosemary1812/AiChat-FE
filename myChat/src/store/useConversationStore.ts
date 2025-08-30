// 先复制代码进来 看看。。。
import { create } from 'zustand'

import { sessionApi } from '../apis/session'

/**
 * 会话数据结构
 */
type Conversation = {
  id: string        // 会话唯一标识符
  title: string     // 会话标题
}

/**
 * 会话状态管理接口
 * 定义了状态和所有可用的操作方法
 */
interface ConversationState {
  // 状态属性
  selectedId: string | null        // 当前选中的会话ID
  conversations: Conversation[]     // 所有会话列表
  loading: boolean                 // 加载状态标识
  error: string | null             // 错误信息

  // 操作方法
  setSelectedId: (id: string | null) => void                    // 设置选中的会话ID
  // createConversation: (title: string) => Promise<Conversation>  // 创建会话（已注释）
  fetchConversations: () => Promise<void>                       // 获取会话列表
  addConversation: (conversation: Conversation) => void         // 添加新会话
  deleteConversation: (id: string) => Promise<void>             // 删除指定会话
  updateConversation: (id: string, updates: Partial<Conversation>) => Promise<void>  // 更新会话信息
}

/**
 * 使用 Zustand 创建会话状态管理 store
 * 提供了完整的会话 CRUD 操作和状态管理
 */
export const useConversationStore = create<ConversationState>()((set, get) => ({
  // ==================== 初始状态 ====================
  selectedId: null,        // 初始时没有选中的会话
  conversations: [],        // 初始时会话列表为空
  loading: false,          // 初始时不在加载状态
  error: null,             // 初始时没有错误

  // ==================== 操作方法 ====================
  
  /**
   * 设置当前选中的会话ID
   * @param id 要选中的会话ID，null表示不选中任何会话
   */
  setSelectedId: (id) => set({ selectedId: id }),

  /**
   * 从API获取用户的所有会话列表
   * 如果获取失败，会设置默认的示例数据
   */
  fetchConversations: async () => {
    set({ loading: true, error: null })  // 开始加载，清除之前的错误
    try {
      // 调用API获取会话数据
      const { data } = await sessionApi.getUserChats()
      // 将API返回的数据转换为内部格式并更新状态
      set({
        conversations: data.map((session) => ({
          id: session.id,
          title: session.title
        })),
        loading: false  // 加载完成
      })
    } catch (error) {
      console.error(error)
      // API调用失败时，设置默认的示例数据
      set({
        conversations: [
          {
            id: 'default-1',
            title: '示例会话1'
          },
          {
            id: 'default-2',
            title: '示例会话2'
          }
        ],
        loading: false,
        error: '获取会话列表失败'
      })
    }
  },

  /**
   * 添加新会话到列表中
   * @param conversation 要添加的会话对象
   */
  addConversation: (conversation) =>
    set({
      conversations: [...get().conversations, conversation]  // 将新会话添加到现有列表末尾
    }),

  /**
   * 删除指定的会话
   * @param id 要删除的会话ID
   */
  deleteConversation: async (id) => {
    try {
      // 调用API删除会话
      await sessionApi.deleteChatById(id)
      
      // 获取当前状态
      const { selectedId, conversations } = get()
      
      // 如果删除的是当前选中的会话，则清除选中状态
      if (selectedId === id) {
        set({ selectedId: null })
      }
      
      // 从列表中移除被删除的会话
      set({
        conversations: conversations.filter((c) => c.id !== id)
      })
    } catch (error) {
      console.error(error)
      set({ error: '删除会话失败' })
    }
  },

  /**
   * 更新指定会话的信息
   * @param id 要更新的会话ID
   * @param updates 要更新的字段（部分会话对象）
   */
  updateConversation: async (id, updates) => {
    try {
      const { title } = updates

      // 验证标题不能为空
      if (!title) {
        set({ error: '标题不能为空' })
        return
      }

      // 调用API更新会话标题
      await sessionApi.updateChatTitle(id, title)
      
      // 更新本地状态中的会话信息
      set({
        conversations: get().conversations.map((c) => 
          c.id === id ? { ...c, ...updates } : c  // 只更新匹配的会话
        )
      })
    } catch (error) {
      console.error(error)
      set({ error: '更新会话失败' })
    }
  }
}))
