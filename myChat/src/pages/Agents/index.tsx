import {RobotOutlined,TagOutlined} from '@ant-design/icons';
import {Card,Row,Col,Tag,Button,Input} from 'antd';
import {useState,useMemo} from 'react';

import {useNavigate} from 'react-router-dom';

import {useConversationStore} from '../../store/useConversationStore';

import type{Agent} from '../../types/agent';
const {Search} = Input;

const mockAgents:Agent[] = [
  {
    id: '1',
    name: '小红书文案助手',
    avatar: '🍠',
    description: '专业的小红书文案创作助手，帮你生成吸引人的种草文案，提升内容传播效果',
    category: '文案创作',
    tags: ['小红书', '种草文案', '内容创作'],
    prompt: '你是一个专业的小红书文案创作助手，请根据用户需求生成吸引人的种草文案。',
    createdAt: '2025-08-26',
    updatedAt:'2025-08-27',
  },
  {
    id: '2',
    name: 'math tutor',
    avatar: '🧮',
    description: '一个专业的数学辅导助手，帮助学生解决数学问题，提供详细的解题过程和答案',
    category: '数学辅导',
    tags: ['数学', '辅导', '解题'],
    prompt: '你是一个专业的数学辅导助手，请根据用户需求提供详细的数学解题过程和答案。',
    createdAt: '2025-08-26',
    updatedAt:'2025-08-27',
  }
]

export default function Agents(){
  const [searchText,setSearchText] = useState('');
  const navigate = useNavigate();
  const {setSelectedId} = useConversationStore();

  const filteredAgents = useMemo(()=>{
    if(!searchText)return mockAgents;
    return mockAgents.filter(
      (agent)=>
        agent.name.toLowerCase().includes(searchText.toLowerCase()) ||agent.description.toLowerCase().includes(searchText.toLowerCase())||agent.tags.some(tag=>tag.toLowerCase().includes(searchText.toLowerCase()))
    )

  },[searchText])

  const handleAgentClick=(agent:Agent)=>{
    setSelectedId(agent.id)
    navigate(`/conversation?agent=${agent.id}`)
  }

  return(
    <div className="p-6 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-3">
            Agent 助手
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            探索和创建AI助手，为你的任务提供智能支持
          </p>
          <Search
          placeholder="搜索Agent"
          allowClear
          size="large"
          value={searchText}
          onChange={(e)=>setSearchText(e.target.value)}
          className="max-w-md shadow-sm"
          />
        </div>
        <Row gutter={[24,24]}>
          {filteredAgents.map((agent)=>(
            <Col  xs={24} sm={12} md={8} lg={6} key={agent.id}>
              <Card
              hoverable
              className="h-full cursor-pointer transition-all duration-1000 hover:shandow-xl hover:-transition-y-1 boder-0 shandow-md bg-white dark:bg-gray-800" onClick={()=>handleAgentClick(agent)}
              cover={
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <span className="text-5xl">{agent.avatar}</span>
                </div>
              }
              actions={[
                <Button
                key="chat"
                type="primary"
                size="middle"
                className="bg-blue-500 hover:bg-blue-600 font-medium"
                onClick={(e)=>{e.stopPropagation()
                  handleAgentClick(agent)
                }}>开始对话</Button>
              ]}>
                <Card.Meta
                title={
                  <div className="flex items-center justify-between mb-2">
                    <span className="truncate text-lg font-semibold text-gray-800 dark:text-white">{agent.name}</span>
                    <TagOutlined className="text-gray-400 text-sm"/>
                  </div>
                }
                description={
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-grat-300 text-sm leading-relaxed overflow-hidden">
                      <span className="line-clamp-2">{agent.description}</span>
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {agent.tags.slice(0,3).map((tag)=>(
                          <Tag
                            key={tag}
                            style={{background:'none'}}
                            className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              {tag}
                          </Tag>
                        ))}
                        {agent.tags.length>3&&(
                          <Tag className="bg-none bg-gray-100 text-gray-600 border-gray-200 darkLbg-gray-700 dark:text-gray-300 darkLborder0gray-600 px-2 py-0.5 rounded-full text-xs">
                            +{agent.tags.length-3}
                          </Tag>
                        )}
                      </div>
                  </div>
                }
                />
              </Card>
            </Col>
          ))}
        </Row>
        {filteredAgents.length===0&&(
          <div className="text-center py-16">
            <RobotOutlined className="text-6xl text-gray-300 dark:text-gray-600 mb-4"/>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              没有找到匹配的Agent
            </p>
          </div>
        )}
      </div>
    </div>
  )
}