import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk pose estimation sessions
const poseSessions = [
  {
    id: 1,
    patientId: 'patient_001',
    patientName: 'Alex Johnson',
    providerId: 'provider_001',
    providerName: 'Dr. Sarah Wilson',
    sessionType: 'pose-estimation',
    startTime: new Date('2024-01-15T09:00:00Z'),
    endTime: new Date('2024-01-15T09:30:00Z'),
    duration: 30,
    status: 'completed',
    keypoints: [
      { name: 'nose', x: 320, y: 180, confidence: 0.95 },
      { name: 'left_shoulder', x: 280, y: 220, confidence: 0.92 },
      { name: 'right_shoulder', x: 360, y: 220, confidence: 0.91 },
      { name: 'left_elbow', x: 250, y: 280, confidence: 0.88 },
      { name: 'right_elbow', x: 390, y: 280, confidence: 0.89 }
    ],
    analysis: {
      posture_score: 85,
      movement_quality: 'good',
      recommendations: ['Maintain shoulder alignment', 'Focus on core stability']
    },
    createdAt: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: 2,
    patientId: 'patient_002',
    patientName: 'Michael Smith',
    providerId: 'provider_002',
    providerName: 'Dr. Emily Davis',
    sessionType: 'physiotherapy',
    startTime: new Date('2024-01-15T10:30:00Z'),
    endTime: new Date('2024-01-15T11:15:00Z'),
    duration: 45,
    status: 'in-progress',
    exercises: [
      {
        name: 'Shoulder Flexion',
        sets: 3,
        reps: 10,
        completed: true,
        form_score: 78
      },
      {
        name: 'Knee Extension',
        sets: 3,
        reps: 15,
        completed: false,
        form_score: null
      }
    ],
    analysis: {
      overall_performance: 82,
      pain_level: 3,
      range_of_motion: 75,
      notes: 'Patient showing improvement in shoulder mobility'
    },
    createdAt: new Date('2024-01-15T10:30:00Z')
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionType = searchParams.get('type')
    const patientId = searchParams.get('patientId')
    const providerId = searchParams.get('providerId')
    const status = searchParams.get('status')
    
    let filteredSessions = [...poseSessions]
    
    // Filter berdasarkan parameter
    if (sessionType) {
      filteredSessions = filteredSessions.filter(session => 
        session.sessionType === sessionType
      )
    }
    
    if (patientId) {
      filteredSessions = filteredSessions.filter(session => 
        session.patientId === patientId
      )
    }
    
    if (providerId) {
      filteredSessions = filteredSessions.filter(session => 
        session.providerId === providerId
      )
    }
    
    if (status) {
      filteredSessions = filteredSessions.filter(session => 
        session.status === status
      )
    }
    
    return NextResponse.json({
      success: true,
      data: filteredSessions,
      total: filteredSessions.length
    })
  } catch (error) {
    console.error('Error fetching pose sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pose sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newSession = {
      id: poseSessions.length + 1,
      ...body,
      createdAt: new Date(),
      status: 'in-progress'
    }
    
    poseSessions.push(newSession)
    
    return NextResponse.json({
      success: true,
      data: newSession,
      message: 'Session created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating pose session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create pose session' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const sessionIndex = poseSessions.findIndex(session => session.id === id)
    
    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }
    
    poseSessions[sessionIndex] = {
      ...poseSessions[sessionIndex],
      ...updateData,
      updatedAt: new Date()
    }
    
    return NextResponse.json({
      success: true,
      data: poseSessions[sessionIndex],
      message: 'Session updated successfully'
    })
  } catch (error) {
    console.error('Error updating pose session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update pose session' },
      { status: 500 }
    )
  }
}