import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface SampleQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

const SAMPLE_QUESTIONS = [
  "What should we know about your life story in a few sentences?",
  "What's your #1 superpower?",
  "What are the top 3 areas you'd like to grow in?",
  "What misconception do your coworkers have about you?",
  "How do you push your boundaries and limits?",
  "Tell me about a time you faced a significant challenge at work.",
  "What motivates you to do your best work?",
  "How do you handle feedback and criticism?"
];

export const SampleQuestions: React.FC<SampleQuestionsProps> = ({ onQuestionSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sample Interview Questions</h2>
          <p className="text-sm text-gray-600">Click any question to start practicing</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SAMPLE_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(question)}
            className="group text-left p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-relaxed">
                {question}
              </p>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};