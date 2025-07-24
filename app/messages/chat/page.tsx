"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, Home, Activity, Users, MessageSquare, BarChart2, FileText, Settings, LogOut, Send, Paperclip, Phone, Video, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: { name: string; url: string; type: string }[]
}

interface Contact {
  id: string
  name: string
  role: string
  avatar: string
  lastMessage?: {
    content: string
    timestamp: Date
    unread: boolean
  }
  online: boolean
}

export default function ChatPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeContact, setActiveContact] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Dr. Sarah Miller",
      role: "Physical Therapist",
      avatar: "/avatars/sarah-miller.jpg",
      lastMessage: {
        content: "How is your progress with the exercises I recommended?",
        timestamp: new Date(2023, 4, 18, 14, 35),
        unread: true
      },
      online: true
    },
    {
      id: "2",
      name: "Dr. James Wilson",
      role: "Rehabilitation Specialist",
      avatar: "/avatars/james-wilson.jpg",
      lastMessage: {
        content: "Your last assessment showed great improvement!",
        timestamp: new Date(2023, 4, 17, 10, 15),
        unread: false
      },
      online: false
    },
    {
      id: "3",
      name: "Dr. Emily Chen",
      role: "Orthopedic Specialist",
      avatar: "/avatars/emily-chen.jpg",
      lastMessage: {
        content: "Let me know if you have any questions about your treatment plan.",
        timestamp: new Date(2023, 4, 15, 16, 22),
        unread: false
      },
      online: true
    },
    {
      id: "4",
      name: "Kinetic Support Team",
      role: "Customer Support",
      avatar: "/avatars/support-team.jpg",
      lastMessage: {
        content: "Thank you for reaching out. How can we assist you today?",
        timestamp: new Date(2023, 4, 14, 9, 45),
        unread: false
      },
      online: true
    }
  ])
  
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "m1",
        senderId: "1",
        receiverId: "user",
        content: "Good morning! How are you feeling today?",
        timestamp: new Date(2023, 4, 18, 9, 30),
        read: true
      },
      {
        id: "m2",
        senderId: "user",
        receiverId: "1",
        content: "I'm feeling much better, thanks! The pain in my knee has decreased significantly.",
        timestamp: new Date(2023, 4, 18, 9, 45),
        read: true
      },
      {
        id: "m3",
        senderId: "1",
        receiverId: "user",
        content: "That's great to hear! Have you been doing the exercises I recommended?",
        timestamp: new Date(2023, 4, 18, 10, 0),
        read: true
      },
      {
        id: "m4",
        senderId: "user",
        receiverId: "1",
        content: "Yes, I've been doing them daily. The stretching exercises are really helping.",
        timestamp: new Date(2023, 4, 18, 10, 15),
        read: true
      },
      {
        id: "m5",
        senderId: "1",
        receiverId: "user",
        content: "How is your progress with the exercises I recommended?",
        timestamp: new Date(2023, 4, 18, 14, 35),
        read: false
      }
    ],
    "2": [
      {
        id: "m6",
        senderId: "2",
        receiverId: "user",
        content: "Hello! I've reviewed your latest assessment results.",
        timestamp: new Date(2023, 4, 17, 9, 0),
        read: true
      },
      {
        id: "m7",
        senderId: "user",
        receiverId: "2",
        content: "Great! What did you find?",
        timestamp: new Date(2023, 4, 17, 9, 30),
        read: true
      },
      {
        id: "m8",
        senderId: "2",
        receiverId: "user",
        content: "Your last assessment showed great improvement!",
        timestamp: new Date(2023, 4, 17, 10, 15),
        read: true
      }
    ],
    "3": [
      {
        id: "m9",
        senderId: "3",
        receiverId: "user",
        content: "I've updated your treatment plan based on your progress.",
        timestamp: new Date(2023, 4, 15, 15, 0),
        read: true
      },
      {
        id: "m10",
        senderId: "user",
        receiverId: "3",
        content: "Thank you! What changes have you made?",
        timestamp: new Date(2023, 4, 15, 15, 45),
        read: true
      },
      {
        id: "m11",
        senderId: "3",
        receiverId: "user",
        content: "Let me know if you have any questions about your treatment plan.",
        timestamp: new Date(2023, 4, 15, 16, 22),
        read: true
      }
    ],
    "4": [
      {
        id: "m12",
        senderId: "4",
        receiverId: "user",
        content: "Hello! How can the Kinetic Support Team help you today?",
        timestamp: new Date(2023, 4, 14, 9, 0),
        read: true
      },
      {
        id: "m13",
        senderId: "user",
        receiverId: "4",
        content: "I'm having trouble accessing my exercise videos. Can you help?",
        timestamp: new Date(2023, 4, 14, 9, 15),
        read: true
      },
      {
        id: "m14",
        senderId: "4",
        receiverId: "user",
        content: "Thank you for reaching out. How can we assist you today?",
        timestamp: new Date(2023, 4, 14, 9, 45),
        read: true
      }
    ]
  })

  useEffect(() => {
    // Set the first contact as active by default
    if (contacts.length > 0 && !activeContact) {
      setActiveContact(contacts[0].id)
    }
  }, [contacts, activeContact])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeContact])

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeContact) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "user",
      receiverId: activeContact,
      content: messageText,
      timestamp: new Date(),
      read: true
    }

    // Update messages
    setMessages(prev => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), newMessage]
    }))

    // Clear input
    setMessageText("")

    // Simulate response after 1 second
    setTimeout(() => {
      const responseMessage: Message = {
        id: `m${Date.now() + 1}`,
        senderId: activeContact,
        receiverId: "user",
        content: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date(),
        read: false
      }

      setMessages(prev => ({
        ...prev,
        [activeContact]: [...(prev[activeContact] || []), responseMessage]
      }))
    }, 1000)
  }

  const activeContactData = contacts.find(c => c.id === activeContact)

  return (
    <div className="flex h-screen bg-[#f0f4f9]">
      {/* Sidebar */}
      <div className="w-[78px] bg-gradient-to-b from-[#001a41] to-[#003366] flex flex-col items-center py-6">
        <div className="mb-8">
          <div className="w-[60px] h-[60px] flex items-center justify-center">
            <Image 
              src="/kinetic-logo.png" 
              alt="Kinetic Logo" 
              width={60} 
              height={60}
              style={{
                objectFit: "contain",
                objectPosition: "center",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                aspectRatio: "1/1"
              }}
            />
          </div>
        </div>

        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/exercises"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Activity className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Users className="w-5 h-5" />
          </Link>
          <Link
            href="/messages"
            className="w-10 h-10 rounded-xl bg-[#7e58f4] bg-opacity-20 flex items-center justify-center text-white"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
          <Link
            href="/progress"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/video-library"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <FileText className="w-5 h-5" />
          </Link>
        </nav>

        <div className="mt-auto flex flex-col items-center space-y-6">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            href="/settings"
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={logout}
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Contacts List */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/messages" className="flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Link>
              <h1 className="text-xl font-bold text-[#111827]">Messages</h1>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contacts"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-2">
              {filteredContacts.map(contact => (
                <button
                  key={contact.id}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${activeContact === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveContact(contact.id)}
                >
                  <div className="relative">
                    <Image 
                      src={contact.avatar} 
                      alt={contact.name} 
                      width={48} 
                      height={48} 
                      className="rounded-full"
                    />
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      {contact.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {format(contact.lastMessage.timestamp, 'h:mm a')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.role}
                    </p>
                    {contact.lastMessage && (
                      <p className="text-sm truncate">
                        {contact.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {contact.lastMessage?.unread && (
                    <Badge className="ml-2 bg-[#014585]">New</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        {activeContact && activeContactData ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <Image 
                    src={activeContactData.avatar} 
                    alt={activeContactData.name} 
                    width={48} 
                    height={48} 
                    className="rounded-full"
                  />
                  {activeContactData.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3">
                  <h2 className="font-semibold">{activeContactData.name}</h2>
                  <p className="text-sm text-gray-500">
                    {activeContactData.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages[activeContact]?.map((message) => {
                  const isUser = message.senderId === "user"
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="flex-shrink-0 mr-3">
                          <Image 
                            src={activeContactData.avatar} 
                            alt={activeContactData.name} 
                            width={36} 
                            height={36} 
                            className="rounded-full"
                          />
                        </div>
                      )}
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${isUser ? 'bg-[#014585] text-white' : 'bg-white border border-gray-200'}`}
                      >
                        <p>{message.content}</p>
                        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {format(message.timestamp, 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  className="ml-2 bg-[#014585] hover:bg-[#013a70]" 
                  size="icon"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
              <p className="text-gray-500 mt-1">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}