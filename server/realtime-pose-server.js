const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients with their IDs and roles
const clients = new Map();

// Store active sessions with pose data
const activeSessions = new Map();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');
  let userId = null;
  let userRole = null;
  let sessionId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // Handle registration message
      if (data.type === 'register') {
        userId = data.userId;
        userRole = data.role || 'client'; // Default to client if role not specified
        sessionId = data.sessionId;
        
        clients.set(userId, { 
          ws, 
          role: userRole, 
          sessionId 
        });
        
        console.log(`Client registered with ID: ${userId}, Role: ${userRole}, Session: ${sessionId}`);
        
        // Initialize session if it doesn't exist
        if (sessionId && !activeSessions.has(sessionId)) {
          activeSessions.set(sessionId, {
            id: sessionId,
            provider: userRole === 'provider' ? userId : null,
            client: userRole === 'client' ? userId : null,
            poseData: null,
            startTime: Date.now(),
            status: 'active'
          });
          console.log(`New session created: ${sessionId}`);
        } else if (sessionId) {
          // Update existing session with this user
          const session = activeSessions.get(sessionId);
          if (userRole === 'provider') {
            session.provider = userId;
          } else if (userRole === 'client') {
            session.client = userId;
          }
          activeSessions.set(sessionId, session);
          console.log(`Updated session ${sessionId} with ${userRole}: ${userId}`);
        }
        
        ws.send(JSON.stringify({ 
          type: 'registered', 
          success: true,
          userId,
          role: userRole,
          sessionId
        }));
        return;
      }
      
      // Handle WebRTC signaling messages
      if (data.target && (data.type === 'offer' || data.type === 'answer' || data.type === 'ice-candidate')) {
        const targetClient = clients.get(data.target);
        if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
          console.log(`Forwarding ${data.type} from ${data.sender} to ${data.target} (Session: ${data.sessionId})`);
          targetClient.ws.send(message.toString());
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            message: `Target user ${data.target} not found or not connected`,
            sessionId: data.sessionId
          }));
        }
        return;
      }
      
      // Handle pose data updates
      if (data.type === 'pose-data' && sessionId) {
        console.log(`Received pose data for session: ${sessionId}`);
        
        // Update session with pose data
        if (activeSessions.has(sessionId)) {
          const session = activeSessions.get(sessionId);
          session.poseData = data.poseData;
          session.lastUpdate = Date.now();
          activeSessions.set(sessionId, session);
          
          // Forward pose data to the other participant in the session
          const targetId = userRole === 'provider' ? session.client : session.provider;
          if (targetId) {
            const targetClient = clients.get(targetId);
            if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
              targetClient.ws.send(JSON.stringify({
                type: 'pose-data',
                sessionId,
                poseData: data.poseData,
                sender: userId,
                timestamp: Date.now()
              }));
            }
          }
        }
        return;
      }
      
      // Handle analytics data
      if (data.type === 'analytics' && sessionId) {
        console.log(`Received analytics data for session: ${sessionId}`);
        
        // Forward analytics to the appropriate recipient (usually provider)
        if (activeSessions.has(sessionId)) {
          const session = activeSessions.get(sessionId);
          const targetId = session.provider; // Analytics typically go to the provider
          
          if (targetId) {
            const targetClient = clients.get(targetId);
            if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
              targetClient.ws.send(JSON.stringify({
                type: 'analytics',
                sessionId,
                analyticsData: data.analyticsData,
                sender: userId,
                timestamp: Date.now()
              }));
            }
          }
        }
        return;
      }
      
      // Handle session control messages (start, pause, end)
      if (data.type === 'session-control' && sessionId) {
        console.log(`Session control: ${data.action} for session: ${sessionId}`);
        
        if (activeSessions.has(sessionId)) {
          const session = activeSessions.get(sessionId);
          
          // Update session status based on action
          if (data.action === 'end') {
            session.status = 'ended';
            session.endTime = Date.now();
          } else if (data.action === 'pause') {
            session.status = 'paused';
          } else if (data.action === 'resume') {
            session.status = 'active';
          }
          
          activeSessions.set(sessionId, session);
          
          // Forward control message to the other participant
          const targetId = userRole === 'provider' ? session.client : session.provider;
          if (targetId) {
            const targetClient = clients.get(targetId);
            if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
              targetClient.ws.send(JSON.stringify({
                type: 'session-control',
                sessionId,
                action: data.action,
                sender: userId,
                timestamp: Date.now()
              }));
            }
          }
          
          // If ending the session, notify both participants
          if (data.action === 'end') {
            const sessionSummary = {
              id: session.id,
              startTime: session.startTime,
              endTime: session.endTime,
              duration: session.endTime - session.startTime,
              provider: session.provider,
              client: session.client
            };
            
            // Notify sender of successful session end
            ws.send(JSON.stringify({
              type: 'session-ended',
              sessionId,
              summary: sessionSummary
            }));
            
            // Notify other participant if connected
            if (targetId) {
              const targetClient = clients.get(targetId);
              if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
                targetClient.ws.send(JSON.stringify({
                  type: 'session-ended',
                  sessionId,
                  summary: sessionSummary
                }));
              }
            }
          }
        }
        return;
      }
      
      // Handle chat messages between provider and client
      if (data.type === 'chat' && sessionId) {
        console.log(`Chat message in session: ${sessionId}`);
        
        if (activeSessions.has(sessionId)) {
          const session = activeSessions.get(sessionId);
          const targetId = userRole === 'provider' ? session.client : session.provider;
          
          if (targetId) {
            const targetClient = clients.get(targetId);
            if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
              targetClient.ws.send(JSON.stringify({
                type: 'chat',
                sessionId,
                message: data.message,
                sender: userId,
                senderRole: userRole,
                timestamp: Date.now()
              }));
            }
          }
        }
        return;
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (userId) {
      console.log(`Client disconnected: ${userId}, Role: ${userRole}`);
      clients.delete(userId);
      
      // Update session if this user was part of one
      if (sessionId && activeSessions.has(sessionId)) {
        const session = activeSessions.get(sessionId);
        
        // Notify the other participant about disconnection
        const targetId = userRole === 'provider' ? session.client : session.provider;
        if (targetId) {
          const targetClient = clients.get(targetId);
          if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
            targetClient.ws.send(JSON.stringify({
              type: 'user-disconnected',
              sessionId,
              userId,
              role: userRole
            }));
          }
        }
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Realtime Pose Estimation Server running on port ${PORT}`);
});