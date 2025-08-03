import React, { useState } from 'react';
import { 
  Code, 
  Zap, 
  MessageSquare, 
  Edit3, 
  Search, 
  RefreshCw, 
  Terminal,
  FileText,
  GitBranch,
  Lightbulb,
  Keyboard,
  Bot
} from 'lucide-react';

const CursorAgentDemo = () => {
  const [activeShortcut, setActiveShortcut] = useState(null);

  const shortcuts = [
    {
      id: 'chat',
      name: 'AI Chat',
      shortcut: 'Cmd/Ctrl + L',
      description: 'Open AI chat to ask questions about your code',
      icon: <MessageSquare className="w-6 h-6" />,
      usage: 'Ask questions, get explanations, request code reviews',
      example: 'Ask: "Explain this React component" or "How can I optimize this function?"'
    },
    {
      id: 'compose',
      name: 'AI Compose',
      shortcut: 'Cmd/Ctrl + K',
      description: 'Generate code inline with AI assistance',
      icon: <Edit3 className="w-6 h-6" />,
      usage: 'Write comments describing what you want, then use this shortcut',
      example: '// Create a responsive navbar component\n// Then press Cmd/Ctrl + K'
    },
    {
      id: 'edit',
      name: 'AI Edit',
      shortcut: 'Cmd/Ctrl + Shift + K',
      description: 'Edit selected code with AI',
      icon: <RefreshCw className="w-6 h-6" />,
      usage: 'Select code, use shortcut, describe changes needed',
      example: 'Select a function, then ask: "Add error handling and TypeScript types"'
    },
    {
      id: 'explain',
      name: 'Explain Code',
      shortcut: 'Cmd/Ctrl + Shift + L',
      description: 'Get explanations for selected code',
      icon: <Lightbulb className="w-6 h-6" />,
      usage: 'Select any code block and get instant explanations',
      example: 'Select a complex algorithm and get step-by-step breakdown'
    },
    {
      id: 'terminal',
      name: 'Terminal AI',
      shortcut: 'Cmd/Ctrl + `',
      description: 'AI-powered terminal commands',
      icon: <Terminal className="w-6 h-6" />,
      usage: 'Get help with terminal commands and scripts',
      example: 'Ask: "How do I deploy this to Vercel?" or "Create a Docker container"'
    },
    {
      id: 'search',
      name: 'Semantic Search',
      shortcut: 'Cmd/Ctrl + P',
      description: 'Search codebase semantically',
      icon: <Search className="w-6 h-6" />,
      usage: 'Search by functionality, not just text',
      example: 'Search: "authentication logic" or "database connection"'
    },
    {
      id: 'docs',
      name: 'AI Documentation',
      shortcut: 'Cmd/Ctrl + Shift + D',
      description: 'Generate documentation automatically',
      icon: <FileText className="w-6 h-6" />,
      usage: 'Auto-generate JSDoc, README files, and API docs',
      example: 'Select functions and generate comprehensive documentation'
    },
    {
      id: 'refactor',
      name: 'AI Refactor',
      shortcut: 'Cmd/Ctrl + Shift + R',
      description: 'Intelligent code refactoring',
      icon: <GitBranch className="w-6 h-6" />,
      usage: 'Refactor code for better performance and readability',
      example: 'Convert class components to hooks, optimize performance'
    }
  ];

  const agentFeatures = [
    {
      title: 'Code Generation',
      description: 'Generate complete functions, components, and modules',
      examples: ['React components', 'API endpoints', 'Database schemas', 'Test suites']
    },
    {
      title: 'Code Understanding',
      description: 'Analyze and explain complex codebases',
      examples: ['Function explanations', 'Architecture overview', 'Dependency analysis', 'Code flow']
    },
    {
      title: 'Debugging Assistant',
      description: 'Find and fix bugs with AI assistance',
      examples: ['Error analysis', 'Bug fixes', 'Performance issues', 'Logic errors']
    },
    {
      title: 'Refactoring',
      description: 'Improve code quality and structure',
      examples: ['Code optimization', 'Pattern updates', 'Clean code', 'Type safety']
    }
  ];

  const tips = [
    'Use natural language to describe what you want',
    'Be specific about requirements and constraints',
    'Ask for multiple approaches to compare solutions',
    'Request explanations for generated code',
    'Use follow-up questions to refine results',
    'Combine shortcuts for complex workflows'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-800">Cursor AI Agent</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master Cursor's AI-powered coding shortcuts and features to boost your productivity
          </p>
        </div>

        {/* Keyboard Shortcuts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Keyboard className="w-6 h-6 mr-2 text-blue-600" />
            Essential AI Shortcuts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                  activeShortcut === shortcut.id ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setActiveShortcut(activeShortcut === shortcut.id ? null : shortcut.id)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-blue-600 mr-3">
                      {shortcut.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800">{shortcut.name}</h3>
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-mono">
                      {shortcut.shortcut}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{shortcut.description}</p>
                </div>
                
                {/* Expanded Details */}
                {activeShortcut === shortcut.id && (
                  <div className="border-t bg-gray-50 p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Usage:</h4>
                      <p className="text-gray-600 text-sm">{shortcut.usage}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Example:</h4>
                      <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                        {shortcut.example}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-blue-600" />
            AI Agent Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700 text-sm">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
            Pro Tips for AI Agent Usage
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Example */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Code className="w-6 h-6 mr-2" />
            Example AI Workflow
          </h2>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-2">1. Start with AI Chat (Cmd/Ctrl + L)</div>
              <div className="text-sm opacity-90">"I need to create a user authentication system"</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-2">2. Generate Components (Cmd/Ctrl + K)</div>
              <div className="text-sm opacity-90">Write comment: "// Create a login form component" then use shortcut</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-2">3. Refine with AI Edit (Cmd/Ctrl + Shift + K)</div>
              <div className="text-sm opacity-90">Select generated code and ask: "Add form validation and error handling"</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-2">4. Document (Cmd/Ctrl + Shift + D)</div>
              <div className="text-sm opacity-90">Generate comprehensive documentation for your components</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8">
          <p className="text-gray-600">
            Press any shortcut to start using Cursor's AI agent features!
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
            <span>💡 Tip: Combine multiple shortcuts for complex workflows</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursorAgentDemo;