const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3001 })

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast ke semua client lain
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })
})

console.log('WebSocket signaling server running on ws://localhost:3001') 