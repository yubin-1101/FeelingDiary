import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Lightbulb, Heart, Sparkles, X } from 'lucide-react'

export default function EmotionChatbot({ currentEmotion, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '안녕하세요! 저는 당신의 감정 코칭 파트너예요. 오늘 어떤 일이 있으셨는지 이야기해주세요. 🤗',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [followUpQuestions, setFollowUpQuestions] = useState([])
  const messagesEndRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // 대화 컨텍스트 구성 (최근 5개 메시지)
      const conversationContext = messages
        .slice(-5)
        .map(msg => `${msg.type === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
        .join('\n')

      const response = await fetch(`${API_URL}/api/emotion-coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          emotion: currentEmotion,
          conversationContext
        })
      })

      if (!response.ok) {
        throw new Error('코칭 응답을 받아오는데 실패했습니다.')
      }

      const data = await response.json()

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        insight: data.emotionalInsight
      }

      setMessages(prev => [...prev, botMessage])
      setSuggestions(data.suggestions || [])
      setFollowUpQuestions(data.followUpQuestions || [])

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '죄송해요, 응답을 생성하는 중에 문제가 발생했어요. 다시 시도해주세요.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleQuickReply = (question) => {
    sendMessage(question)
    setFollowUpQuestions([])
  }

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden animate-fade-in">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-lavender-500 to-rose-400 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">감정 코칭 파트너</h3>
              <p className="text-white/80 text-sm">
                {currentEmotion ? `현재 감정: ${currentEmotion}` : '당신의 마음을 들어드려요'}
              </p>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-lavender-500 to-rose-400 text-white ml-auto'
                      : 'bg-white shadow-sm border border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && (
                      <Bot className="w-5 h-5 text-lavender-500 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <p className="flex-1">{message.content}</p>
                  </div>
                  
                  {message.insight && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{message.insight}</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* 로딩 애니메이션 */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-lavender-500" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 후속 질문 */}
          {followUpQuestions.length > 0 && !isLoading && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">💭 이런 질문들도 생각해보세요:</p>
              {followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(question)}
                  className="block w-full text-left p-3 bg-white border border-lavender-100 rounded-xl hover:bg-lavender-50 hover:border-lavender-200 transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 제안 영역 */}
        {suggestions.length > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
            <p className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              실천해볼 수 있는 방법들:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(`"${suggestion}"에 대해 더 자세히 이야기해주세요.`)}
                  className="text-xs bg-white text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-50 transition-colors border border-amber-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 입력 영역 */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="마음속 이야기를 자유롭게 나눠주세요..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lavender-100 focus:border-lavender-300 transition-all duration-300 resize-none placeholder:text-gray-400"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="w-12 h-12 bg-gradient-to-r from-lavender-500 to-rose-400 text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}