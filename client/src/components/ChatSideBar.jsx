import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import api from '../utils/api'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import MessageModal from './MessageModal'
import useChatSocket from '@/hooks/useChatSocket'

const ChatSideBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const queryClient = useQueryClient()
    useChatSocket()

    const { data: teachers = [], isLoading } = useQuery({
        queryKey: ['chatData'],
        queryFn: async () => {
            const response = await api.get('/message/get-teachers')
            return response.data
        },
        refetchOnWindowFocus: false,
        initialData: () => queryClient.getQueryData(['chatData']) || []
    })

    const totalUnread = useMemo(() => {
        return teachers.reduce((sum, teacher) => sum + Number(teacher.unreadCount || 0), 0)
    }, [teachers])

    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    const selectTeacher = (teacher) => {
        setSelectedTeacher(teacher)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedTeacher(null)
        queryClient.invalidateQueries(['chatData'])
    }

    return (
        <div className="fixed bottom-0 right-0 z-50" >

            <div className="flex flex-col -mb-3">
                {/* Chat List Panel */}
                <div className={`bg-white shadow-lg rounded-t-lg transition-all duration-300 ${
                    isOpen ? 'h-96' : 'h-12'
                }`}>
                    {/* Header */}
                    <div 
                        className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-t-lg"
                        onClick={toggleChat}
                    >
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Chat with Teachers</h3>
                            {totalUnread > 0 && (
                                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                                    {totalUnread}
                                </span>
                            )}
                        </div>
                        {isOpen ? (
                            <ChevronDownIcon className="w-5 h-5" />
                        ) : (
                            <ChevronUpIcon className="w-5 h-5" />
                        )}
                    </div>

                    {/* Teachers List */}
                    {isOpen && (
                        <div className="overflow-y-auto h-full p-4">
                            {isLoading ? (
                                <div className="text-center">Loading...</div>
                            ) : (
                                <ul className="space-y-2">
                                    {teachers.map((teacher) => {
                                        const unread = Number(teacher.unreadCount || 0)
                                        return (
                                        <li 
                                            key={teacher.id}
                                            className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                                                selectedTeacher?.id === teacher.id ? 'bg-blue-50' : ''
                                            }`}
                                            onClick={() => selectTeacher(teacher)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{teacher.name}</p>
                                                    <p className="text-sm text-gray-500">{teacher.role}</p>
                                                </div>
                                                {unread > 0 && (
                                                    <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                                                        {unread}
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {isModalOpen && selectedTeacher && (
                <MessageModal 
                    selectedTeacher={selectedTeacher}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
}

export default ChatSideBar