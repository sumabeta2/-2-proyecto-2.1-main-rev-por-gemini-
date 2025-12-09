import React, { useState, useRef, useEffect } from 'react';
import { Send, XCircle, Bot, User, Loader2, LifeBuoy } from 'lucide-react';
// CORRECCIÓN: Usamos la importación correcta del SDK/cliente web
import { GoogleGenAI, Chat } from "@google/genai";

interface SupportScreenProps {
  onBack: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hola, soy el Soporte Técnico de SUMA. ¿En qué puedo ayudarte sobre el uso de la aplicación?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Referencia para auto-scroll

  useEffect(() => {
    const initChat = async () => {
      try {
        // CORRECCIÓN: Usamos VITE_GEMINI_API_KEY que es la forma estándar de obtener la clave en VITE
        // Nos aseguramos de que esta variable exista en el entorno
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
        
        if (!apiKey) {
            console.error("VITE_GEMINI_API_KEY no está definida.");
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `
          Eres el Agente de Soporte Técnico de la aplicación "SUMA".
          TU OBJETIVO: Ayudar al usuario EXCLUSIVAMENTE con dudas sobre cómo usar la app.
          
          FUNCIONES DE LA APP QUE PUEDES EXPLICAR:
          1. Activación: Se entra con un código numérico.
          2. Formulario: Se deben llenar datos del paciente y seleccionar un rol.
          3. Roles: Médico, Enfermero, Paramédico, Primer Respondiente.
          4. Asistencia IA: La app usa inteligencia artificial para dar recomendaciones de triaje médico.
          
          REGLAS:
          - NO des consejos médicos. Si te preguntan por síntomas, diles que inicien la asistencia en la pantalla anterior.
          - Sé amable, breve y técnico.
          - Si te preguntan algo fuera de la app, responde: "Solo puedo brindar soporte técnico sobre la aplicación SUMA."
        `;

        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.3,
          },
        });
        
        chatSessionRef.current = chat;
      } catch (error) {
        console.error("Error iniciando Gemini Support:", error);
      }
    };

    initChat();
  }, []);

  // Efecto para hacer scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (chatSessionRef.current) {
        // Aseguramos que solo pasamos el texto del mensaje al modelo
        const result = await chatSessionRef.current.sendMessage({ message: newUserMessage.text });
        const newBotMessage: Message = {
          id: Date.now() + 1,
          text: result.text,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newBotMessage]);
      }
    } catch (error) {
      console.error("Error al enviar mensaje a la IA de Soporte:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Error de conexión con el soporte. Verifica tu API Key.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col font-sans">
      <header className="bg-blue-900 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-blue-300" />
            <span className="font-bold text-lg tracking-wide">SOPORTE TÉCNICO</span>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-sm font-medium transition-colors border border-blue-700"
          >
            <XCircle className="w-4 h-4" />
            <span>Cerrar</span>
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-3xl mx-auto p-4 flex flex-col space-y-4 overflow-y-auto pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1
                ${msg.sender === 'user' ? 'bg-blue-200 text-blue-800' : 'bg-blue-600 text-white'}`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed
                ${msg.sender === 'user' ? 'bg-blue-800 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-blue-100 rounded-tl-none'}`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {/* Referencia de scroll */}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex justify-start w-full">
             <div className="bg-white border border-blue-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-slate-500">Escribiendo...</span>
             </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 p-4 z-30">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu duda sobre la app..."
            className="flex-grow px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};