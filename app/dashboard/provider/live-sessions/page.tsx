"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoseVideoCall } from "@/components/pose-video-call"
import { Calendar, Clock, Users, Video, History, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LiveSessionsPage() {
  const [activeCall, setActiveCall] = useState<{
    id: string;
    name: string;
    image: string;
    minimized: boolean;
  } | null>(null);
  
  const [showPoseOverlay, setShowPoseOverlay] = useState(true);
  const [poseEngine, setPoseEngine] = useState<'openpose' | 'mediapipe'>('mediapipe');

  // Dummy data for scheduled calls
  const scheduledCalls = [
    {
      id: "call_1",
      patientName: "Sarah Johnson",
      patientImage: "/avatars/patient-1.jpg",
      scheduledTime: "10:30 AM",
      duration: "30 min",
      type: "Follow-up",
      status: "Upcoming"
    },
    {
      id: "call_2",
      patientName: "Michael Chen",
      patientImage: "/avatars/patient-2.jpg",
      scheduledTime: "1:15 PM",
      duration: "45 min",
      type: "Initial Assessment",
      status: "Upcoming"
    },
    {
      id: "call_3",
      patientName: "Emma Rodriguez",
      patientImage: "/avatars/patient-3.jpg",
      scheduledTime: "3:00 PM",
      duration: "30 min",
      type: "Exercise Review",
      status: "Upcoming"
    }
  ];

  // Dummy data for session replays
  const sessionReplays = [
    {
      id: "replay_1",
      patientName: "David Wilson",
      patientImage: "/avatars/patient-4.jpg",
      date: "Yesterday",
      duration: "28 min",
      type: "Knee Rehabilitation",
      hasReport: true
    },
    {
      id: "replay_2",
      patientName: "Lisa Thompson",
      patientImage: "/avatars/patient-5.jpg",
      date: "2 days ago",
      duration: "42 min",
      type: "Shoulder Assessment",
      hasReport: true
    },
    {
      id: "replay_3",
      patientName: "James Martinez",
      patientImage: "/avatars/patient-6.jpg",
      date: "1 week ago",
      duration: "35 min",
      type: "Lower Back Therapy",
      hasReport: true
    }
  ];

  const handleStartCall = (patient: any) => {
    setActiveCall({
      id: patient.id,
      name: patient.patientName,
      image: patient.patientImage || "/placeholder-avatar.png",
      minimized: false
    });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleToggleMinimize = () => {
    if (activeCall) {
      setActiveCall({
        ...activeCall,
        minimized: !activeCall.minimized
      });
    }
  };

  const handleTogglePoseOverlay = () => {
    setShowPoseOverlay(!showPoseOverlay);
  };

  const handleChangePoseEngine = (engine: 'openpose' | 'mediapipe') => {
    setPoseEngine(engine);
  };

  const handleStartNewCall = () => {
    // In a real app, this would open a dialog to select a patient
    // For demo, we'll just start a call with a dummy patient
    setActiveCall({
      id: "new_call_" + Date.now(),
      name: "New Patient",
      image: "/placeholder-avatar.png",
      minimized: false
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Live Sessions</h2>
        <Button onClick={handleStartNewCall} className="bg-[#014585] hover:bg-[#013a70]">
          <Plus className="mr-2 h-4 w-4" /> Start New Call
        </Button>
      </div>
      
      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">
            <Calendar className="mr-2 h-4 w-4" />
            Scheduled Calls
          </TabsTrigger>
          <TabsTrigger value="replays">
            <History className="mr-2 h-4 w-4" />
            Session Replays
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scheduledCalls.map((call) => (
              <Card key={call.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image 
                          src={call.patientImage || "/placeholder-avatar.png"}
                          alt={call.patientName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{call.patientName}</CardTitle>
                        <CardDescription>{call.type}</CardDescription>
                      </div>
                    </div>
                    <div className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {call.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{call.scheduledTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">1-on-1</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <Video className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{call.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/provider/patients/${call.id}`}>View Profile</Link>
                  </Button>
                  <Button 
                    onClick={() => handleStartCall(call)}
                    className="bg-[#014585] hover:bg-[#013a70]"
                  >
                    Join Call
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="replays" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessionReplays.map((session) => (
              <Card key={session.id}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image 
                          src={session.patientImage || "/placeholder-avatar.png"}
                          alt={session.patientName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{session.patientName}</CardTitle>
                        <CardDescription>{session.type}</CardDescription>
                      </div>
                    </div>
                    {session.hasReport && (
                      <div className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Report Available
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{session.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{session.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  {session.hasReport ? (
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/provider/reports/${session.id}`}>View Report</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      No Report
                    </Button>
                  )}
                  <Button 
                    variant="secondary"
                    asChild
                  >
                    <Link href={`/dashboard/provider/replays/${session.id}`}>Watch Replay</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {activeCall && (
        <PoseVideoCall
          therapistName={activeCall.name}
          therapistImage={activeCall.image}
          onEndCall={handleEndCall}
          isMinimized={activeCall.minimized}
          onToggleMinimize={handleToggleMinimize}
          sessionId={activeCall.id}
          userRole="provider"
          showPoseOverlay={showPoseOverlay}
          onTogglePoseOverlay={handleTogglePoseOverlay}
          poseEngine={poseEngine}
          onChangePoseEngine={handleChangePoseEngine}
        />
      )}
    </div>
  )
}