// In-memory data store for MVP demonstration
// Will be replaced with database in production

// Users data
const users = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123', // In production, use bcrypt hashing
    role: 'admin',
    name: 'System Administrator',
    email: 'admin@college.edu'
  },
  {
    id: 'faculty1',
    username: 'faculty1',
    password: 'faculty123',
    role: 'faculty',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@college.edu',
    department: 'Computer Science'
  },
  {
    id: 'faculty2',
    username: 'faculty2',
    password: 'faculty123',
    role: 'faculty',
    name: 'Prof. Priya Sharma',
    email: 'priya.sharma@college.edu',
    department: 'Information Technology'
  },
  {
    id: 'student1',
    username: 'student1',
    password: 'student123',
    role: 'student',
    name: 'Krishna',
    email: 'krishna.cs23@bitsathy.ac.in',
    rollNumber: '7376232CS201',
    department: 'Computer Science and Engineering',
    semester: 6
  },
  {
    id: 'student2',
    username: 'student2',
    password: 'student123',
    role: 'student',
    name: 'PRANAV BALAJI P MA',
    email: 'pranavbalaji.cb23@bitsathy.ac.in',
    rollNumber: '7376232CB136',
    department: 'Computer Science and Business Systems',
    semester: 6
  },
  {
    id: 'student3',
    username: 'student3',
    password: 'student123',
    role: 'student',
    name: 'Mukesh',
    email: 'mukesh.it23@bitsathy.ac.in',
    rollNumber: '7376232IT201',
    department: 'Information Technology',
    semester: 6
  },
  {
    id: 'student4',
    username: 'student4',
    password: 'student123',
    role: 'student',
    name: 'Surya',
    email: 'surya.cb23@bitsathy.ac.in',
    rollNumber: '7376232CB159',
    department: 'Computer Science and Business Systems',
    semester: 6
  },
  {
    id: 'student5',
    username: 'student5',
    password: 'student123',
    role: 'student',
    name: 'Hari Krishna',
    email: 'harikrishna.ad23@bitsathy.ac.in',
    rollNumber: '7376232AD110',
    department: 'Artificial Intelligence and Business Systems',
    semester: 6
  }
];

// Faculty-Student mappings
const facultyStudentMappings = [
  {
    facultyId: 'faculty1',
    studentIds: ['student1', 'student2', 'student4']
  },
  {
    facultyId: 'faculty2',
    studentIds: ['student3', 'student5']
  }
];

// Academic marks (internal examinations)
const academicMarks = [
  {
    studentId: 'student1',
    semester: 6,
    subjects: [
      { name: 'Data Structures', marks: 85, maxMarks: 100 },
      { name: 'Algorithms', marks: 92, maxMarks: 100 },
      { name: 'Database Systems', marks: 88, maxMarks: 100 },
      { name: 'Web Development', marks: 90, maxMarks: 100 }
    ],
    average: 88.75
  },
  {
    studentId: 'student2',
    semester: 6,
    subjects: [
      { name: 'Data Structures', marks: 95, maxMarks: 100 },
      { name: 'Algorithms', marks: 98, maxMarks: 100 },
      { name: 'Database Systems', marks: 94, maxMarks: 100 },
      { name: 'Web Development', marks: 96, maxMarks: 100 }
    ],
    average: 95.75
  },
  {
    studentId: 'student3',
    semester: 6,
    subjects: [
      { name: 'Data Structures', marks: 78, maxMarks: 100 },
      { name: 'Algorithms', marks: 82, maxMarks: 100 },
      { name: 'Database Systems', marks: 80, maxMarks: 100 },
      { name: 'Web Development', marks: 85, maxMarks: 100 }
    ],
    average: 81.25
  },
  {
    studentId: 'student4',
    semester: 6,
    subjects: [
      { name: 'Data Structures', marks: 88, maxMarks: 100 },
      { name: 'Algorithms', marks: 86, maxMarks: 100 },
      { name: 'Database Systems', marks: 90, maxMarks: 100 },
      { name: 'Web Development', marks: 87, maxMarks: 100 }
    ],
    average: 87.75
  },
  {
    studentId: 'student5',
    semester: 6,
    subjects: [
      { name: 'Data Structures', marks: 92, maxMarks: 100 },
      { name: 'Algorithms', marks: 89, maxMarks: 100 },
      { name: 'Database Systems', marks: 91, maxMarks: 100 },
      { name: 'Web Development', marks: 93, maxMarks: 100 }
    ],
    average: 91.25
  }
];

// Personalized Skills (P-Skills)
const pSkills = [
  {
    studentId: 'student1',
    skills: [
      { name: 'Python Programming', level: 'Advanced', completionDate: '2024-01-15' },
      { name: 'React Development', level: 'Intermediate', completionDate: '2024-02-10' },
      { name: 'Machine Learning Basics', level: 'Beginner', completionDate: '2024-03-05' }
    ],
    totalCompleted: 3
  },
  {
    studentId: 'student2',
    skills: [
      { name: 'Python Programming', level: 'Advanced', completionDate: '2024-01-10' },
      { name: 'React Development', level: 'Advanced', completionDate: '2024-02-05' },
      { name: 'Machine Learning Basics', level: 'Intermediate', completionDate: '2024-02-28' },
      { name: 'Cloud Computing - AWS', level: 'Intermediate', completionDate: '2024-03-15' }
    ],
    totalCompleted: 4
  },
  {
    studentId: 'student3',
    skills: [
      { name: 'Python Programming', level: 'Intermediate', completionDate: '2024-01-20' },
      { name: 'Java Programming', level: 'Intermediate', completionDate: '2024-02-15' }
    ],
    totalCompleted: 2
  },
  {
    studentId: 'student4',
    skills: [
      { name: 'Python Programming', level: 'Advanced', completionDate: '2024-01-12' },
      { name: 'React Development', level: 'Intermediate', completionDate: '2024-02-08' },
      { name: 'DevOps Fundamentals', level: 'Beginner', completionDate: '2024-03-01' }
    ],
    totalCompleted: 3
  },
  {
    studentId: 'student5',
    skills: [
      { name: 'Python Programming', level: 'Advanced', completionDate: '2024-01-08' },
      { name: 'Angular Development', level: 'Intermediate', completionDate: '2024-02-12' },
      { name: 'Machine Learning Basics', level: 'Intermediate', completionDate: '2024-03-03' },
      { name: 'Cybersecurity Basics', level: 'Beginner', completionDate: '2024-03-20' }
    ],
    totalCompleted: 4
  }
];

// Activity and Reward Points
const activityRewardPoints = [
  {
    studentId: 'student1',
    activityPoints: 120,
    rewardPoints: 85,
    activities: [
      { name: 'Tech Fest Participation', points: 50, date: '2024-01-20' },
      { name: 'Coding Competition', points: 70, date: '2024-02-15' }
    ],
    rewards: [
      { name: 'Best Project Award', points: 50, date: '2024-02-25' },
      { name: 'Hackathon Winner', points: 35, date: '2024-03-10' }
    ]
  },
  {
    studentId: 'student2',
    activityPoints: 180,
    rewardPoints: 150,
    activities: [
      { name: 'Tech Fest Participation', points: 50, date: '2024-01-20' },
      { name: 'Coding Competition', points: 70, date: '2024-02-15' },
      { name: 'Workshop Organizer', points: 60, date: '2024-03-01' }
    ],
    rewards: [
      { name: 'Best Project Award', points: 50, date: '2024-02-25' },
      { name: 'Hackathon Winner', points: 50, date: '2024-03-10' },
      { name: 'Innovation Award', points: 50, date: '2024-03-22' }
    ]
  },
  {
    studentId: 'student3',
    activityPoints: 90,
    rewardPoints: 60,
    activities: [
      { name: 'Sports Day Participation', points: 40, date: '2024-01-25' },
      { name: 'Cultural Fest', points: 50, date: '2024-02-20' }
    ],
    rewards: [
      { name: 'Team Project Excellence', points: 60, date: '2024-03-05' }
    ]
  },
  {
    studentId: 'student4',
    activityPoints: 140,
    rewardPoints: 95,
    activities: [
      { name: 'Tech Fest Participation', points: 50, date: '2024-01-20' },
      { name: 'Coding Competition', points: 70, date: '2024-02-15' },
      { name: 'Volunteer Work', points: 20, date: '2024-03-08' }
    ],
    rewards: [
      { name: 'Leadership Award', points: 45, date: '2024-02-28' },
      { name: 'Community Service', points: 50, date: '2024-03-15' }
    ]
  },
  {
    studentId: 'student5',
    activityPoints: 160,
    rewardPoints: 120,
    activities: [
      { name: 'Tech Fest Participation', points: 50, date: '2024-01-20' },
      { name: 'Coding Competition', points: 70, date: '2024-02-15' },
      { name: 'Research Paper Presentation', points: 40, date: '2024-03-12' }
    ],
    rewards: [
      { name: 'Best Project Award', points: 50, date: '2024-02-25' },
      { name: 'Excellence in Research', points: 70, date: '2024-03-18' }
    ]
  }
];

// External Technical Profiles
const externalProfiles = [
  {
    studentId: 'student1',
    github: 'https://github.com/amitpatel',
    leetcode: 'https://leetcode.com/amitpatel',
    githubScore: 85,
    leetcodeScore: 75
  },
  {
    studentId: 'student2',
    github: 'https://github.com/snehareddy',
    leetcode: 'https://leetcode.com/snehareddy',
    githubScore: 95,
    leetcodeScore: 90
  },
  {
    studentId: 'student3',
    github: 'https://github.com/rahulverma',
    leetcode: null,
    githubScore: 70,
    leetcodeScore: 0
  },
  {
    studentId: 'student4',
    github: 'https://github.com/kavyanair',
    leetcode: 'https://leetcode.com/kavyanair',
    githubScore: 80,
    leetcodeScore: 80
  },
  {
    studentId: 'student5',
    github: 'https://github.com/arjunmehta',
    leetcode: 'https://leetcode.com/arjunmehta',
    githubScore: 88,
    leetcodeScore: 85
  }
];

// Active sessions (for authentication)
const sessions = new Map();

module.exports = {
  users,
  facultyStudentMappings,
  academicMarks,
  pSkills,
  activityRewardPoints,
  externalProfiles,
  sessions
};
