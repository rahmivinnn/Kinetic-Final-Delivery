"use client"

// Skeleton Visualization Component
// Renders pose data with color-coded feedback for physiotherapy

import React, { useRef, useEffect } from 'react';
import { Keypoint, AngleCalculation } from '@/lib/pose-analysis';

export interface SkeletonVisualizerProps {
  keypoints: Keypoint[];
  angleResults?: AngleCalculation[];
  width: number;
  height: number;
  showSkeleton: boolean;
  show3D?: boolean;
  engine: 'openpose' | 'mediapipe';
  feedbackMode?: 'none' | 'colors' | 'angles' | 'full';
  className?: string;
}

export interface SkeletonConnection {
  from: string;
  to: string;
  color?: string;
  width?: number;
}

export interface VisualizationSettings {
  keypointRadius: number;
  connectionWidth: number;
  confidenceThreshold: number;
  colors: {
    correct: string;
    incorrect: string;
    warning: string;
    neutral: string;
    lowConfidence: string;
  };
}

const DEFAULT_SETTINGS: VisualizationSettings = {
  keypointRadius: 6,
  connectionWidth: 3,
  confidenceThreshold: 0.5,
  colors: {
    correct: '#10B981', // Green
    incorrect: '#EF4444', // Red
    warning: '#F59E0B', // Amber
    neutral: '#6B7280', // Gray
    lowConfidence: '#9CA3AF' // Light gray
  }
};

// Define skeleton connections for human pose
const SKELETON_CONNECTIONS: SkeletonConnection[] = [
  // Head connections
  { from: 'nose', to: 'leftEye' },
  { from: 'nose', to: 'rightEye' },
  { from: 'leftEye', to: 'leftEar' },
  { from: 'rightEye', to: 'rightEar' },
  
  // Torso connections
  { from: 'leftShoulder', to: 'rightShoulder' },
  { from: 'leftShoulder', to: 'leftHip' },
  { from: 'rightShoulder', to: 'rightHip' },
  { from: 'leftHip', to: 'rightHip' },
  
  // Left arm
  { from: 'leftShoulder', to: 'leftElbow' },
  { from: 'leftElbow', to: 'leftWrist' },
  
  // Right arm
  { from: 'rightShoulder', to: 'rightElbow' },
  { from: 'rightElbow', to: 'rightWrist' },
  
  // Left leg
  { from: 'leftHip', to: 'leftKnee' },
  { from: 'leftKnee', to: 'leftAnkle' },
  
  // Right leg
  { from: 'rightHip', to: 'rightKnee' },
  { from: 'rightKnee', to: 'rightAnkle' },
  
  // Feet (OpenPose specific)
  { from: 'leftAnkle', to: 'leftBigToe' },
  { from: 'rightAnkle', to: 'rightBigToe' },
  { from: 'leftAnkle', to: 'leftHeel' },
  { from: 'rightAnkle', to: 'rightHeel' }
];

export const SkeletonVisualizer: React.FC<SkeletonVisualizerProps> = ({
  keypoints,
  angleResults = [],
  width,
  height,
  showSkeleton,
  show3D = false,
  engine,
  feedbackMode = 'colors',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settings = DEFAULT_SETTINGS;

  useEffect(() => {
    if (!showSkeleton || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Draw skeleton
    drawSkeleton(ctx, keypoints, angleResults, settings, feedbackMode, engine);
    
  }, [keypoints, angleResults, width, height, showSkeleton, feedbackMode, engine]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute top-0 left-0 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Main drawing function
function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  angleResults: AngleCalculation[],
  settings: VisualizationSettings,
  feedbackMode: string,
  engine: string
): void {
  // Create keypoint lookup map
  const keypointMap = new Map<string, Keypoint>();
  keypoints.forEach(kp => keypointMap.set(kp.part, kp));
  
  // Create angle result lookup map
  const angleMap = new Map<string, AngleCalculation>();
  angleResults.forEach(angle => angleMap.set(angle.joint, angle));

  // Draw connections first (so they appear behind keypoints)
  drawConnections(ctx, keypointMap, angleMap, settings, feedbackMode);
  
  // Draw keypoints
  drawKeypoints(ctx, keypoints, angleMap, settings, feedbackMode);
  
  // Draw angle annotations if requested
  if (feedbackMode === 'angles' || feedbackMode === 'full') {
    drawAngleAnnotations(ctx, keypointMap, angleResults, settings);
  }
  
  // Draw confidence indicators
  if (feedbackMode === 'full') {
    drawConfidenceIndicators(ctx, keypoints, settings);
  }
}

// Draw skeleton connections
function drawConnections(
  ctx: CanvasRenderingContext2D,
  keypointMap: Map<string, Keypoint>,
  angleMap: Map<string, AngleCalculation>,
  settings: VisualizationSettings,
  feedbackMode: string
): void {
  SKELETON_CONNECTIONS.forEach(connection => {
    const fromPoint = keypointMap.get(connection.from);
    const toPoint = keypointMap.get(connection.to);
    
    if (!fromPoint || !toPoint) return;
    if (fromPoint.confidence < settings.confidenceThreshold || 
        toPoint.confidence < settings.confidenceThreshold) return;
    
    // Determine connection color based on feedback mode
    let color = settings.colors.neutral;
    
    if (feedbackMode === 'colors' || feedbackMode === 'full') {
      // Color based on related joint angles
      const relatedAngles = getRelatedAngles(connection, angleMap);
      if (relatedAngles.length > 0) {
        const avgStatus = getAverageAngleStatus(relatedAngles);
        color = getColorForStatus(avgStatus, settings);
      }
    }
    
    // Draw connection
    ctx.beginPath();
    ctx.moveTo(fromPoint.position.x, fromPoint.position.y);
    ctx.lineTo(toPoint.position.x, toPoint.position.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = settings.connectionWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  });
}

// Draw keypoints
function drawKeypoints(
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  angleMap: Map<string, AngleCalculation>,
  settings: VisualizationSettings,
  feedbackMode: string
): void {
  keypoints.forEach(keypoint => {
    if (keypoint.confidence < settings.confidenceThreshold) return;
    
    // Determine keypoint color
    let color = settings.colors.neutral;
    
    if (feedbackMode === 'colors' || feedbackMode === 'full') {
      // Color based on confidence and related angles
      if (keypoint.confidence < 0.7) {
        color = settings.colors.lowConfidence;
      } else {
        // Check if this keypoint is part of any angle calculations
        const relatedAngles = getKeypointRelatedAngles(keypoint.part, angleMap);
        if (relatedAngles.length > 0) {
          const avgStatus = getAverageAngleStatus(relatedAngles);
          color = getColorForStatus(avgStatus, settings);
        }
      }
    }
    
    // Draw keypoint
    ctx.beginPath();
    ctx.arc(
      keypoint.position.x,
      keypoint.position.y,
      settings.keypointRadius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = color;
    ctx.fill();
    
    // Add border for better visibility
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add confidence indicator
    if (feedbackMode === 'full') {
      const radius = settings.keypointRadius + 3;
      const circumference = 2 * Math.PI * radius;
      const dashLength = circumference * keypoint.confidence;
      
      ctx.beginPath();
      ctx.arc(keypoint.position.x, keypoint.position.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([dashLength, circumference - dashLength]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash
    }
  });
}

// Draw angle annotations
function drawAngleAnnotations(
  ctx: CanvasRenderingContext2D,
  keypointMap: Map<string, Keypoint>,
  angleResults: AngleCalculation[],
  settings: VisualizationSettings
): void {
  angleResults.forEach(angle => {
    const position = getAngleDisplayPosition(angle.joint, keypointMap);
    if (!position) return;
    
    const color = getColorForStatus(angle.status, settings);
    const text = `${Math.round(angle.angle)}°`;
    
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(position.x - 20, position.y - 10, 40, 20);
    
    // Draw text
    ctx.fillStyle = color;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, position.x, position.y);
  });
}

// Draw confidence indicators
function drawConfidenceIndicators(
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  settings: VisualizationSettings
): void {
  // Draw overall confidence bar
  const avgConfidence = keypoints.reduce((sum, kp) => sum + kp.confidence, 0) / keypoints.length;
  
  const barWidth = 100;
  const barHeight = 10;
  const barX = 10;
  const barY = 10;
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  // Confidence fill
  const fillWidth = barWidth * avgConfidence;
  ctx.fillStyle = avgConfidence > 0.8 ? settings.colors.correct : 
                  avgConfidence > 0.6 ? settings.colors.warning : settings.colors.incorrect;
  ctx.fillRect(barX, barY, fillWidth, barHeight);
  
  // Label
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Confidence: ${Math.round(avgConfidence * 100)}%`, barX, barY + barHeight + 15);
}

// Helper functions
function getRelatedAngles(
  connection: SkeletonConnection,
  angleMap: Map<string, AngleCalculation>
): AngleCalculation[] {
  const related: AngleCalculation[] = [];
  
  // Map connections to joint angles
  const connectionToJoint: { [key: string]: string } = {
    'leftShoulder-leftElbow': 'shoulder_flexion',
    'leftElbow-leftWrist': 'elbow_flexion',
    'leftHip-leftKnee': 'knee_flexion',
    'leftKnee-leftAnkle': 'ankle_dorsiflexion'
  };
  
  const connectionKey = `${connection.from}-${connection.to}`;
  const jointName = connectionToJoint[connectionKey];
  
  if (jointName && angleMap.has(jointName)) {
    related.push(angleMap.get(jointName)!);
  }
  
  return related;
}

function getKeypointRelatedAngles(
  keypointName: string,
  angleMap: Map<string, AngleCalculation>
): AngleCalculation[] {
  const related: AngleCalculation[] = [];
  
  // Map keypoints to joint angles they're involved in
  const keypointToJoints: { [key: string]: string[] } = {
    'leftShoulder': ['shoulder_flexion'],
    'leftElbow': ['shoulder_flexion', 'elbow_flexion'],
    'leftWrist': ['elbow_flexion'],
    'leftHip': ['hip_flexion', 'knee_flexion'],
    'leftKnee': ['knee_flexion', 'ankle_dorsiflexion'],
    'leftAnkle': ['ankle_dorsiflexion']
  };
  
  const joints = keypointToJoints[keypointName] || [];
  joints.forEach(joint => {
    if (angleMap.has(joint)) {
      related.push(angleMap.get(joint)!);
    }
  });
  
  return related;
}

function getAverageAngleStatus(angles: AngleCalculation[]): string {
  if (angles.length === 0) return 'unknown';
  
  const correctCount = angles.filter(a => a.status === 'correct').length;
  const ratio = correctCount / angles.length;
  
  if (ratio >= 0.8) return 'correct';
  if (ratio >= 0.5) return 'warning';
  return 'incorrect';
}

function getColorForStatus(status: string, settings: VisualizationSettings): string {
  switch (status) {
    case 'correct': return settings.colors.correct;
    case 'too_low':
    case 'too_high':
    case 'incorrect': return settings.colors.incorrect;
    case 'warning': return settings.colors.warning;
    default: return settings.colors.neutral;
  }
}

function getAngleDisplayPosition(
  jointName: string,
  keypointMap: Map<string, Keypoint>
): { x: number; y: number } | null {
  // Map joint names to keypoint positions for display
  const jointToKeypoint: { [key: string]: string } = {
    'shoulder_flexion': 'leftShoulder',
    'elbow_flexion': 'leftElbow',
    'knee_flexion': 'leftKnee',
    'hip_flexion': 'leftHip',
    'ankle_dorsiflexion': 'leftAnkle'
  };
  
  const keypointName = jointToKeypoint[jointName];
  if (!keypointName) return null;
  
  const keypoint = keypointMap.get(keypointName);
  if (!keypoint) return null;
  
  return {
    x: keypoint.position.x + 20, // Offset to avoid overlap
    y: keypoint.position.y - 20
  };
}

export default SkeletonVisualizer;