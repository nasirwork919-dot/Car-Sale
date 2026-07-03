import React, { useState, useEffect, useRef } from 'react';
import { User, Loader2, Send, MessageSquare, ArrowLeft, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
  } | null;
}

interface Conversation {
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
  lastMessage: Message;
  unreadCount: number;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
  } | null;
}

interface SovereignClientChatProps {
  initialReceiverId?: string;
  vehicleId?: string;
  onBack?: () => void;
  standalone?: boolean;
}

export default function SovereignClientChat({
  initialReceiverId,
  vehicleId,
  onBack,
  standalone = false
}: SovereignClientChatProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await api.get<Conversation[]>('/messages/conversations');
      setConversations(data);
      
      // If initialReceiverId is provided, try to find or create that conversation
      if (initialReceiverId) {
        const existing = data.find(c => c.otherUser.id === initialReceiverId);
        if (existing) {
          setActiveConversation(existing);
        } else {
          // If not in conversations list, we'll fetch the specific conversation
          fetchMessages(initialReceiverId);
        }
      } else if (data.length > 0 && standalone) {
        setActiveConversation(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    setLoading(true);
    try {
      const res = await api.getPaginated<Message[]>(`/messages/conversation/${otherUserId}`, {
        vehicleId: vehicleId
      });
      setMessages(res.data.reverse());
      
      // If we don't have this in conversations list yet, we might need to construct a placeholder
      if (!activeConversation || activeConversation.otherUser.id !== otherUserId) {
        const conversation = conversations.find(c => c.otherUser.id === otherUserId);
        if (conversation) {
          setActiveConversation(conversation);
        } else if (res.data.length > 0) {
          const lastMsg = res.data[res.data.length - 1];
          setActiveConversation({
            otherUser: lastMsg.senderId === user?.id ? lastMsg.receiver : lastMsg.sender,
            lastMessage: lastMsg,
            unreadCount: 0,
            vehicle: lastMsg.vehicle
          } as any);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.otherUser.id);
    }
  }, [activeConversation?.otherUser.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeConversation && !initialReceiverId) return;

    const receiverId = activeConversation?.otherUser.id || initialReceiverId;
    if (!receiverId) return;

    setSending(true);
    try {
      const newMessage = await api.post<Message>('/messages', {
        receiverId,
        vehicleId,
        content: chatInput.trim()
      });
      setMessages(prev => [...prev, newMessage]);
      setChatInput('');
      fetchConversations(); // Refresh conversations list to update last message
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    `${c.otherUser.firstName} ${c.otherUser.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vehicle?.make.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationList = () => (
    <div className="flex flex-col h-full bg-zinc-50/30">
      <div className="p-4.5 border-b border-zinc-100 bg-white shrink-0">
        <h2 className="text-[13px] font-black uppercase tracking-widest text-zinc-800 mb-4">
          Messages
        </h2>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full h-10 pl-9.5 pr-4 bg-zinc-100 border border-transparent focus:border-zinc-200 rounded-xl outline-none text-xs font-bold transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100/60">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-400">No conversations found.</div>
        ) : (
          filteredConversations.map((c) => (
            <button
              key={c.otherUser.id}
              onClick={() => setActiveConversation(c)}
              className={`w-full flex items-center gap-3.5 p-4 text-left transition-all ${
                activeConversation?.otherUser.id === c.otherUser.id ? 'bg-zinc-100 border-l-4 border-red-600' : 'bg-transparent border-l-4 border-transparent hover:bg-zinc-50'
              }`}
            >
              <div className="relative shrink-0">
                {c.otherUser.avatar ? (
                  <img src={c.otherUser.avatar} className="w-11 h-11 rounded-full object-cover" alt="" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold">
                    {c.otherUser.firstName[0]}{c.otherUser.lastName[0]}
                  </div>
                )}
                {c.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {c.unreadCount}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-[13px] font-extrabold text-zinc-900 truncate">
                    {c.otherUser.firstName} {c.otherUser.lastName}
                  </h4>
                  <span className="text-[9px] text-zinc-400 font-mono">
                    {new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11.5px] text-zinc-500 truncate mt-1">
                  {c.lastMessage.content}
                </p>
                {c.vehicle && (
                  <p className="text-[9px] text-red-600 font-bold uppercase tracking-tighter mt-0.5">
                    Re: {c.vehicle.year} {c.vehicle.make}
                  </p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  const renderChatWindow = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4.5 py-3.5 border-b border-zinc-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          {standalone && (
            <button onClick={() => setActiveConversation(null)} className="md:hidden p-2 -ml-2 hover:bg-zinc-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative shrink-0">
            {activeConversation?.otherUser.avatar ? (
              <img src={activeConversation.otherUser.avatar} className="w-9 h-9 rounded-full object-cover" alt="" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-xs">
                {activeConversation?.otherUser.firstName[0]}{activeConversation?.otherUser.lastName[0]}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-900 leading-tight">
              {activeConversation?.otherUser.firstName} {activeConversation?.otherUser.lastName}
            </h3>
            {activeConversation?.vehicle && (
              <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                {activeConversation.vehicle.year} {activeConversation.vehicle.make} {activeConversation.vehicle.model}
              </p>
            )}
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-full border border-zinc-150 flex items-center justify-center text-zinc-500 hover:bg-zinc-50">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/15">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-[12px] font-medium shadow-xs ${
                  isMe ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[8px] block mt-1 ${isMe ? 'text-white/70' : 'text-zinc-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 flex gap-2 items-center">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 h-10 px-4 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white transition-all text-xs font-semibold"
        />
        <button
          type="submit"
          disabled={sending || !chatInput.trim()}
          className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );

  if (standalone) {
    return (
      <div className="w-full h-[600px] border border-zinc-200 rounded-3xl overflow-hidden shadow-xl flex bg-white">
        <div className={`w-full md:w-[320px] shrink-0 border-r border-zinc-100 ${activeConversation ? 'hidden md:block' : 'block'}`}>
          {renderConversationList()}
        </div>
        <div className={`flex-1 ${!activeConversation ? 'hidden md:flex items-center justify-center bg-zinc-50/30' : 'block'}`}>
          {activeConversation ? renderChatWindow() : (
            <div className="text-center space-y-2">
              <MessageSquare className="w-12 h-12 text-zinc-200 mx-auto" />
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Select a desk to start chatting</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return activeConversation || initialReceiverId ? renderChatWindow() : renderConversationList();
}

