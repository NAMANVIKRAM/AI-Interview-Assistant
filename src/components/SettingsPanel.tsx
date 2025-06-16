import React, { useState } from 'react';
import { X, Key, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, onSave, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    onSave(apiKey);
  };

  const handleClear = () => {
    setApiKey('');
    onSave('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Get Your Groq API Key</h3>
            <p className="text-sm text-blue-800 mb-3">
              You'll need a Groq API key to enable AI-powered responses. It's free to get started!
            </p>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
            >
              Get API Key from Groq Console
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Groq API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Groq API key..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Your API key is stored locally in your browser and never shared.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-1">Security Note</h4>
            <p className="text-sm text-yellow-800">
              Your API key is stored locally in your browser's localStorage. Make sure you're using this on a trusted device.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Configuration
          </button>
          {currentApiKey && (
            <button
              onClick={handleClear}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};