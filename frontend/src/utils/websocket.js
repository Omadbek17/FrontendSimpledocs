let socket;

export const connectWebSocket = (docId, onMessage) => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.hostname.includes("localhost")
    ? "localhost:8000"
    : "simpledocsnew.onrender.com";
  const wsUrl = `${protocol}://${host}/ws/documents/${docId}/`;

  console.log("Connecting to websocket:", wsUrl);

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("WebSocket connected!");
  };

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
  } else {
    console.warn("WebSocket is not open, message not sent");
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
