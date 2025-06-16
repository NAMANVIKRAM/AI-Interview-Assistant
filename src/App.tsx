import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Settings, MessageCircle, User, Bot } from 'lucide-react';
import { VoiceRecorder } from './components/VoiceRecorder';
import { ChatMessage } from './components/ChatMessage';
import { SampleQuestions } from './components/SampleQuestions';
import { SettingsPanel } from './components/SettingsPanel';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('groq_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setHasApiKey(true);
    }
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;

    addMessage(transcript, true);
    setIsProcessing(true);

    try {
      const response = await getAIResponse(transcript);
      addMessage(response, false);
      speakText(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addMessage(`Sorry, I encountered an error: ${errorMessage}. Please check your API key and try again.`, false);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAIResponse = async (question: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const systemPrompt = `You are an AI assistant helping someone practice for a job interview. You should respond as if you are the person being interviewed, providing thoughtful, authentic responses to behavioral interview questions. 

Here are some example responses to guide your tone and style:

Life story: "I'm a passionate software developer with 5 years of experience building scalable web applications. I started my journey in computer science during college, where I discovered my love for problem-solving through code. I've worked at both startups and established companies, which has given me a well-rounded perspective on different development approaches and team dynamics."

Superpower: "My superpower is breaking down complex problems into manageable pieces. I have a natural ability to see the big picture while also focusing on the implementation details. This helps me communicate technical concepts to non-technical stakeholders and mentor junior developers effectively."

Areas to grow: "I'd like to improve my public speaking skills, dive deeper into system design and architecture, and develop better project management skills to lead technical initiatives more effectively."

Keep responses concise (2-3 sentences), professional yet personable, and authentic. Tailor your response to the specific question asked.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status text
        }
        
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your Groq API key in settings.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        } else if (response.status >= 500) {
          errorMessage = 'Groq service is temporarily unavailable. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSampleQuestion = (question: string) => {
    addMessage(question, true);
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const response = await getAIResponse(question);
        addMessage(response, false);
        speakText(response);
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        addMessage(`Sorry, I encountered an error: ${errorMessage}. Please check your API key and try again.`, false);
      } finally {
        setIsProcessing(false);
      }
    }, 500);
  };

  const saveApiKey = (key: string) => {
    localStorage.setItem('groq_api_key', key);
    setApiKey(key);
    setHasApiKey(!!key);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Interview Assistant</h1>
              <p className="text-sm text-gray-600">Practice with voice-powered conversations</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!hasApiKey ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Interview Assistant</h2>
            <p className="text-gray-600 mb-6">To get started, please configure your Groq API key to enable AI-powered responses.</p>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Configure API Key
            </button>
          </div>
        ) : (
          <>
            {/* Sample Questions */}
            <SampleQuestions onQuestionSelect={handleSampleQuestion} />

            {/* Chat Messages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Interview Practice</h2>
                <p className="text-sm text-gray-600">Ask questions or use voice input to practice</p>
              </div>
              
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Start a conversation by clicking a sample question or using voice input</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))
                )}
                
                {isProcessing && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Voice Recorder */}
            <VoiceRecorder
              onTranscript={handleVoiceInput}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              disabled={isProcessing}
            />
          </>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onSave={saveApiKey}
          currentApiKey={apiKey}
        />
      )}
    </div>
  );
}

export default App;