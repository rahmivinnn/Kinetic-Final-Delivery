import { NextResponse } from "next/server"

// Store active WebRTC sessions
type Session = {
  id: string
  caller: string
  callee: string
  offerSdp?: string
  answerSdp?: string
  createdAt: number
}

// In-memory store for active sessions (would use a database in production)
const activeSessions = new Map<string, Session>()

export async function POST(request: Request) {
  try {
    const { sender, target, type, sdp, candidate, sessionId } = await request.json()

    // Validate required fields
    if (!sender || !target) {
      return NextResponse.json({ 
        success: false, 
        message: "Sender and target IDs are required" 
      }, { status: 400 })
    }

    // In a real app, this would connect to a WebSocket signaling server
    // For demo purposes, we'll simulate the connection with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (type === "offer") {
      // Use provided sessionId if available, otherwise create a new one
      const callSessionId = sessionId || `call-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      console.log(`Processing offer for session: ${callSessionId}`)
      
      activeSessions.set(callSessionId, {
        id: callSessionId,
        caller: sender,
        callee: target,
        offerSdp: sdp,
        createdAt: Date.now()
      })
      
      // In a real app, this would notify the target user via WebSocket
      return NextResponse.json({
        success: true,
        message: "Offer sent successfully",
        sessionId: callSessionId,
      })
    } 
    else if (type === "answer") {
      // Find the session by sessionId if provided, otherwise by caller/callee
      let session;
      
      if (sessionId && activeSessions.has(sessionId)) {
        session = activeSessions.get(sessionId);
        console.log(`Found session by ID: ${sessionId}`);
      } else {
        session = Array.from(activeSessions.values()).find(
          s => (s.caller === target && s.callee === sender) || (s.caller === sender && s.callee === target)
        );
        console.log(`Found session by caller/callee: ${session?.id}`);
      }
      
      if (!session) {
        return NextResponse.json({ 
          success: false, 
          message: "No active session found",
          sessionId: sessionId
        }, { status: 404 })
      }
      
      // Update the session with the answer SDP
      session.answerSdp = sdp
      activeSessions.set(session.id, session)
      console.log(`Updated session ${session.id} with answer SDP`);
      
      // In a real app, this would forward the answer to the caller via WebSocket
      return NextResponse.json({
        success: true,
        message: "Answer sent successfully",
        sessionId: session.id
      })
    } 
    else if (type === "ice-candidate") {
      // In a real app, this would forward ICE candidates via WebSocket
      console.log(`Processing ICE candidate for session: ${sessionId || 'unknown'}`);
      
      // Verify session exists if sessionId is provided
      if (sessionId && !activeSessions.has(sessionId)) {
        console.log(`Warning: ICE candidate for non-existent session: ${sessionId}`);
      }
      
      return NextResponse.json({
        success: true,
        message: "ICE candidate sent successfully",
        sessionId: sessionId
      })
    } 
    else if (type === "end-call") {
      // Use provided sessionId if available, otherwise find by caller/callee
      let sessionToEnd = sessionId;
      
      if (!sessionToEnd) {
        sessionToEnd = Array.from(activeSessions.values())
          .find(s => (s.caller === sender && s.callee === target) || (s.caller === target && s.callee === sender))?.id;
      }
      
      if (sessionToEnd) {
        console.log(`Ending call session: ${sessionToEnd}`);
        activeSessions.delete(sessionToEnd);
      } else {
        console.log(`No session found to end for sender: ${sender}, target: ${target}`);
      }
      
      return NextResponse.json({
        success: true,
        message: "Call ended successfully",
        sessionId: sessionToEnd
      })
    } 
    else {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid request type" 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in video call API:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}
