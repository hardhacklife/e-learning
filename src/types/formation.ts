export interface FormationDocument {
  id: string
  title: string
  type: 'pdf' | 'doc' | 'slide'
  size?: string
}

export type QuizQuestionType = 'mcq' | 'true_false' | 'open'

export interface FormationQuizQuestion {
  id: string
  text: string
  type: QuizQuestionType
  options?: string[]
  correctAnswer: string
}

export interface FormationQuiz {
  id: string
  title: string
  description?: string
  questionsCount: number
  duration: string
  status: 'available' | 'completed' | 'locked'
  score?: number
  questions?: FormationQuizQuestion[]
}

export interface FormationResource {
  id: string
  title: string
  type: 'video' | 'link' | 'article' | 'exercise'
  duration?: string
}

export type StudentAttendanceStatus = 'present' | 'absent' | 'late'

export interface SubModuleStudentNote {
  studentId: string
  grade?: number
  quizScore?: number
  comment?: string
  attendance: StudentAttendanceStatus
}

export interface SubModuleTeacherInfo {
  objectives: string
  keyPoints: string
  nextSession: string
  internalNotes: string
}

export interface FormationSubModule {
  id: string
  title: string
  description: string
  order: number
  documents: FormationDocument[]
  quizzes: FormationQuiz[]
  resources: FormationResource[]
  studentNotes?: SubModuleStudentNote[]
  teacherInfo?: SubModuleTeacherInfo
}

export interface FormationSubmittedFile {
  id: string
  name: string
  size: string
  uploadedAt: string
}

export interface FormationProjectDeposit {
  id: string
  title: string
  description: string
  opensAt: string
  deadline: string
  maxFiles: number
  maxFileSizeMb: number
  allowedExtensions: string[]
  submittedFiles: FormationSubmittedFile[]
}

export interface StudentFormation {
  id: string
  title: string
  description: string
  imageUrl: string
  level: string
  type: string
  managerName: string
  trainerName: string
  tutorName: string
  duration: string
  sessionUrl: string
  subModules: FormationSubModule[]
  projectDeposits?: FormationProjectDeposit[]
  enrolledStudentIds?: string[]
}
