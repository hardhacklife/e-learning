import type {
  FormationQuiz,
  FormationQuizQuestion,
  StudentFormation,
} from '@/types/formation'

const QUIZ_QUESTIONS: Record<string, FormationQuizQuestion[]> = {
  'q1': [
    {
      id: 'q1-1',
      text: 'Quelle balise HTML5 représente le contenu principal de la page ?',
      type: 'mcq',
      options: ['<div>', '<main>', '<section>', '<header>'],
      correctAnswer: '<main>',
    },
    {
      id: 'q1-2',
      text: "L'attribut alt sur une image améliore l'accessibilité.",
      type: 'true_false',
      options: ['Vrai', 'Faux'],
      correctAnswer: 'Vrai',
    },
    {
      id: 'q1-3',
      text: 'Quelle balise est la plus adaptée pour une liste de navigation ?',
      type: 'mcq',
      options: ['<ul>', '<ol>', '<nav>', '<menu>'],
      correctAnswer: '<nav>',
    },
  ],
  'q2': [
    {
      id: 'q2-1',
      text: 'Quelle propriété CSS active une grille ?',
      type: 'mcq',
      options: ['display: flex', 'display: grid', 'position: grid', 'layout: grid'],
      correctAnswer: 'display: grid',
    },
    {
      id: 'q2-2',
      text: 'Flexbox est principalement conçu pour les layouts en une dimension.',
      type: 'true_false',
      options: ['Vrai', 'Faux'],
      correctAnswer: 'Vrai',
    },
    {
      id: 'q2-3',
      text: 'Que fait la propriété gap en CSS Grid ?',
      type: 'mcq',
      options: [
        "Définit l'espacement entre les cellules",
        'Change la couleur de fond',
        'Aligne le texte',
        'Masque les éléments',
      ],
      correctAnswer: "Définit l'espacement entre les cellules",
    },
  ],
  'q3': [
    {
      id: 'q3-1',
      text: "Quel hook permet de gérer l'état local dans un composant fonctionnel ?",
      type: 'mcq',
      options: ['useEffect', 'useState', 'useContext', 'useRef'],
      correctAnswer: 'useState',
    },
    {
      id: 'q3-2',
      text: "useEffect s'exécute après chaque rendu par défaut.",
      type: 'true_false',
      options: ['Vrai', 'Faux'],
      correctAnswer: 'Vrai',
    },
    {
      id: 'q3-3',
      text: 'Quel hook évite les re-rendus inutiles en mémorisant une valeur ?',
      type: 'mcq',
      options: ['useMemo', 'useId', 'useLayout', 'useSync'],
      correctAnswer: 'useMemo',
    },
  ],
  'q6': [
    {
      id: 'q6-1',
      text: 'Quelle méthode Pandas permet de lire un fichier CSV ?',
      type: 'mcq',
      options: ['pd.load_csv()', 'pd.read_csv()', 'pd.import_csv()', 'pd.open_csv()'],
      correctAnswer: 'pd.read_csv()',
    },
    {
      id: 'q6-2',
      text: 'Un DataFrame Pandas peut contenir des colonnes de types différents.',
      type: 'true_false',
      options: ['Vrai', 'Faux'],
      correctAnswer: 'Vrai',
    },
  ],
}

function generateQuestions(quiz: FormationQuiz): FormationQuizQuestion[] {
  return Array.from({ length: quiz.questionsCount }, (_, i) => ({
    id: `${quiz.id}-gen-${i}`,
    text: `Question ${i + 1} — ${quiz.title}`,
    type: 'mcq' as const,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Option A',
  }))
}

export function getQuizQuestions(quiz: FormationQuiz): FormationQuizQuestion[] {
  if (quiz.questions?.length) return quiz.questions
  if (QUIZ_QUESTIONS[quiz.id]) return QUIZ_QUESTIONS[quiz.id]
  return generateQuestions(quiz).slice(0, Math.min(quiz.questionsCount, 4))
}

export function getFullQuizQuestions(quiz: FormationQuiz): FormationQuizQuestion[] {
  if (quiz.questions?.length) return quiz.questions
  if (QUIZ_QUESTIONS[quiz.id]) return QUIZ_QUESTIONS[quiz.id]
  return generateQuestions(quiz)
}

export function findQuizInFormation(
  formation: StudentFormation | undefined,
  quizId: string,
) {
  if (!formation) return null

  for (const subModule of formation.subModules) {
    const quiz = subModule.quizzes.find((q) => q.id === quizId)
    if (quiz) return { formation, subModule, quiz }
  }

  return null
}
