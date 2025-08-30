
import { MoreOutlined, MessageOutlined, SearchOutlined, RobotOutlined } from '@ant-design/icons'
import { Dropdown, Input } from 'antd'
import { useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {sessionApi} from '../../apis/session'
import{SearchButton} from '../Search/SearchButton'
import { useChatStore } from '../../store'
import { ShareDialog } from './ShareDialog'
import { useConversationActions } from './hooks/useConversationActions'

export function ConversationSidebar() {
  const [shareDialogChatId,setShareDialogChatId]=useState<string|null>(null)
  const handleShare=(id:string)=>{
    setShareDialogChatId(id)
  }
  const navigate = useNavigate()
  const[isSearchOpen,setIsSearchOpen]=useState(false)
  
  // 使用自定义hook获取会话操作相关状态和方法
  const {
    selectedId,           // 当前选中的会话ID
    setSelectedId,        // 设置选中会话ID
    conversations,        // 会话列表
    editingId,           // 正在编辑的会话ID
    editValue,           // 编辑框的值
    setEditValue,        // 设置编辑框的值
    handleAddConversation, // 添加新会话
    handleDelete,        // 删除会话
    startEdit,           // 开始编辑会话标题
    handleEdit,          // 处理编辑提交
    fetchConversations   // 获取会话列表
  } = useConversationActions()

  // 使用聊天store获取消息相关方法
  const { addMessage, messages } = useChatStore()

  // 初始化时获取会话列表
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // 定义右键菜单项：重命名、分享、删除
  const items = (id: string, title: string) => [
    {
      key: 'rename',
      label: '重命名',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (e: any) => {
        e.domEvent.stopPropagation() // 阻止事件冒泡
        startEdit(id, title)
      }
    },
    {
      key: 'share',
      label: '分享',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (e: any) => {
        e.domEvent.stopPropagation()
        handleShare(id)
      }
    },
    {
      key: 'delete',
      label: '删除',
      danger: true, // 标记为危险操作，显示红色
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (e: any) => {
        e.domEvent.stopPropagation()
        handleDelete(id)
        // 如果删除的是当前选中的会话，则跳转到首页
        if (id === selectedId) {
          navigate('/')
        }
      }
    }
  ]

  // 处理会话点击事件
  const handleConversationClick = async (id: string) => {
    // 点击会话时将id添加到url中，实现路由导航
    setSelectedId(id)
    navigate(`/conversation/${id}`)

    // 如果该会话的消息已经存在，则不需要重新获取
    if (messages.get(id) !== undefined) {
      return
    }

    const {data}=await sessionApi.getChatHistory(id)
    data.forEach((message)=>{
      if(message.imgUrl){
        message.imgUrl.forEach((url)=>{
          addMessage({
            content:[
              {
                type:'image',
                content:url
              }
            ],
            role:'image'
          })
        })
      }
      if(message.fileContent){
        message.fileContent.forEach((file)=>{
          if(isImageByExtension(file.fileName)){
            addMessage({
              content:[
                {
                  type:'image',
                  content:file.fileName
                }
              ],
              role:'image'
            })
          }else{
            addMessage({
              content:[
                {
                  type:'file',
                  content:{
                    uid:file.fileId,
                    name:file.fileName,
                  }
                }
              ],
              role:'file'
            })
          }
        })
      }
      addMessage({
        content:[
          {
            type:'text',
            content:message.content
          }
        ],
        role:message.role
      })
    })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-4">
      {/* 顶部操作按钮区域 */}
      <div className="flex-shrink-0 mb-4 flex flex-col gap-2">
        {/* 新建对话按钮 */}
        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full"
          onClick={() => handleAddConversation()}>
          <MessageOutlined />
          <span>新对话</span>
        </button>
        
        {/* Agent按钮 */}
        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full"
          onClick={() => navigate('/agents')}>
          <RobotOutlined />
          <span>Agent</span>
        </button>
        
        {/* 搜索记录按钮 */}
        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full"
          onClick={()=>setIsSearchOpen(true)}>
          <SearchOutlined />
          <span>搜索记录</span>
        </button>
      
      <SearchButton
        isOpen={isSearchOpen}
        onClose={()=>setIsSearchOpen(false)}
      />
      </div>

      {/* 会话列表区域 */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={`p-2 hover:bg-gray-100 rounded cursor-pointer flex justify-between items-center ${
                selectedId === conv.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleConversationClick(conv.id)}>
              
              {/* 编辑模式：显示输入框 */}
              {editingId === conv.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onPressEnter={() => handleEdit(conv.id)}
                  onBlur={() => handleEdit(conv.id)}
                  autoFocus
                />
              ) : (
                /* 正常模式：显示会话标题 */
                <div className="truncate text-gray-700">{conv.title}</div>
              )}
              
              {/* 右键菜单按钮 */}
              <Dropdown menu={{ items: items(conv.id, conv.title) }} trigger={['click']}>
                <MoreOutlined
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            </li>
          ))}
        </ul>
      </div>
      <ShareDialog
        chatId={shareDialogChatId}
        onClose={()=>setShareDialogChatId(null)}
      />

    </div>
  )
}
