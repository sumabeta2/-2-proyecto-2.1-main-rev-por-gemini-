import { useState, useCallback } from 'react';

interface LiveAPIConfig {
  model: string;
  systemInstruction: string;
}

type OnMessageFn = (text: string, sender: 'user' | 'bot') => void;

export const useLiveAPI = (_config: LiveAPIConfig) => {
  const [connected, setConnected] = useState(false);
  const [isVolume, setIsVolume] = useState(false);
  const [onMessage, setOnMessageState] = useState<OnMessageFn | null>(null);

  // Función de conexión (Simulación de WebSocket)
  const connect = useCallback(() => {
    setConnected(true);
    setIsVolume(true);
    // NOTA: El mensaje de bienvenida ya se maneja en AssistanceScreen.tsx.
    // El código del WebSocket real iría aquí.
  }, []);

  // Función de desconexión
  const disconnect = useCallback(() => {
    setConnected(false);
    setIsVolume(false);
  }, []);

  // Función para establecer el callback de recepción de mensajes
  const setOnMessage = useCallback((fn: OnMessageFn) => {
    setOnMessageState(() => fn);
  }, []);

  return { connect, disconnect, connected, isVolume, setOnMessage };
};