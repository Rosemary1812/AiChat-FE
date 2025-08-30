import {request} from '../utils/request'
import type {ChatMessage,ChatSession} from '../types/session'
import type {Data} from '../utils/request'

export const sessionApi={
    createChat:(chatTitle:string):
    Promise<Data<ChatSession>>=>{
        return request<ChatSession>('/chat/session','POST',{chatTitle})
    },
    getUserChats:():Promise<Data<ChatSession[]>>=>{
        return request<ChatSession[]>('/chat/session','GET')
    },
    getChatById:(id:string):Promise<Data<object>>=>{
        return request<ChatSession>(`/chat/${id}`,'GET')
    },
    updateChatTitle:(chatId:string,title:string):Promise<Data<object>>=>{
        return request<object>(`/chat/updateTitle`,'POST',{title,chatId})
    },
    deleteChatById:(id:string):Promise<Data<object>>=>{
        return request<object>(`/chat/deleteChat/${id}`,'GET')
    },
    getChatHistory:(id:string):Promise<Data<ChatMessage[]>>=>{
        return request(`/chat/message/${id}`)
    },
    shareChat:(chatId:string):Promise<Data<{shareId:string}>>=>{
        return Promise.resolve({
            code:1,
            msg:null,
            data:{
                shareId:`share_${chatId}_${Date.now()}`
            }
        })
    },
    getSharedChat:(
        shareId:string
    ):Promise<
    Data<{
        conversation:ChatSession,
        messages:ChatMessage[]
    }>
    > =>{
        const chatId=shareId.split('_')[1]
        return Promise.resolve({
            code:1,
            msg:null,
            data:{
                id:chatId,
                title:'分享的会话',
                isActive:true,
                userId:1,
                createTime:new Date().toISOString(),
                updateTime:new Date().toISOString(),
                messages:[
                    {
                        id:'1',
                        role:'user',
                        content:'分享的会话',
                        chatId:chatId,
                        imgUrl:null,
                        fileContent:null,
                    },
                    {
                        id:'2',
                        role:'system',
                        content:'你好！我是AI助手，很高兴为你服务。这是一个分享的会话示例。',
                        chatId:chatId,
                        createAt:new Date().toISOString(),
                        imgUrl:null,
                        fileContent:null,
                    }
                ]
            }
        })
    },
    searchMessages:(keyword:string):Promise<Data<ChatMessage[]>>=>{
        return request<ChatMessage[]>(`/chat/searchChat`,`GET`,{keyword:keyword})
    }
}
