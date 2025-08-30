import { useParams } from 'react-router-dom'

export default function ConversationDetail() {
  const { id } = useParams()

  // 如果没有ID，显示对话列表或默认内容
  if (!id) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">对话列表</h1>
        <div className="mt-4">
          <p className="text-gray-600">请选择一个对话或创建新的对话。</p>
          <div className="mt-4 space-y-2">
            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">示例对话 1</h3>
              <p className="text-sm text-gray-500">这是第一个示例对话的预览...</p>
            </div>
            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">示例对话 2</h3>
              <p className="text-sm text-gray-500">这是第二个示例对话的预览...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 有ID时显示具体的对话详情
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">对话详情</h1>
      <p className="text-gray-600">对话ID: {id}</p>
      <div className="mt-4">
        <p>这里是对话内容区域，将显示具体的聊天内容。</p>
      </div>
    </div>
  )
}
