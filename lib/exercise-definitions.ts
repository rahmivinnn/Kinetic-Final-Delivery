// Exercise Pose Definitions for Physiotherapy
// Defines correct joint angles and poses for key physiotherapy movements

export interface JointAngle {
  joint: string;
  minAngle: number;
  maxAngle: number;
  targetAngle: number;
  tolerance: number;
}

export interface ExercisePhase {
  name: string;
  duration?: number; // in seconds
  keyAngles: JointAngle[];
  description: string;
  feedback: {
    correct: string;
    tooLow: string;
    tooHigh: string;
    general: string;
  };
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'upper_body' | 'lower_body' | 'core' | 'balance' | 'flexibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  phases: ExercisePhase[];
  repetitions: {
    min: number;
    max: number;
    recommended: number;
  };
  duration: number; // total exercise duration in seconds
  restTime: number; // rest between reps in seconds
  targetMuscles: string[];
  contraindications: string[];
  modifications: string[];
}

// Predefined physiotherapy exercises
export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  {
    id: 'shoulder_flexion',
    name: 'Shoulder Flexion (Arm Raises)',
    category: 'upper_body',
    difficulty: 'beginner',
    description: 'Forward arm raises to improve shoulder mobility and strength',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep arms straight at your sides',
      'Slowly raise both arms forward to shoulder height',
      'Hold for 2 seconds, then lower slowly',
      'Keep your back straight throughout'
    ],
    phases: [
      {
        name: 'Starting Position',
        keyAngles: [
          {
            joint: 'shoulder_flexion',
            minAngle: -10,
            maxAngle: 10,
            targetAngle: 0,
            tolerance: 5
          },
          {
            joint: 'elbow_flexion',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          }
        ],
        description: 'Arms at sides, standing upright',
        feedback: {
          correct: 'Perfect starting position!',
          tooLow: 'Keep your arms straight at your sides',
          tooHigh: 'Lower your arms to starting position',
          general: 'Stand tall with arms at your sides'
        }
      },
      {
        name: 'Raised Position',
        keyAngles: [
          {
            joint: 'shoulder_flexion',
            minAngle: 80,
            maxAngle: 100,
            targetAngle: 90,
            tolerance: 10
          },
          {
            joint: 'elbow_flexion',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          }
        ],
        description: 'Arms raised to shoulder height',
        feedback: {
          correct: 'Excellent! Perfect shoulder height!',
          tooLow: 'Lift your arms higher to shoulder level',
          tooHigh: 'Lower your arms slightly to shoulder height',
          general: 'Raise arms to shoulder height'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Anterior Deltoid', 'Middle Deltoid', 'Serratus Anterior'],
    contraindications: ['Acute shoulder injury', 'Recent shoulder surgery'],
    modifications: ['Use lighter weights', 'Reduce range of motion', 'Perform seated']
  },
  {
    id: 'knee_extension',
    name: 'Seated Knee Extension',
    category: 'lower_body',
    difficulty: 'beginner',
    description: 'Strengthen quadriceps and improve knee mobility',
    instructions: [
      'Sit on edge of chair with back straight',
      'Keep thighs parallel to floor',
      'Slowly straighten one leg until knee is fully extended',
      'Hold for 2 seconds, then lower slowly',
      'Repeat with other leg'
    ],
    phases: [
      {
        name: 'Starting Position',
        keyAngles: [
          {
            joint: 'knee_flexion',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          },
          {
            joint: 'hip_flexion',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          }
        ],
        description: 'Seated with knee bent at 90 degrees',
        feedback: {
          correct: 'Good starting position!',
          tooLow: 'Sit up straighter',
          tooHigh: 'Relax and sit naturally',
          general: 'Sit with knees bent at 90 degrees'
        }
      },
      {
        name: 'Extended Position',
        keyAngles: [
          {
            joint: 'knee_flexion',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          },
          {
            joint: 'hip_flexion',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          }
        ],
        description: 'Leg fully extended',
        feedback: {
          correct: 'Perfect extension!',
          tooLow: 'Straighten your leg more',
          tooHigh: 'Good extension!',
          general: 'Fully extend your leg'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 12 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Quadriceps', 'Vastus Medialis'],
    contraindications: ['Acute knee injury', 'Severe arthritis'],
    modifications: ['Reduce range of motion', 'Add ankle weights', 'Perform both legs simultaneously']
  },
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    category: 'lower_body',
    difficulty: 'intermediate',
    description: 'Functional movement to strengthen legs and improve mobility',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep chest up and core engaged',
      'Lower by bending knees and hips',
      'Go down until thighs are parallel to floor',
      'Push through heels to return to standing'
    ],
    phases: [
      {
        name: 'Standing Position',
        keyAngles: [
          {
            joint: 'knee_flexion',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          },
          {
            joint: 'hip_flexion',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          },
          {
            joint: 'ankle_dorsiflexion',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          }
        ],
        description: 'Standing upright with good posture',
        feedback: {
          correct: 'Great starting position!',
          tooLow: 'Stand up straighter',
          tooHigh: 'Relax your posture slightly',
          general: 'Stand tall with feet shoulder-width apart'
        }
      },
      {
        name: 'Bottom Position',
        keyAngles: [
          {
            joint: 'knee_flexion',
            minAngle: 80,
            maxAngle: 100,
            targetAngle: 90,
            tolerance: 10
          },
          {
            joint: 'hip_flexion',
            minAngle: 80,
            maxAngle: 100,
            targetAngle: 90,
            tolerance: 10
          },
          {
            joint: 'ankle_dorsiflexion',
            minAngle: 70,
            maxAngle: 85,
            targetAngle: 75,
            tolerance: 5
          }
        ],
        description: 'Squatted down with thighs parallel to floor',
        feedback: {
          correct: 'Perfect squat depth!',
          tooLow: 'You can go a bit deeper',
          tooHigh: 'Try to squat down more',
          general: 'Lower until thighs are parallel to floor'
        }
      }
    ],
    repetitions: { min: 5, max: 20, recommended: 10 },
    duration: 60,
    restTime: 5,
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    contraindications: ['Knee injury', 'Hip injury', 'Balance issues'],
    modifications: ['Chair-assisted squats', 'Partial range of motion', 'Wall squats']
  },
  {
    id: 'balance_single_leg',
    name: 'Single Leg Balance',
    category: 'balance',
    difficulty: 'intermediate',
    description: 'Improve balance, proprioception, and ankle stability',
    instructions: [
      'Stand on one leg with the other slightly lifted',
      'Keep your standing leg straight but not locked',
      'Maintain upright posture',
      'Hold position for specified time',
      'Switch legs and repeat'
    ],
    phases: [
      {
        name: 'Balanced Position',
        keyAngles: [
          {
            joint: 'standing_knee_flexion',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 175,
            tolerance: 5
          },
          {
            joint: 'lifted_hip_flexion',
            minAngle: 20,
            maxAngle: 40,
            targetAngle: 30,
            tolerance: 10
          },
          {
            joint: 'trunk_alignment',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          }
        ],
        description: 'Balanced on one leg with good posture',
        feedback: {
          correct: 'Excellent balance!',
          tooLow: 'Keep your chest up',
          tooHigh: 'Relax your shoulders',
          general: 'Maintain steady balance on one leg'
        }
      }
    ],
    repetitions: { min: 3, max: 10, recommended: 5 },
    duration: 30,
    restTime: 10,
    targetMuscles: ['Ankle stabilizers', 'Core muscles', 'Hip stabilizers'],
    contraindications: ['Severe balance disorders', 'Recent ankle injury'],
    modifications: ['Hold onto support', 'Reduce hold time', 'Eyes closed for advanced']
  },
  {
    id: 'wall_slide',
    name: 'Wall Slide Exercise',
    category: 'upper_body',
    difficulty: 'beginner',
    description: 'Improve shoulder blade mobility and posture',
    instructions: [
      'Stand with back against wall',
      'Place arms against wall in "W" position',
      'Slide arms up and down maintaining contact',
      'Keep core engaged throughout movement'
    ],
    phases: [
      {
        name: 'Starting Position',
        keyAngles: [
          {
            joint: 'shoulder_abduction',
            minAngle: 80,
            maxAngle: 100,
            targetAngle: 90,
            tolerance: 10
          }
        ],
        description: 'Arms in W position against wall',
        feedback: {
          correct: 'Perfect wall contact!',
          tooLow: 'Raise arms higher',
          tooHigh: 'Lower arms slightly',
          general: 'Maintain wall contact'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Rhomboids', 'Middle Trapezius', 'Posterior Deltoid'],
    contraindications: ['Acute shoulder impingement'],
    modifications: ['Reduce range of motion', 'Perform without wall']
  },
  {
    id: 'heel_raises',
    name: 'Heel Raises',
    category: 'lower_body',
    difficulty: 'beginner',
    description: 'Strengthen calf muscles and improve ankle mobility',
    instructions: [
      'Stand with feet hip-width apart',
      'Rise up onto toes',
      'Hold for 2 seconds',
      'Lower slowly to starting position'
    ],
    phases: [
      {
        name: 'Raised Position',
        keyAngles: [
          {
            joint: 'ankle_plantarflexion',
            minAngle: 30,
            maxAngle: 50,
            targetAngle: 40,
            tolerance: 10
          }
        ],
        description: 'Standing on toes',
        feedback: {
          correct: 'Great calf activation!',
          tooLow: 'Rise higher on toes',
          tooHigh: 'Perfect height!',
          general: 'Rise up on your toes'
        }
      }
    ],
    repetitions: { min: 10, max: 20, recommended: 15 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Gastrocnemius', 'Soleus'],
    contraindications: ['Achilles tendon injury'],
    modifications: ['Hold onto support', 'Single leg variation']
  },
  {
    id: 'bridge_exercise',
    name: 'Bridge Exercise',
    category: 'core',
    difficulty: 'beginner',
    description: 'Strengthen glutes and core muscles',
    instructions: [
      'Lie on back with knees bent',
      'Feet flat on floor, hip-width apart',
      'Lift hips up creating straight line',
      'Squeeze glutes at top',
      'Lower slowly'
    ],
    phases: [
      {
        name: 'Bridge Position',
        keyAngles: [
          {
            joint: 'hip_extension',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          }
        ],
        description: 'Hips lifted in bridge position',
        feedback: {
          correct: 'Perfect bridge!',
          tooLow: 'Lift hips higher',
          tooHigh: 'Good extension!',
          general: 'Create straight line from knees to shoulders'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 12 },
    duration: 40,
    restTime: 3,
    targetMuscles: ['Glutes', 'Hamstrings', 'Core'],
    contraindications: ['Lower back pain'],
    modifications: ['Single leg bridge', 'Hold for longer duration']
  },
  {
    id: 'bird_dog',
    name: 'Bird Dog Exercise',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Improve core stability and coordination',
    instructions: [
      'Start on hands and knees',
      'Extend opposite arm and leg',
      'Hold position maintaining balance',
      'Return to start and switch sides'
    ],
    phases: [
      {
        name: 'Extended Position',
        keyAngles: [
          {
            joint: 'shoulder_flexion',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          },
          {
            joint: 'hip_extension',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          }
        ],
        description: 'Opposite arm and leg extended',
        feedback: {
          correct: 'Excellent stability!',
          tooLow: 'Extend limbs more',
          tooHigh: 'Perfect extension!',
          general: 'Maintain straight line'
        }
      }
    ],
    repetitions: { min: 5, max: 10, recommended: 8 },
    duration: 60,
    restTime: 5,
    targetMuscles: ['Core', 'Glutes', 'Shoulders'],
    contraindications: ['Wrist pain', 'Knee pain'],
    modifications: ['Arm only', 'Leg only', 'Reduce hold time']
  },
  {
    id: 'pelvic_tilt',
    name: 'Pelvic Tilt',
    category: 'core',
    difficulty: 'beginner',
    description: 'Improve pelvic mobility and core awareness',
    instructions: [
      'Lie on back with knees bent',
      'Flatten lower back against floor',
      'Tilt pelvis posteriorly',
      'Hold and release slowly'
    ],
    phases: [
      {
        name: 'Tilted Position',
        keyAngles: [
          {
            joint: 'lumbar_flexion',
            minAngle: 5,
            maxAngle: 15,
            targetAngle: 10,
            tolerance: 5
          }
        ],
        description: 'Pelvis tilted posteriorly',
        feedback: {
          correct: 'Good pelvic control!',
          tooLow: 'Tilt pelvis more',
          tooHigh: 'Reduce tilt slightly',
          general: 'Flatten back against floor'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Deep abdominals', 'Pelvic floor'],
    contraindications: ['Acute back pain'],
    modifications: ['Seated variation', 'Standing variation']
  },
  {
    id: 'hamstring_stretch',
    name: 'Hamstring Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Improve hamstring flexibility and reduce tightness',
    instructions: [
      'Lie on back',
      'Lift one leg straight up',
      'Pull leg toward chest gently',
      'Hold stretch for 30 seconds'
    ],
    phases: [
      {
        name: 'Stretched Position',
        keyAngles: [
          {
            joint: 'hip_flexion',
            minAngle: 70,
            maxAngle: 90,
            targetAngle: 80,
            tolerance: 10
          }
        ],
        description: 'Leg lifted and stretched',
        feedback: {
          correct: 'Good stretch!',
          tooLow: 'Lift leg higher',
          tooHigh: 'Perfect stretch!',
          general: 'Feel stretch in back of thigh'
        }
      }
    ],
    repetitions: { min: 2, max: 4, recommended: 3 },
    duration: 90,
    restTime: 10,
    targetMuscles: ['Hamstrings'],
    contraindications: ['Acute hamstring injury'],
    modifications: ['Use towel for assistance', 'Bent knee variation']
  },
  {
    id: 'shoulder_rolls',
    name: 'Shoulder Rolls',
    category: 'upper_body',
    difficulty: 'beginner',
    description: 'Improve shoulder mobility and reduce tension',
    instructions: [
      'Stand with arms at sides',
      'Roll shoulders backward in circular motion',
      'Complete full range of motion',
      'Reverse direction'
    ],
    phases: [
      {
        name: 'Rolling Motion',
        keyAngles: [
          {
            joint: 'shoulder_elevation',
            minAngle: 0,
            maxAngle: 30,
            targetAngle: 15,
            tolerance: 10
          }
        ],
        description: 'Shoulders moving in circular motion',
        feedback: {
          correct: 'Smooth shoulder movement!',
          tooLow: 'Increase range of motion',
          tooHigh: 'Good range!',
          general: 'Roll shoulders smoothly'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Trapezius', 'Deltoids'],
    contraindications: ['Acute shoulder injury'],
    modifications: ['Seated variation', 'One arm at a time']
  },
  {
    id: 'ankle_circles',
    name: 'Ankle Circles',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Improve ankle mobility and circulation',
    instructions: [
      'Sit with leg extended',
      'Rotate ankle in circular motion',
      'Complete 10 circles each direction',
      'Switch to other ankle'
    ],
    phases: [
      {
        name: 'Circular Motion',
        keyAngles: [
          {
            joint: 'ankle_rotation',
            minAngle: -30,
            maxAngle: 30,
            targetAngle: 0,
            tolerance: 15
          }
        ],
        description: 'Ankle moving in circular pattern',
        feedback: {
          correct: 'Good ankle mobility!',
          tooLow: 'Increase range of motion',
          tooHigh: 'Perfect range!',
          general: 'Move ankle in full circles'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Ankle stabilizers'],
    contraindications: ['Acute ankle injury'],
    modifications: ['Smaller circles', 'Assisted movement']
  },
  {
    id: 'neck_stretches',
    name: 'Neck Stretches',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Relieve neck tension and improve mobility',
    instructions: [
      'Sit or stand with good posture',
      'Gently tilt head to one side',
      'Hold stretch for 15 seconds',
      'Return to center and repeat other side'
    ],
    phases: [
      {
        name: 'Stretched Position',
        keyAngles: [
          {
            joint: 'cervical_lateral_flexion',
            minAngle: 15,
            maxAngle: 30,
            targetAngle: 20,
            tolerance: 5
          }
        ],
        description: 'Head tilted to side',
        feedback: {
          correct: 'Good neck stretch!',
          tooLow: 'Tilt head more',
          tooHigh: 'Reduce stretch intensity',
          general: 'Feel stretch on side of neck'
        }
      }
    ],
    repetitions: { min: 3, max: 5, recommended: 4 },
    duration: 60,
    restTime: 5,
    targetMuscles: ['Upper trapezius', 'Levator scapulae'],
    contraindications: ['Cervical spine injury'],
    modifications: ['Reduce range', 'Gentle pressure with hand']
  },
  {
    id: 'mini_squats',
    name: 'Mini Squats',
    category: 'lower_body',
    difficulty: 'beginner',
    description: 'Gentle knee strengthening exercise',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Bend knees slightly (30-45 degrees)',
      'Keep weight on heels',
      'Return to standing'
    ],
    phases: [
      {
        name: 'Mini Squat Position',
        keyAngles: [
          {
            joint: 'knee_flexion',
            minAngle: 30,
            maxAngle: 45,
            targetAngle: 35,
            tolerance: 8
          }
        ],
        description: 'Knees slightly bent',
        feedback: {
          correct: 'Perfect mini squat!',
          tooLow: 'Bend knees a bit more',
          tooHigh: 'Reduce knee bend',
          general: 'Slight knee bend only'
        }
      }
    ],
    repetitions: { min: 10, max: 20, recommended: 15 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Quadriceps', 'Glutes'],
    contraindications: ['Acute knee pain'],
    modifications: ['Chair support', 'Reduce range']
  },
  {
    id: 'arm_circles',
    name: 'Arm Circles',
    category: 'upper_body',
    difficulty: 'beginner',
    description: 'Warm up shoulders and improve mobility',
    instructions: [
      'Stand with arms extended to sides',
      'Make small circles with arms',
      'Gradually increase circle size',
      'Reverse direction'
    ],
    phases: [
      {
        name: 'Circular Motion',
        keyAngles: [
          {
            joint: 'shoulder_abduction',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          }
        ],
        description: 'Arms making circular motions',
        feedback: {
          correct: 'Smooth arm circles!',
          tooLow: 'Raise arms to shoulder height',
          tooHigh: 'Lower arms slightly',
          general: 'Keep arms at shoulder height'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Deltoids', 'Rotator cuff'],
    contraindications: ['Shoulder impingement'],
    modifications: ['Smaller circles', 'Seated variation']
  },
  {
    id: 'calf_stretch',
    name: 'Calf Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Stretch calf muscles and Achilles tendon',
    instructions: [
      'Stand facing wall',
      'Place hands on wall',
      'Step one foot back',
      'Keep back leg straight and heel down'
    ],
    phases: [
      {
        name: 'Stretched Position',
        keyAngles: [
          {
            joint: 'ankle_dorsiflexion',
            minAngle: 15,
            maxAngle: 25,
            targetAngle: 20,
            tolerance: 5
          }
        ],
        description: 'Calf muscle stretched',
        feedback: {
          correct: 'Good calf stretch!',
          tooLow: 'Step back further',
          tooHigh: 'Perfect stretch!',
          general: 'Feel stretch in calf muscle'
        }
      }
    ],
    repetitions: { min: 2, max: 4, recommended: 3 },
    duration: 90,
    restTime: 10,
    targetMuscles: ['Gastrocnemius', 'Soleus'],
    contraindications: ['Achilles tendon injury'],
    modifications: ['Seated stretch', 'Towel-assisted stretch']
  },
  {
    id: 'hip_circles',
    name: 'Hip Circles',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Improve hip mobility and flexibility',
    instructions: [
      'Stand with hands on hips',
      'Make circular motions with hips',
      'Keep upper body stable',
      'Reverse direction'
    ],
    phases: [
      {
        name: 'Circular Motion',
        keyAngles: [
          {
            joint: 'hip_rotation',
            minAngle: -20,
            maxAngle: 20,
            targetAngle: 0,
            tolerance: 10
          }
        ],
        description: 'Hips moving in circular pattern',
        feedback: {
          correct: 'Good hip mobility!',
          tooLow: 'Increase range of motion',
          tooHigh: 'Perfect range!',
          general: 'Move hips in smooth circles'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Hip flexors', 'Hip rotators'],
    contraindications: ['Hip injury'],
    modifications: ['Smaller circles', 'Seated variation']
  },
  {
    id: 'thoracic_rotation',
    name: 'Thoracic Spine Rotation',
    category: 'flexibility',
    difficulty: 'intermediate',
    description: 'Improve upper back mobility and rotation',
    instructions: [
      'Sit with arms crossed over chest',
      'Rotate upper body to one side',
      'Keep hips facing forward',
      'Return to center and repeat other side'
    ],
    phases: [
      {
        name: 'Rotated Position',
        keyAngles: [
          {
            joint: 'thoracic_rotation',
            minAngle: 30,
            maxAngle: 50,
            targetAngle: 40,
            tolerance: 10
          }
        ],
        description: 'Upper body rotated to side',
        feedback: {
          correct: 'Good spinal rotation!',
          tooLow: 'Rotate further',
          tooHigh: 'Perfect rotation!',
          general: 'Rotate from upper back'
        }
      }
    ],
    repetitions: { min: 5, max: 10, recommended: 8 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Thoracic rotators', 'Obliques'],
    contraindications: ['Acute back pain'],
    modifications: ['Reduce range', 'Standing variation']
  },
  {
    id: 'quad_stretch',
    name: 'Quadriceps Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Stretch front thigh muscles',
    instructions: [
      'Stand holding onto support',
      'Bend knee bringing heel to buttock',
      'Keep knees together',
      'Hold stretch gently'
    ],
    phases: [
      {
        name: 'Stretched Position',
        keyAngles: [
          {
            joint: 'knee_flexion',
            minAngle: 120,
            maxAngle: 140,
            targetAngle: 130,
            tolerance: 10
          }
        ],
        description: 'Knee bent with heel to buttock',
        feedback: {
          correct: 'Good quad stretch!',
          tooLow: 'Bend knee more',
          tooHigh: 'Perfect stretch!',
          general: 'Feel stretch in front of thigh'
        }
      }
    ],
    repetitions: { min: 2, max: 4, recommended: 3 },
    duration: 90,
    restTime: 10,
    targetMuscles: ['Quadriceps'],
    contraindications: ['Knee injury'],
    modifications: ['Lying down variation', 'Reduced range']
  },
  {
    id: 'side_bends',
    name: 'Side Bends',
    category: 'core',
    difficulty: 'beginner',
    description: 'Stretch and strengthen side muscles',
    instructions: [
      'Stand with feet hip-width apart',
      'Place one hand on hip',
      'Reach other arm overhead and bend to side',
      'Return to center and repeat other side'
    ],
    phases: [
      {
        name: 'Side Bend Position',
        keyAngles: [
          {
            joint: 'lateral_flexion',
            minAngle: 15,
            maxAngle: 30,
            targetAngle: 20,
            tolerance: 8
          }
        ],
        description: 'Body bent to one side',
        feedback: {
          correct: 'Good side stretch!',
          tooLow: 'Bend further to side',
          tooHigh: 'Perfect stretch!',
          general: 'Feel stretch along side'
        }
      }
    ],
    repetitions: { min: 5, max: 10, recommended: 8 },
    duration: 40,
    restTime: 3,
    targetMuscles: ['Obliques', 'Quadratus lumborum'],
    contraindications: ['Lower back pain'],
    modifications: ['Seated variation', 'Reduce range']
  },
  {
    id: 'marching_in_place',
    name: 'Marching in Place',
    category: 'balance',
    difficulty: 'beginner',
    description: 'Improve balance and coordination',
    instructions: [
      'Stand with good posture',
      'Lift one knee up to hip level',
      'Lower and lift other knee',
      'Maintain steady rhythm'
    ],
    phases: [
      {
        name: 'Knee Lifted Position',
        keyAngles: [
          {
            joint: 'hip_flexion',
            minAngle: 80,
            maxAngle: 100,
            targetAngle: 90,
            tolerance: 10
          }
        ],
        description: 'Knee lifted to hip level',
        feedback: {
          correct: 'Good marching form!',
          tooLow: 'Lift knee higher',
          tooHigh: 'Perfect height!',
          general: 'Lift knee to hip level'
        }
      }
    ],
    repetitions: { min: 10, max: 20, recommended: 15 },
    duration: 60,
    restTime: 5,
    targetMuscles: ['Hip flexors', 'Core'],
    contraindications: ['Balance disorders'],
    modifications: ['Hold onto support', 'Seated marching']
  },
  {
    id: 'wrist_circles',
    name: 'Wrist Circles',
    category: 'upper_body',
    difficulty: 'beginner',
    description: 'Improve wrist mobility and reduce stiffness',
    instructions: [
      'Extend arms in front of body',
      'Make circular motions with wrists',
      'Complete circles in both directions',
      'Keep arms steady'
    ],
    phases: [
      {
        name: 'Circular Motion',
        keyAngles: [
          {
            joint: 'wrist_rotation',
            minAngle: -30,
            maxAngle: 30,
            targetAngle: 0,
            tolerance: 15
          }
        ],
        description: 'Wrists moving in circular pattern',
        feedback: {
          correct: 'Good wrist mobility!',
          tooLow: 'Increase range of motion',
          tooHigh: 'Perfect range!',
          general: 'Move wrists in full circles'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Wrist flexors', 'Wrist extensors'],
    contraindications: ['Wrist injury'],
    modifications: ['Smaller circles', 'One wrist at a time']
  },
  {
    id: 'toe_taps',
    name: 'Toe Taps',
    category: 'lower_body',
    difficulty: 'beginner',
    description: 'Improve ankle mobility and leg strength',
    instructions: [
      'Stand with heels on ground',
      'Lift toes up as high as possible',
      'Lower toes back down',
      'Keep heels planted'
    ],
    phases: [
      {
        name: 'Toes Lifted Position',
        keyAngles: [
          {
            joint: 'ankle_dorsiflexion',
            minAngle: 15,
            maxAngle: 25,
            targetAngle: 20,
            tolerance: 5
          }
        ],
        description: 'Toes lifted with heels down',
        feedback: {
          correct: 'Good toe lift!',
          tooLow: 'Lift toes higher',
          tooHigh: 'Perfect lift!',
          general: 'Lift toes while keeping heels down'
        }
      }
    ],
    repetitions: { min: 10, max: 20, recommended: 15 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Tibialis anterior'],
    contraindications: ['Ankle injury'],
    modifications: ['Seated variation', 'One foot at a time']
  },
  {
    id: 'chest_stretch',
    name: 'Chest Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Stretch chest muscles and improve posture',
    instructions: [
      'Stand in doorway',
      'Place forearm on door frame',
      'Step forward gently',
      'Feel stretch across chest'
    ],
    phases: [
      {
        name: 'Stretched Position',
        keyAngles: [
          {
            joint: 'shoulder_horizontal_abduction',
            minAngle: 15,
            maxAngle: 30,
            targetAngle: 20,
            tolerance: 8
          }
        ],
        description: 'Chest muscles stretched',
        feedback: {
          correct: 'Good chest stretch!',
          tooLow: 'Step forward more',
          tooHigh: 'Perfect stretch!',
          general: 'Feel stretch across chest'
        }
      }
    ],
    repetitions: { min: 2, max: 4, recommended: 3 },
    duration: 90,
    restTime: 10,
    targetMuscles: ['Pectoralis major', 'Anterior deltoid'],
    contraindications: ['Shoulder injury'],
    modifications: ['Corner stretch', 'Towel-assisted stretch']
  },
  {
    id: 'hip_flexor_stretch',
    name: 'Hip Flexor Stretch',
    category: 'flexibility',
    difficulty: 'intermediate',
    description: 'Stretch hip flexor muscles',
    instructions: [
      'Kneel on one knee',
      'Place other foot forward',
      'Push hips forward gently',
      'Keep back straight'
    ],
    phases: [
      {
        name: 'Stretched Position',
        keyAngles: [
          {
            joint: 'hip_extension',
            minAngle: 10,
            maxAngle: 25,
            targetAngle: 15,
            tolerance: 8
          }
        ],
        description: 'Hip flexors stretched',
        feedback: {
          correct: 'Good hip flexor stretch!',
          tooLow: 'Push hips forward more',
          tooHigh: 'Perfect stretch!',
          general: 'Feel stretch in front of hip'
        }
      }
    ],
    repetitions: { min: 2, max: 4, recommended: 3 },
    duration: 90,
    restTime: 10,
    targetMuscles: ['Hip flexors', 'Psoas'],
    contraindications: ['Knee injury'],
    modifications: ['Standing variation', 'Pillow under knee']
  },
  {
    id: 'seated_spinal_twist',
    name: 'Seated Spinal Twist',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Improve spinal mobility and reduce stiffness',
    instructions: [
      'Sit with legs extended',
      'Cross one leg over the other',
      'Rotate toward bent knee',
      'Use arm for gentle pressure'
    ],
    phases: [
      {
        name: 'Twisted Position',
        keyAngles: [
          {
            joint: 'spinal_rotation',
            minAngle: 30,
            maxAngle: 50,
            targetAngle: 40,
            tolerance: 10
          }
        ],
        description: 'Spine rotated to side',
        feedback: {
          correct: 'Good spinal twist!',
          tooLow: 'Rotate further',
          tooHigh: 'Perfect rotation!',
          general: 'Rotate from your spine'
        }
      }
    ],
    repetitions: { min: 3, max: 5, recommended: 4 },
    duration: 60,
    restTime: 5,
    targetMuscles: ['Spinal rotators', 'Obliques'],
    contraindications: ['Acute back pain'],
    modifications: ['Chair variation', 'Reduce range']
  },
  {
    id: 'standing_balance',
    name: 'Standing Balance',
    category: 'balance',
    difficulty: 'beginner',
    description: 'Improve overall balance and stability',
    instructions: [
      'Stand with feet together',
      'Close eyes if comfortable',
      'Maintain balance for 30 seconds',
      'Use support if needed'
    ],
    phases: [
      {
        name: 'Balanced Position',
        keyAngles: [
          {
            joint: 'postural_alignment',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          }
        ],
        description: 'Standing in balanced position',
        feedback: {
          correct: 'Excellent balance!',
          tooLow: 'Stand up straighter',
          tooHigh: 'Relax your posture',
          general: 'Maintain steady balance'
        }
      }
    ],
    repetitions: { min: 3, max: 5, recommended: 4 },
    duration: 120,
    restTime: 10,
    targetMuscles: ['Core', 'Ankle stabilizers'],
    contraindications: ['Severe balance disorders'],
    modifications: ['Eyes open', 'Hold onto support']
  },
  {
    id: 'leg_swings',
    name: 'Leg Swings',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Dynamic hip mobility exercise',
    instructions: [
      'Hold onto support',
      'Swing one leg forward and back',
      'Keep leg straight',
      'Control the movement'
    ],
    phases: [
      {
        name: 'Forward Swing',
        keyAngles: [
          {
            joint: 'hip_flexion',
            minAngle: 30,
            maxAngle: 50,
            targetAngle: 40,
            tolerance: 10
          }
        ],
        description: 'Leg swung forward',
        feedback: {
          correct: 'Good leg swing!',
          tooLow: 'Swing leg higher',
          tooHigh: 'Perfect height!',
          general: 'Control the swing motion'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Hip flexors', 'Hamstrings'],
    contraindications: ['Hip injury'],
    modifications: ['Smaller range', 'Seated variation']
  },
  {
    id: 'tricep_stretch',
    name: 'Tricep Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Stretch back of arm muscles',
    instructions: [
      'Raise one arm overhead',
      'Bend elbow bringing hand to back',
      'Use other hand to gently pull',
      'Feel stretch in back of arm'
    ],
    phases: [
      {
        name: 'Stretched Position',
        keyAngles: [
          {
            joint: 'elbow_flexion',
            minAngle: 120,
            maxAngle: 140,
            targetAngle: 130,
            tolerance: 10
          }
        ],
        description: 'Tricep muscle stretched',
        feedback: {
          correct: 'Good tricep stretch!',
          tooLow: 'Bend elbow more',
          tooHigh: 'Perfect stretch!',
          general: 'Feel stretch in back of arm'
        }
      }
    ],
    repetitions: { min: 2, max: 4, recommended: 3 },
    duration: 90,
    restTime: 10,
    targetMuscles: ['Triceps'],
    contraindications: ['Elbow injury'],
    modifications: ['Towel-assisted stretch', 'Seated variation']
  },
  {
    id: 'cat_cow_stretch',
    name: 'Cat-Cow Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Improve spinal mobility and flexibility',
    instructions: [
      'Start on hands and knees',
      'Arch back looking up (cow)',
      'Round back looking down (cat)',
      'Move slowly between positions'
    ],
    phases: [
      {
        name: 'Cow Position',
        keyAngles: [
          {
            joint: 'spinal_extension',
            minAngle: 15,
            maxAngle: 25,
            targetAngle: 20,
            tolerance: 5
          }
        ],
        description: 'Back arched in cow position',
        feedback: {
          correct: 'Good spinal extension!',
          tooLow: 'Arch back more',
          tooHigh: 'Perfect arch!',
          general: 'Arch your back gently'
        }
      },
      {
        name: 'Cat Position',
        keyAngles: [
          {
            joint: 'spinal_flexion',
            minAngle: 15,
            maxAngle: 25,
            targetAngle: 20,
            tolerance: 5
          }
        ],
        description: 'Back rounded in cat position',
        feedback: {
          correct: 'Good spinal flexion!',
          tooLow: 'Round back more',
          tooHigh: 'Perfect curve!',
          general: 'Round your back like a cat'
        }
      }
    ],
    repetitions: { min: 5, max: 10, recommended: 8 },
    duration: 60,
    restTime: 5,
    targetMuscles: ['Spinal erectors', 'Abdominals'],
    contraindications: ['Wrist pain', 'Knee pain'],
    modifications: ['Seated variation', 'Standing variation']
  },
  {
    id: 'lateral_leg_raises',
    name: 'Lateral Leg Raises',
    category: 'lower_body',
    difficulty: 'beginner',
    description: 'Strengthen hip abductor muscles',
    instructions: [
      'Lie on side with legs straight',
      'Lift top leg toward ceiling',
      'Keep leg straight and toes forward',
      'Lower slowly'
    ],
    phases: [
      {
        name: 'Raised Position',
        keyAngles: [
          {
            joint: 'hip_abduction',
            minAngle: 30,
            maxAngle: 45,
            targetAngle: 35,
            tolerance: 8
          }
        ],
        description: 'Leg lifted to side',
        feedback: {
          correct: 'Good leg lift!',
          tooLow: 'Lift leg higher',
          tooHigh: 'Perfect height!',
          general: 'Lift leg straight up'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 12 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Hip abductors', 'Glutes'],
    contraindications: ['Hip injury'],
    modifications: ['Standing variation', 'Reduce range']
  },
  {
    id: 'prone_leg_lifts',
    name: 'Prone Leg Lifts',
    category: 'lower_body',
    difficulty: 'beginner',
    description: 'Strengthen glutes and hamstrings',
    instructions: [
      'Lie face down on mat',
      'Keep legs straight',
      'Lift one leg off ground',
      'Lower slowly and repeat'
    ],
    phases: [
      {
        name: 'Lifted Position',
        keyAngles: [
          {
            joint: 'hip_extension',
            minAngle: 10,
            maxAngle: 20,
            targetAngle: 15,
            tolerance: 5
          }
        ],
        description: 'Leg lifted behind body',
        feedback: {
          correct: 'Good glute activation!',
          tooLow: 'Lift leg higher',
          tooHigh: 'Perfect lift!',
          general: 'Lift leg using glutes'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 40,
    restTime: 3,
    targetMuscles: ['Glutes', 'Hamstrings'],
    contraindications: ['Lower back pain'],
    modifications: ['Pillow under hips', 'Reduce range']
  },
  {
    id: 'wall_push_ups',
    name: 'Wall Push-ups',
    category: 'upper_body',
    difficulty: 'beginner',
    description: 'Strengthen chest and arm muscles',
    instructions: [
      'Stand arm\'s length from wall',
      'Place palms flat against wall',
      'Lean in toward wall',
      'Push back to starting position'
    ],
    phases: [
      {
        name: 'Leaning Position',
        keyAngles: [
          {
            joint: 'elbow_flexion',
            minAngle: 45,
            maxAngle: 90,
            targetAngle: 60,
            tolerance: 15
          }
        ],
        description: 'Leaning toward wall',
        feedback: {
          correct: 'Good push-up form!',
          tooLow: 'Lean in more',
          tooHigh: 'Perfect depth!',
          general: 'Lean toward wall with control'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Pectorals', 'Triceps', 'Deltoids'],
    contraindications: ['Wrist injury'],
    modifications: ['Closer to wall', 'Incline push-ups']
  },
  {
    id: 'seated_leg_extensions',
    name: 'Seated Leg Extensions',
    category: 'lower_body',
    difficulty: 'beginner',
    description: 'Strengthen quadriceps muscles',
    instructions: [
      'Sit in chair with back straight',
      'Extend one leg straight out',
      'Hold for 2 seconds',
      'Lower slowly'
    ],
    phases: [
      {
        name: 'Extended Position',
        keyAngles: [
          {
            joint: 'knee_extension',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          }
        ],
        description: 'Leg fully extended',
        feedback: {
          correct: 'Perfect leg extension!',
          tooLow: 'Straighten leg more',
          tooHigh: 'Excellent extension!',
          general: 'Fully extend your leg'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 12 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Quadriceps'],
    contraindications: ['Knee injury'],
    modifications: ['Partial range', 'Both legs together']
  },
  {
    id: 'standing_hip_abduction',
    name: 'Standing Hip Abduction',
    category: 'lower_body',
    difficulty: 'beginner',
    description: 'Strengthen hip muscles and improve stability',
    instructions: [
      'Stand holding onto support',
      'Lift one leg out to side',
      'Keep leg straight',
      'Lower slowly'
    ],
    phases: [
      {
        name: 'Abducted Position',
        keyAngles: [
          {
            joint: 'hip_abduction',
            minAngle: 25,
            maxAngle: 40,
            targetAngle: 30,
            tolerance: 8
          }
        ],
        description: 'Leg lifted to side',
        feedback: {
          correct: 'Good hip abduction!',
          tooLow: 'Lift leg higher',
          tooHigh: 'Perfect height!',
          general: 'Lift leg straight to side'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 40,
    restTime: 3,
    targetMuscles: ['Hip abductors', 'Glutes'],
    contraindications: ['Hip injury'],
    modifications: ['Reduce range', 'Seated variation']
  },
  {
    id: 'deep_breathing',
    name: 'Deep Breathing Exercise',
    category: 'core',
    difficulty: 'beginner',
    description: 'Improve breathing patterns and core activation',
    instructions: [
      'Lie on back with knees bent',
      'Place one hand on chest, one on belly',
      'Breathe deeply into belly',
      'Exhale slowly through pursed lips'
    ],
    phases: [
      {
        name: 'Inhaled Position',
        keyAngles: [
          {
            joint: 'diaphragm_expansion',
            minAngle: 15,
            maxAngle: 25,
            targetAngle: 20,
            tolerance: 5
          }
        ],
        description: 'Deep inhalation with belly expansion',
        feedback: {
          correct: 'Good deep breathing!',
          tooLow: 'Breathe deeper',
          tooHigh: 'Perfect breath!',
          general: 'Breathe into your belly'
        }
      }
    ],
    repetitions: { min: 5, max: 10, recommended: 8 },
    duration: 120,
    restTime: 5,
    targetMuscles: ['Diaphragm', 'Core'],
    contraindications: ['Respiratory conditions'],
    modifications: ['Seated variation', 'Shorter breaths']
  },
  {
    id: 'finger_exercises',
    name: 'Finger Exercises',
    category: 'upper_body',
    difficulty: 'beginner',
    description: 'Improve finger dexterity and hand strength',
    instructions: [
      'Make a fist and open fingers',
      'Touch thumb to each fingertip',
      'Spread fingers wide apart',
      'Repeat sequence slowly'
    ],
    phases: [
      {
        name: 'Finger Extension',
        keyAngles: [
          {
            joint: 'finger_extension',
            minAngle: 0,
            maxAngle: 15,
            targetAngle: 10,
            tolerance: 5
          }
        ],
        description: 'Fingers fully extended',
        feedback: {
          correct: 'Good finger extension!',
          tooLow: 'Extend fingers more',
          tooHigh: 'Perfect extension!',
          general: 'Spread fingers wide'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 10 },
    duration: 30,
    restTime: 2,
    targetMuscles: ['Finger extensors', 'Intrinsic hand muscles'],
    contraindications: ['Hand injury'],
    modifications: ['One hand at a time', 'Gentle movements']
  },
  {
    id: 'eye_exercises',
    name: 'Eye Movement Exercises',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Reduce eye strain and improve focus',
    instructions: [
      'Look up and down slowly',
      'Look left and right',
      'Make circular motions with eyes',
      'Focus on near and far objects'
    ],
    phases: [
      {
        name: 'Eye Movement',
        keyAngles: [
          {
            joint: 'eye_rotation',
            minAngle: -30,
            maxAngle: 30,
            targetAngle: 0,
            tolerance: 15
          }
        ],
        description: 'Eyes moving in various directions',
        feedback: {
          correct: 'Good eye movement!',
          tooLow: 'Move eyes more',
          tooHigh: 'Perfect range!',
          general: 'Move eyes smoothly'
        }
      }
    ],
    repetitions: { min: 5, max: 10, recommended: 8 },
    duration: 60,
    restTime: 5,
    targetMuscles: ['Extraocular muscles'],
    contraindications: ['Eye injury'],
    modifications: ['Slower movements', 'Shorter duration']
  },
  {
    id: 'posture_correction',
    name: 'Posture Correction Exercise',
    category: 'core',
    difficulty: 'beginner',
    description: 'Improve overall posture and alignment',
    instructions: [
      'Stand against wall',
      'Press head, shoulders, and buttocks to wall',
      'Hold position for 30 seconds',
      'Step away maintaining posture'
    ],
    phases: [
      {
        name: 'Corrected Posture',
        keyAngles: [
          {
            joint: 'cervical_alignment',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          },
          {
            joint: 'thoracic_alignment',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          }
        ],
        description: 'Proper postural alignment',
        feedback: {
          correct: 'Excellent posture!',
          tooLow: 'Stand up straighter',
          tooHigh: 'Relax shoulders',
          general: 'Maintain good alignment'
        }
      }
    ],
    repetitions: { min: 3, max: 5, recommended: 4 },
    duration: 120,
    restTime: 10,
    targetMuscles: ['Postural muscles', 'Core'],
    contraindications: ['Acute back pain'],
    modifications: ['Seated variation', 'Shorter holds']
  },
  {
    id: 'balance_beam_walk',
    name: 'Balance Beam Walk',
    category: 'balance',
    difficulty: 'intermediate',
    description: 'Improve dynamic balance and coordination',
    instructions: [
      'Walk heel-to-toe in straight line',
      'Keep arms out for balance',
      'Look straight ahead',
      'Take slow, controlled steps'
    ],
    phases: [
      {
        name: 'Heel-to-Toe Position',
        keyAngles: [
          {
            joint: 'ankle_stability',
            minAngle: 85,
            maxAngle: 95,
            targetAngle: 90,
            tolerance: 5
          }
        ],
        description: 'Walking heel-to-toe',
        feedback: {
          correct: 'Great balance walking!',
          tooLow: 'Keep head up',
          tooHigh: 'Perfect form!',
          general: 'Walk heel-to-toe slowly'
        }
      }
    ],
    repetitions: { min: 5, max: 10, recommended: 8 },
    duration: 90,
    restTime: 10,
    targetMuscles: ['Core', 'Ankle stabilizers'],
    contraindications: ['Severe balance disorders'],
    modifications: ['Hold onto support', 'Wider stance']
  },
  {
    id: 'resistance_band_pulls',
    name: 'Resistance Band Pulls',
    category: 'upper_body',
    difficulty: 'intermediate',
    description: 'Strengthen upper back and improve posture',
    instructions: [
      'Hold resistance band with both hands',
      'Pull band apart at chest level',
      'Squeeze shoulder blades together',
      'Return slowly to start'
    ],
    phases: [
      {
        name: 'Pulled Position',
        keyAngles: [
          {
            joint: 'shoulder_retraction',
            minAngle: 15,
            maxAngle: 25,
            targetAngle: 20,
            tolerance: 5
          }
        ],
        description: 'Shoulder blades squeezed together',
        feedback: {
          correct: 'Good shoulder blade squeeze!',
          tooLow: 'Pull band further apart',
          tooHigh: 'Perfect retraction!',
          general: 'Squeeze shoulder blades together'
        }
      }
    ],
    repetitions: { min: 8, max: 15, recommended: 12 },
    duration: 45,
    restTime: 3,
    targetMuscles: ['Rhomboids', 'Middle trapezius'],
    contraindications: ['Shoulder injury'],
    modifications: ['Lighter resistance', 'Seated variation']
  },
  {
    id: 'step_ups',
    name: 'Step-ups',
    category: 'lower_body',
    difficulty: 'intermediate',
    description: 'Strengthen legs and improve functional movement',
    instructions: [
      'Step up onto stable platform',
      'Bring other foot up to meet it',
      'Step down with control',
      'Alternate leading leg'
    ],
    phases: [
      {
        name: 'Stepped Up Position',
        keyAngles: [
          {
            joint: 'knee_extension',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          },
          {
            joint: 'hip_extension',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          }
        ],
        description: 'Standing on platform',
        feedback: {
          correct: 'Good step-up form!',
          tooLow: 'Step up completely',
          tooHigh: 'Perfect step!',
          general: 'Step up with control'
        }
      }
    ],
    repetitions: { min: 5, max: 12, recommended: 8 },
    duration: 60,
    restTime: 5,
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves'],
    contraindications: ['Knee injury', 'Balance issues'],
    modifications: ['Lower step', 'Hold onto support']
  },
  {
    id: 'modified_plank',
    name: 'Modified Plank',
    category: 'core',
    difficulty: 'intermediate',
    description: 'Strengthen core muscles and improve stability',
    instructions: [
      'Start on knees and forearms',
      'Keep body in straight line',
      'Hold position',
      'Breathe normally'
    ],
    phases: [
      {
        name: 'Plank Position',
        keyAngles: [
          {
            joint: 'hip_alignment',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          },
          {
            joint: 'spine_alignment',
            minAngle: 170,
            maxAngle: 180,
            targetAngle: 180,
            tolerance: 5
          }
        ],
        description: 'Body in straight line',
        feedback: {
          correct: 'Perfect plank form!',
          tooLow: 'Lift hips up',
          tooHigh: 'Lower hips slightly',
          general: 'Keep body straight'
        }
      }
    ],
    repetitions: { min: 2, max: 5, recommended: 3 },
    duration: 90,
    restTime: 15,
    targetMuscles: ['Core', 'Shoulders', 'Glutes'],
    contraindications: ['Wrist pain', 'Lower back pain'],
    modifications: ['Wall plank', 'Shorter holds']
  },
  {
    id: 'gentle_yoga_flow',
    name: 'Gentle Yoga Flow',
    category: 'flexibility',
    difficulty: 'beginner',
    description: 'Improve flexibility and relaxation',
    instructions: [
      'Move slowly between poses',
      'Focus on breathing',
      'Hold each position briefly',
      'Listen to your body'
    ],
    phases: [
      {
        name: 'Flowing Movement',
        keyAngles: [
          {
            joint: 'full_body_flexibility',
            minAngle: 0,
            maxAngle: 45,
            targetAngle: 20,
            tolerance: 15
          }
        ],
        description: 'Gentle flowing movements',
        feedback: {
          correct: 'Beautiful flow!',
          tooLow: 'Increase range gently',
          tooHigh: 'Perfect movement!',
          general: 'Move with your breath'
        }
      }
    ],
    repetitions: { min: 3, max: 8, recommended: 5 },
    duration: 180,
    restTime: 10,
    targetMuscles: ['Full body'],
    contraindications: ['Acute injuries'],
    modifications: ['Chair yoga', 'Shorter sequences']
  }
];

// Helper function to get exercise by ID
export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return EXERCISE_LIBRARY.find(exercise => exercise.id === id);
}

// Helper function to get exercises by category
export function getExercisesByCategory(category: ExerciseDefinition['category']): ExerciseDefinition[] {
  return EXERCISE_LIBRARY.filter(exercise => exercise.category === category);
}

// Helper function to get exercises by difficulty
export function getExercisesByDifficulty(difficulty: ExerciseDefinition['difficulty']): ExerciseDefinition[] {
  return EXERCISE_LIBRARY.filter(exercise => exercise.difficulty === difficulty);
}