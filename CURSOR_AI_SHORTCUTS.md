# Cursor AI Agent Shortcuts & Features Guide

This guide covers all the essential AI agent shortcuts and features available in Cursor IDE.

## 🚀 Essential Keyboard Shortcuts

### Core AI Features

| Shortcut | Feature | Description | Usage |
|----------|---------|-------------|-------|
| `Cmd/Ctrl + L` | **AI Chat** | Open AI chat panel | Ask questions, get explanations, request code reviews |
| `Cmd/Ctrl + K` | **AI Compose** | Generate code inline | Write comments describing what you want, then use shortcut |
| `Cmd/Ctrl + Shift + K` | **AI Edit** | Edit selected code with AI | Select code, use shortcut, describe changes needed |
| `Cmd/Ctrl + Shift + L` | **Explain Code** | Get explanations for selected code | Select any code block for instant explanations |
| `Cmd/Ctrl + I` | **Inline Edit** | Quick inline code generation | Generate code directly in your current line |

### Advanced Features

| Shortcut | Feature | Description | Usage |
|----------|---------|-------------|-------|
| `Cmd/Ctrl + Shift + D` | **AI Documentation** | Generate documentation | Auto-generate JSDoc, README files, and API docs |
| `Cmd/Ctrl + Shift + R` | **AI Refactor** | Intelligent code refactoring | Refactor for better performance and readability |
| `Cmd/Ctrl + P` | **Semantic Search** | Search codebase semantically | Search by functionality, not just text |
| `Cmd/Ctrl + `` ` | **Terminal AI** | AI-powered terminal | Get help with terminal commands and scripts |

## 🤖 AI Agent Capabilities

### 1. Code Generation
- **React Components**: Create complete functional or class components
- **API Endpoints**: Generate Express.js routes and handlers
- **Database Schemas**: Create MongoDB/SQL schemas and models
- **Test Suites**: Generate Jest/Vitest test cases
- **Configuration Files**: Create config files for various tools

### 2. Code Understanding
- **Function Explanations**: Detailed breakdown of complex functions
- **Architecture Overview**: High-level system architecture analysis
- **Dependency Analysis**: Understanding imports and module relationships
- **Code Flow**: Step-by-step execution flow explanations

### 3. Debugging Assistant
- **Error Analysis**: Identify and explain error causes
- **Bug Fixes**: Suggest and implement fixes
- **Performance Issues**: Identify bottlenecks and optimizations
- **Logic Errors**: Find and correct logical mistakes

### 4. Refactoring & Optimization
- **Code Optimization**: Improve performance and efficiency
- **Pattern Updates**: Modernize code patterns and practices
- **Clean Code**: Apply clean code principles
- **Type Safety**: Add TypeScript types and improve type safety

## 💡 Pro Tips for AI Agent Usage

### Best Practices

1. **Be Specific**: Use clear, detailed descriptions of what you want
   ```
   ❌ "Create a form"
   ✅ "Create a React login form with email/password fields, validation, and error handling"
   ```

2. **Provide Context**: Include relevant information about your project
   ```
   ❌ "Add authentication"
   ✅ "Add JWT authentication to this Express.js API with MongoDB user storage"
   ```

3. **Iterative Refinement**: Use follow-up questions to improve results
   ```
   1. Generate initial code
   2. Ask for improvements: "Add error handling"
   3. Refine further: "Make this more performant"
   ```

4. **Combine Shortcuts**: Use multiple AI features together
   ```
   1. Cmd/Ctrl + L - Plan the feature
   2. Cmd/Ctrl + K - Generate initial code
   3. Cmd/Ctrl + Shift + K - Refine and improve
   4. Cmd/Ctrl + Shift + D - Generate documentation
   ```

### Effective Prompting

#### For Code Generation (`Cmd/Ctrl + K`):
```javascript
// Create a responsive navbar component with:
// - Logo on the left
// - Navigation links in the center
// - User profile dropdown on the right
// - Mobile hamburger menu
// - Dark mode toggle
```

#### For Code Editing (`Cmd/Ctrl + Shift + K`):
- Select the code first
- Ask specific questions: "Add error handling and loading states"
- Request specific improvements: "Convert to TypeScript with proper types"

#### For Code Explanation (`Cmd/Ctrl + Shift + L`):
- Select complex algorithms, functions, or code blocks
- Get step-by-step explanations
- Understand performance implications

## 🔧 Workflow Examples

### Example 1: Building a New Feature
```
1. 💬 Chat (Cmd/Ctrl + L): "I need to build a user authentication system"
2. 📝 Compose (Cmd/Ctrl + K): Generate login component
3. ✏️ Edit (Cmd/Ctrl + Shift + K): Add form validation
4. 🔄 Refactor (Cmd/Ctrl + Shift + R): Optimize for performance
5. 📚 Document (Cmd/Ctrl + Shift + D): Generate API documentation
```

### Example 2: Debugging and Optimization
```
1. 🔍 Select problematic code
2. 💡 Explain (Cmd/Ctrl + Shift + L): Understand the issue
3. 💬 Chat (Cmd/Ctrl + L): "Why is this function slow?"
4. ✏️ Edit (Cmd/Ctrl + Shift + K): "Optimize this for better performance"
5. 🧪 Generate tests to verify the fix
```

### Example 3: Learning New Technologies
```
1. 💬 Chat (Cmd/Ctrl + L): "How do I use React Query for API calls?"
2. 📝 Compose (Cmd/Ctrl + K): Generate example implementation
3. 💡 Explain (Cmd/Ctrl + Shift + L): Understand the generated code
4. ✏️ Edit (Cmd/Ctrl + Shift + K): Adapt to your specific use case
```

## 🎯 Context-Aware Features

### File Context
Cursor AI automatically understands:
- Current file type and framework
- Existing imports and dependencies
- Project structure and patterns
- Coding style and conventions

### Project Context
- Package.json dependencies
- Configuration files
- Existing code patterns
- Architecture decisions

## ⚡ Advanced Usage

### Multi-file Operations
```
1. Use Cmd/Ctrl + P for semantic search across files
2. Ask in chat: "Update all API endpoints to use async/await"
3. Generate documentation for entire modules
```

### Terminal Integration
```bash
# Use Cmd/Ctrl + ` then ask:
"How do I deploy this React app to Vercel?"
"Create a Docker container for this Node.js app"
"Set up CI/CD pipeline for this project"
```

### Code Review Assistant
```
1. Select code sections
2. Ask: "Review this code for security issues"
3. Request: "Suggest improvements for readability"
4. Check: "Are there any performance bottlenecks?"
```

## 🔍 Troubleshooting

### If AI responses are not helpful:
1. **Be more specific** with your requests
2. **Provide more context** about your project
3. **Break down complex requests** into smaller parts
4. **Use follow-up questions** to refine results

### If shortcuts don't work:
1. Check if Cursor is updated to the latest version
2. Verify shortcuts in Preferences > Keyboard Shortcuts
3. Try alternative shortcuts (some may vary by OS)

## 🌟 Hidden Features

### Experimental Features
- **Batch Operations**: Select multiple files for simultaneous edits
- **Smart Suggestions**: Context-aware code completions
- **Auto-fix**: Automatic error resolution suggestions
- **Pattern Recognition**: Learn from your coding patterns

### Power User Tips
- Use natural language in comments for better AI understanding
- Combine multiple AI operations in sequence
- Leverage project-wide context for better suggestions
- Use AI for code reviews and security audits

---

## 🚀 Getting Started

1. **Install Cursor**: Download from [cursor.sh](https://cursor.sh)
2. **Try Basic Shortcuts**: Start with `Cmd/Ctrl + L` for chat
3. **Practice with Examples**: Use the workflow examples above
4. **Experiment**: Try different prompting styles and combinations

Remember: The AI agent learns from your project context and improves suggestions over time!

---

*Last updated: January 2025*