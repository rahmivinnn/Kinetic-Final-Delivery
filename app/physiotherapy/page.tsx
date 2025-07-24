"use client"

// Enhanced Physiotherapy Page
// Integrates pose analysis, exercise library, progress tracking, and voice feedback

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Dumbbell, 
  Play, 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Search,
  Filter,
  BarChart3,
  Calendar,
  User,
  Settings
} from 'lucide-react'

import { EXERCISE_LIBRARY, ExerciseDefinition, getExercisesByCategory, getExercisesByDifficulty } from '@/lib/exercise-definitions'
import ExerciseSessionComponent from '@/components/exercise-session'
import SessionAnalysisComponent from '@/components/session-analysis'
import ProgressTracker, { ExerciseSession, UserProgress, ExerciseStats } from '@/lib/progress-tracker'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function PhysiotherapyPage() {
  const router = useRouter()
  
  // State management
  const [activeTab, setActiveTab] = useState('exercises')
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [recentSessions, setRecentSessions] = useState<ExerciseSession[]>([])
  const [exerciseStats, setExerciseStats] = useState<Map<string, ExerciseStats>>(new Map())
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisSession, setAnalysisSession] = useState<ExerciseSession | null>(null)

  // Initialize progress tracker
  const progressTracker = new ProgressTracker()

  // Load user data on component mount
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const progress = await progressTracker.getUserProgress()
      const sessions = await progressTracker.getSessionHistory(10)
      
      setUserProgress(progress)
      setRecentSessions(sessions)
      setExerciseStats(progress.exerciseStats)
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  // Filter exercises based on search and filters
  const filteredExercises = EXERCISE_LIBRARY.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Get unique categories and difficulties for filters
  const categories = Array.from(new Set(EXERCISE_LIBRARY.map(ex => ex.category)))
  const difficulties = ['beginner', 'intermediate', 'advanced']

  // Handle exercise selection
  const handleExerciseSelect = (exercise: ExerciseDefinition) => {
    setSelectedExercise(exercise)
    setIsSessionActive(true)
  }

  // Handle session completion
  const handleSessionComplete = async (session: ExerciseSession) => {
    setIsSessionActive(false)
    setSelectedExercise(null)
    await loadUserData() // Refresh user data
    setActiveTab('progress') // Switch to progress tab
  }

  // Handle session exit
  const handleSessionExit = () => {
    setIsSessionActive(false)
    setSelectedExercise(null)
  }

  // Handle showing analysis
  const handleShowAnalysis = (session: ExerciseSession) => {
    setAnalysisSession(session)
    setShowAnalysis(true)
  }

  // Handle closing analysis
  const handleCloseAnalysis = () => {
    setShowAnalysis(false)
    setAnalysisSession(null)
  }

  // Handle settings navigation
  const handleSettingsClick = () => {
    router.push('/settings')
  }

  // Format time helper
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Render session analysis if active
  if (showAnalysis && analysisSession) {
    return (
      <SessionAnalysisComponent
        session={analysisSession}
        onClose={handleCloseAnalysis}
      />
    )
  }

  // Render exercise session if active
  if (isSessionActive && selectedExercise) {
    return (
      <ExerciseSessionComponent
        exerciseId={selectedExercise.id}
        onComplete={handleSessionComplete}
        onExit={handleSessionExit}
        onShowAnalysis={handleShowAnalysis}
      />
    )
  }

  return (
    <DashboardLayout activeLink="physiotherapy">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Physiotherapy Hub</h1>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  {userProgress?.totalSessions || 0} Sessions Completed
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-[#014585] text-white hover:bg-[#013a70]"
                  onClick={handleSettingsClick}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#014585]">
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Levels</option>
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map(exercise => {
                const stats = exerciseStats.get(exercise.id)
                return (
                  <Card key={exercise.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleExerciseSelect(exercise)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{exercise.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                        </div>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {exercise.targetMuscles.slice(0, 3).map(muscle => (
                            <Badge key={muscle} variant="outline" className="text-xs">
                              {muscle}
                            </Badge>
                          ))}
                          {exercise.targetMuscles.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{exercise.targetMuscles.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {exercise.estimatedDuration}min
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {exercise.phases.length} phases
                          </span>
                        </div>
                        
                        {stats && (
                          <div className="pt-2 border-t">
                            <div className="flex justify-between text-sm">
                              <span>Best Score:</span>
                              <span className="font-medium">{Math.round(stats.bestScore)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Sessions:</span>
                              <span className="font-medium">{stats.totalSessions}</span>
                            </div>
                          </div>
                        )}
                        
                        <Button className="w-full mt-3 bg-[#014585] text-white hover:bg-[#013a70]">
                          <Play className="w-4 h-4 mr-2" />
                          Start Exercise
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredExercises.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold">{userProgress?.totalSessions || 0}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Exercise Time</p>
                      <p className="text-2xl font-bold">{formatTime(userProgress?.totalExerciseTime || 0)}</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold">{Math.round(userProgress?.averageScore || 0)}%</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Streak Days</p>
                      <p className="text-2xl font-bold">{userProgress?.streakDays || 0}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {recentSessions.length > 0 ? (
                  <div className="space-y-4">
                    {recentSessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{session.exerciseName}</h4>
                          <p className="text-sm text-gray-600">
                            {session.startTime.toLocaleDateString()} • {formatTime(session.duration)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{Math.round(session.averageScore)}%</div>
                          <div className="text-sm text-gray-600">{session.repetitions} reps</div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant={session.completed ? 'default' : 'secondary'}>
                            {session.completed ? 'Completed' : 'Incomplete'}
                          </Badge>
                          {session.completed && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShowAnalysis(session)}
                              className="text-xs"
                            >
                              View Analysis
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                    <p className="text-gray-600">Start your first exercise to see progress here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">Detailed performance charts and insights will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {userProgress?.achievements && userProgress.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userProgress.achievements.map(achievement => (
                      <div key={achievement.id} className="p-4 border rounded-lg">
                        <div className="text-center">
                          <div className="text-3xl mb-2">{achievement.icon}</div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          <Badge variant="outline" className="mt-2">
                            {achievement.points} points
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
                    <p className="text-gray-600">Complete exercises to unlock achievements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}