import type {
  FormationSubModule,
  StudentFormation,
  SubModuleTeacherInfo,
} from '@/types/formation'

export const DEFAULT_TEACHER_INFO: SubModuleTeacherInfo = {
  objectives: '',
  keyPoints: '',
  nextSession: '',
  internalNotes: '',
}

export const DEFAULT_ENROLLMENTS: Record<string, string[]> = {
  'mod-web': ['stu-001', 'stu-005', 'stu-006', 'stu-007'],
  'mod-reseaux': ['stu-001', 'stu-003', 'stu-008'],
  'mod-data': ['stu-003', 'stu-006'],
}

const SEED_NOTES: Record<
  string,
  Record<string, import('@/types/formation').SubModuleStudentNote[]>
> = {
  'mod-web': {
    'sub-html': [
      {
        studentId: 'stu-001',
        grade: 14,
        quizScore: 85,
        comment: 'Bon travail sur la sémantique HTML',
        attendance: 'present',
      },
      {
        studentId: 'stu-005',
        grade: 11,
        quizScore: 72,
        comment: 'À revoir Flexbox',
        attendance: 'present',
      },
      {
        studentId: 'stu-006',
        grade: 16,
        quizScore: 90,
        attendance: 'late',
      },
    ],
    'sub-react': [
      {
        studentId: 'stu-001',
        grade: 15,
        attendance: 'present',
      },
    ],
  },
}

const SEED_TEACHER_INFO: Record<string, Record<string, Partial<SubModuleTeacherInfo>>> = {
  'mod-web': {
    'sub-html': {
      objectives:
        'Maîtriser la structure sémantique HTML5 et les layouts CSS modernes.',
      keyPoints: 'Balises sémantiques, Flexbox, Grid, accessibilité de base',
      nextSession: '2026-06-14 — Atelier mise en page responsive',
      internalNotes: 'Prévoir exercice live coding sur Grid.',
    },
    'sub-react': {
      objectives: 'Comprendre les composants React et le typage TypeScript.',
      keyPoints: 'Hooks, props, state, typage des composants',
      nextSession: '2026-06-18 — TP Todo App',
    },
  },
}

export function normalizeSubModule(
  sub: FormationSubModule,
  formationId: string,
): FormationSubModule {
  const seedNotes = SEED_NOTES[formationId]?.[sub.id] ?? []
  const seedInfo = SEED_TEACHER_INFO[formationId]?.[sub.id]

  return {
    ...sub,
    studentNotes: sub.studentNotes ?? seedNotes,
    teacherInfo: {
      ...DEFAULT_TEACHER_INFO,
      ...sub.teacherInfo,
      ...seedInfo,
    },
  }
}

export function normalizeFormation(formation: StudentFormation): StudentFormation {
  return {
    ...formation,
    enrolledStudentIds:
      formation.enrolledStudentIds ??
      DEFAULT_ENROLLMENTS[formation.id] ??
      [],
    subModules: formation.subModules.map((sub) =>
      normalizeSubModule(sub, formation.id),
    ),
  }
}

export function normalizeFormations(formations: StudentFormation[]) {
  return formations.map(normalizeFormation)
}

export function createEmptySubModuleFields() {
  return {
    studentNotes: [] as FormationSubModule['studentNotes'],
    teacherInfo: { ...DEFAULT_TEACHER_INFO },
  }
}
