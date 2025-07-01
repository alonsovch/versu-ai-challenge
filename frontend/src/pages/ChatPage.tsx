import React from 'react';
import { useParams } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Chat - Conversación {conversationId}
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            La página de chat estará disponible pronto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 