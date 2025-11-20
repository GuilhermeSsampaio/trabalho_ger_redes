import { useEffect, useRef, useState } from "react";
import { getWebSocketUrl } from "../config/constants.js";

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connectWs = () => {
      try {
        const wsUrl = getWebSocketUrl();
        console.log("Conectando WebSocket em:", wsUrl); // Debug IPv6

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log("WebSocket conectado via", wsUrl);
          setIsConnected(true);
          // Limpar timeout de reconexão se existir
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log("Mensagem WebSocket recebida:", message);

            setLastMessage(message);
            setMessages((prev) => [...prev.slice(-9), message]); // Manter últimas 10 mensagens

            // Tratar diferentes tipos de mensagem
            switch (message.type) {
              case "download_complete":
                console.log(`Download concluído: ${message.file_path}`);
                break;
              case "download_progress":
                console.log(`Progresso: ${message.message}`);
                break;
              case "file_cleaned":
                console.log(`Arquivo removido: ${message.file_path}`);
                break;
              case "echo":
                console.log(`Echo: ${message.message}`);
                break;
              default:
                console.log("Tipo de mensagem desconhecido:", message.type);
            }
          } catch (error) {
            console.error("Erro ao processar mensagem WebSocket:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket desconectado:", event.code, event.reason);
          setIsConnected(false);
          wsRef.current = null;

          // Tentar reconectar após 3 segundos
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log("Tentando reconectar WebSocket...");
              connectWs();
            }, 3000);
          }
        };

        ws.onerror = (error) => {
          console.error("Erro no WebSocket:", error);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error("Erro ao conectar WebSocket:", error);
        // Tentar reconectar após 5 segundos em caso de erro
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWs();
          }, 5000);
        }
      }
    };

    connectWs();

    // Cleanup na desmontagem
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, []);

  const connect = () => {
    // Esta função agora apenas reconecta manualmente
    if (wsRef.current) {
      wsRef.current.close();
    }

    // O useEffect irá automaticamente tentar reconectar
  };

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        typeof message === "string" ? message : JSON.stringify(message)
      );
    } else {
      console.warn("WebSocket não está conectado");
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  return {
    isConnected,
    messages,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
};

export default useWebSocket;
