import { useRef } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../utils/api';

const MessageModal = ({ selectedTeacher, onClose }) => {
    const messagesEndRef = useRef(null);
    const { register, handleSubmit, reset } = useForm();
    const queryClient = useQueryClient();

    // Fetch chat messages
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['messages', selectedTeacher?.id],
        queryFn: async () => {
            if (!selectedTeacher?.id) return [];
            const response = await api.get(`/message/${selectedTeacher.id}`);
            return response.data;
        },
        enabled: !!selectedTeacher?.id,
        refetchInterval: 5000,
    });

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: async (data) => {
            return await api.post('/message', {
                text: data.message,
                id: selectedTeacher.id
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['messages', selectedTeacher?.id]);
        }
    });

    const onSubmit = (data) => {
        sendMessageMutation.mutate(data);
        reset();
    };

    if (!selectedTeacher) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            {selectedTeacher.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold">{selectedTeacher.name}</h3>
                            <p className="text-sm text-gray-500">{selectedTeacher.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        msg.senderId === selectedTeacher.id
                                            ? 'justify-start'
                                            : 'justify-end'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${
                                            msg.senderId === selectedTeacher.id
                                                ? 'bg-gray-100'
                                                : 'bg-blue-500 text-white'
                                        }`}
                                    >
                                        <p>{msg.text}</p>
                                        <p className="text-xs mt-1 opacity-70">
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Message Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="border-t p-4">
                    <div className="flex space-x-2">
                        <input
                            {...register('message', { required: true })}
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={sendMessageMutation.isLoading}
                            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MessageModal;