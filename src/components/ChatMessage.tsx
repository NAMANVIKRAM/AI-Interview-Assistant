import React from 'react';
import { User, Bot, Volume2 } from 'lucide-react';
import type { Message } from '../App';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const speakMessage = () => {
    if ('speechSynthesis' in window && !message.isUser) {
      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${message.isUser 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
          : 'bg-gradient-to-r from-green-500 to-teal-500'
        }
      `}>
        {message.isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`
        max-w-[70%] rounded-2xl p-4 relative group
        ${message.isUser 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
          : 'bg-gray-50 text-gray-900'
        }
      `}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        
        {!message.isUser && (
          <button
            onClick={speakMessage}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 rounded"
            title="Listen to response"
          >
            <Volume2 className="w-3 h-3 text-gray-600" />
          </button>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};