const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

// Store connected clients with their IDs
const clients = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');
  let userId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // Handle registration message
      if (data.type === 'register') {
        userId = data.userId;
        clients.set(userId, ws);
        console.log(`Client registered with ID: ${userId}`);
        ws.send(JSON.stringify({ type: 'registered', success: true }));
        return;
      }
      
      // Handle WebRTC signaling messages
if (data.target && (data.type === 'offer' || data.type === 'answer' || data.type === 'ice-candidate' || data.type === 'end-call')) {
  const targetWs = clients.get(data.target);
  if (targetWs && targetWs.readyState === WebSocket.OPEN) {
    // Log session ID if available
    const sessionInfo = data.sessionId ? ` (Session: ${data.sessionId})` : '';
    console.log(`Forwarding ${data.type} from ${data.sender} to ${data.target}${sessionInfo}`);
    targetWs.send(message.toString());
  } else {
    ws.send(JSON.stringify({
      type: 'error',
      message: `Target user ${data.target} not found or not connected`,
      sessionId: data.sessionId // Include session ID in error response
    }));
  }
  return;
}
      
      // Broadcast message to all clients (for group calls or chat)
      if (data.type === 'broadcast') {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
        return;
      }
      
      // Default behavior: broadcast to all (backward compatibility)
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (userId) {
      console.log(`Client disconnected: ${userId}`);
      clients.delete(userId);
      
      // Notify other clients about disconnection
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'user-disconnected',
            userId: userId
          }));
        }
      });
    }
  });
});

console.log('WebSocket signaling server running on ws://localhost:3001');