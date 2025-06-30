let socket;

export const connectWebSocket = (docId, onMessage) => {
  const token = localStorage.getItem("access");
  socket = new WebSocket(`ws://localhost:8000/ws/documents/${docId}/`);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

export const sendWebSocketMessage = (content) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ content }));
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
