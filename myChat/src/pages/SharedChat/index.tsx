import {HomeOutlined,MessageOutlined} from '@ant-design/icons'
import {Bubble} from '@ant-design/x'
import{Button,Spin,Result} from 'antd'
import {useEffect,useState} from 'react'
import {useParams,Link} from 'react-router-dom'

import {sessionApi} from '../../apis/session'

import type {MessageProps} from '../../store/useChatStore'
import type{ChatSession} from '../../types/session'
import type{GetProp} from 'antd'

export function SharedChat(){
    const {sharedId} = useParams()
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState<string|null>(null)
    const [conversation,setConversation] = useState<ChatSession|null>(null)
    const [messages,setMessages] = useState<MessageProps[]>([])

    useEffect(()=>{
        const fetchSharedChat=async()=>{
            if(!sharedId){
                setError('Invalid shared link')
                setLoading(false)
                return
        }
        try{
            const {data}=await sessionApi.getSharedChat(sharedId)
            setConversation(data.conversation)

            setMessages(
                data.messages.map((msg)=>({
                    content:[{type:'text',content:msg.content}],
                    role:msg.role,
                }))
            )
        }catch(err){
            console.error(err)
            setError('Failed to load conversation')
        }finally{
            setLoading(false)
        }
    }
    fetchSharedChat()
    },[sharedId])

    if(loading){
        return(
            <Result
            status="404"
            title="404"
            subTitle={error||'Page not found'}
            extra={
                <Link to="/">
                    <Button type="primary" icon={<HomeOutlined/>}>返回首页</Button>
                </Link>
            }
            />
        )
    }

    const rolesAsObject:GetProp< typeof Bubble.List,'roles'>={
        ai:{
            placement:'start',
            avatar:{style:{backgroundColor:'#fde3cf'}},
            style:{
                maxWidth:600,
            }
        },
        user:{
            placement:'end',
            avatar:{style:{backgroundColor:'#87d068'}},
        }
    }

    return(
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold ">{conversation?.title}</h1>
                </div>
                <div className="flex space-x-2">
                    <Link to="/">
                        <Button icon={<HomeOutlined/>}>返回首页</Button>
                    </Link>
                    <Link to="/conversation" >
                    <Button type="primary" icon={<MessageOutlined/>}>开始新对话</Button>
                    </Link>
                </div>
            </div>
            <div className="border-t pt-4">
                <Bubble.List
                className="chat-bubble-list"
                style={{
                    paddingInline:16,
                    width:'100%',
                    overflowY:'auto',
                }}
                roles={rolesAsObject}
                items={messages.map((message,index)=>{
                    const isAI=message.role==='system'
                    return{key:index,roles:isAI? 'ai':'user',content:message.content}
                })}
                />
            </div>
            <div className="mt-6 text-center text-gray-500">
                <p>这是一个分享的会话，你无法在此回复</p>
            </div>
        </div>
    )
}







