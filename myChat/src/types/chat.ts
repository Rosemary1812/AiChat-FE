export type mergeChunkType = {
  fileId: string
  fileName: string
  totalChunks: number
}


export type chunkItemType = {
  file: Blob
}


export type checkRespType = {
  fileStatus: 0 | 1 | 2
  isCompleted: boolean
  uploaded?: number[]
  uploadedChunks?: number
  filePath?: string
  fileName?: string
}


export type mergeResType = {
  filePath: string
  fileName: string
}

export type SendMessageType = {
  id: string
  message: string
  // imgUrl?: string[] // 图片URL数组（已注释，使用新的内容类型系统）
  fileId?: string
}


export interface ImageContent {
  type: 'image'
  content: string
}


export interface TextContent {
  type: 'text'
  content: string
}

export interface FileContent {
  type: 'file'
  content: {
    uid: string
    name: string
    size?: number
  }
}


export type MessageContent = ImageContent | TextContent | FileContent


export interface Message {
  id: string
  role: 'user' | 'system'
  content: MessageContent[] // 数组，支持混合内容
  timestamp: number
}
