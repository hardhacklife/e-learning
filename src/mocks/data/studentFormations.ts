import type {
  FormationProjectDeposit,
  FormationQuiz,
  StudentFormation,
} from '@/types/formation'

export const MOCK_STUDENT_FORMATIONS: StudentFormation[] = [
  {
    id: 'mod-web',
    title: 'Développement Web Full Stack',
    description:
      'Maîtrisez les fondamentaux du développement web moderne : HTML, CSS, JavaScript, React, gestion d\'état et intégration d\'API REST. Ce module prépare à la conception d\'applications web complètes.',
    imageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
    level: 'Licence 3',
    type: 'Présentiel',
    managerName: 'Ousmane Fall',
    trainerName: 'Ibrahima Ndiaye',
    tutorName: 'Aissatou Ba',
    duration: '6 mois',
    sessionUrl: 'https://meet.uchk.sn/dev-web-session',
    projectDeposits: [
      {
        id: 'dep-web-todo',
        title: 'Projet — Application Todo React',
        description:
          'Déposez le code source (archive zip) et un court README expliquant votre architecture.',
        opensAt: '2026-06-01T08:00:00',
        deadline: '2026-06-20T23:59:00',
        maxFiles: 3,
        maxFileSizeMb: 25,
        allowedExtensions: ['zip', 'pdf', 'md'],
        submittedFiles: [],
      },
      {
        id: 'dep-web-html',
        title: 'Rapport — Maquette HTML/CSS',
        description:
          'Livrable du sous-module HTML : maquette responsive + rapport de 2 pages.',
        opensAt: '2026-05-01T08:00:00',
        deadline: '2026-05-30T23:59:00',
        maxFiles: 2,
        maxFileSizeMb: 15,
        allowedExtensions: ['zip', 'pdf'],
        submittedFiles: [
          {
            id: 'sf-web-1',
            name: 'maquette-responsive.zip',
            size: '4,2 Mo',
            uploadedAt: '2026-05-28T16:45:00',
          },
          {
            id: 'sf-web-2',
            name: 'rapport-html-css.pdf',
            size: '890 Ko',
            uploadedAt: '2026-05-29T10:12:00',
          },
        ],
      },
      {
        id: 'dep-web-api',
        title: 'Projet final — API REST & déploiement',
        description:
          'Application full stack avec documentation API et lien de déploiement.',
        opensAt: '2026-06-15T08:00:00',
        deadline: '2026-06-30T23:59:00',
        maxFiles: 4,
        maxFileSizeMb: 30,
        allowedExtensions: ['zip', 'pdf', 'md'],
        submittedFiles: [],
      },
    ],
    subModules: [
      {
        id: 'sub-html',
        title: 'HTML & CSS fondamentaux',
        description: 'Structure sémantique, mise en page responsive et bonnes pratiques d\'accessibilité.',
        order: 1,
        documents: [
          { id: 'd1', title: 'Cours HTML5 — Structures', type: 'pdf', size: '2,4 Mo' },
          { id: 'd2', title: 'Guide Flexbox & Grid', type: 'slide', size: '5,1 Mo' },
        ],
        quizzes: [
          { id: 'q1', title: 'Quiz — Balises sémantiques', questionsCount: 10, duration: '15 min', status: 'completed', score: 85 },
          { id: 'q2', title: 'Quiz — Mise en page CSS', questionsCount: 12, duration: '20 min', status: 'available' },
        ],
        resources: [
          { id: 'r1', title: 'MDN Web Docs — HTML', type: 'link' },
          { id: 'r2', title: 'Tutoriel CSS Grid', type: 'video', duration: '45 min' },
        ],
      },
      {
        id: 'sub-react',
        title: 'React & TypeScript',
        description: 'Composants, hooks, routing et typage statique pour des applications robustes.',
        order: 2,
        documents: [
          { id: 'd3', title: 'Introduction à React 19', type: 'pdf', size: '3,8 Mo' },
          { id: 'd4', title: 'TypeScript pour React', type: 'pdf', size: '1,9 Mo' },
          { id: 'd5', title: 'TP — Todo App', type: 'doc', size: '540 Ko' },
        ],
        quizzes: [
          { id: 'q3', title: 'Quiz — Hooks React', questionsCount: 15, duration: '25 min', status: 'available' },
          { id: 'q4', title: 'Évaluation — Composants', questionsCount: 20, duration: '30 min', status: 'locked' },
        ],
        resources: [
          { id: 'r3', title: 'React.dev — Documentation', type: 'link' },
          { id: 'r4', title: 'Exercices pratiques Hooks', type: 'exercise' },
          { id: 'r5', title: 'State management avec Redux', type: 'article' },
        ],
      },
      {
        id: 'sub-api',
        title: 'Intégration API & Déploiement',
        description: 'Consommation d\'API REST, authentification JWT et déploiement d\'applications.',
        order: 3,
        documents: [
          { id: 'd6', title: 'REST API — Bonnes pratiques', type: 'pdf', size: '2,1 Mo' },
          { id: 'd7', title: 'Guide déploiement Vite', type: 'slide', size: '3,2 Mo' },
        ],
        quizzes: [
          { id: 'q5', title: 'Quiz — API REST', questionsCount: 10, duration: '15 min', status: 'locked' },
        ],
        resources: [
          { id: 'r6', title: 'Postman — Tester une API', type: 'video', duration: '20 min' },
          { id: 'r7', title: 'Documentation Spring Boot', type: 'link' },
        ],
      },
    ],
  },
  {
    id: 'mod-data',
    title: 'Introduction à la Data Science',
    description:
      'Découvrez l\'analyse de données, la visualisation et les bases du machine learning avec Python. Module orienté projet avec études de cas réels.',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    level: 'Licence 2',
    type: 'Hybride',
    managerName: 'Mariama Cissé',
    trainerName: 'Pr. Fall',
    tutorName: 'Cheikh Gueye',
    duration: '4 mois',
    sessionUrl: 'https://meet.uchk.sn/data-science-session',
    projectDeposits: [
      {
        id: 'dep-data-viz',
        title: 'Projet — Analyse du dataset Ventes UCHK',
        description:
          'Notebook Jupyter exporté en PDF + script Python et visualisations.',
        opensAt: '2026-06-05T08:00:00',
        deadline: '2026-06-25T23:59:00',
        maxFiles: 3,
        maxFileSizeMb: 20,
        allowedExtensions: ['zip', 'pdf', 'ipynb'],
        submittedFiles: [
          {
            id: 'sf-data-1',
            name: 'analyse-ventes-v1.zip',
            size: '6,1 Mo',
            uploadedAt: '2026-06-08T11:30:00',
          },
        ],
      },
    ],
    subModules: [
      {
        id: 'sub-python',
        title: 'Python pour la Data',
        description: 'NumPy, Pandas et manipulation de jeux de données.',
        order: 1,
        documents: [
          { id: 'd8', title: 'Python Data — Cours complet', type: 'pdf', size: '4,5 Mo' },
          { id: 'd9', title: 'Cheat sheet Pandas', type: 'pdf', size: '800 Ko' },
        ],
        quizzes: [
          { id: 'q6', title: 'Quiz — Pandas basics', questionsCount: 8, duration: '10 min', status: 'completed', score: 92 },
        ],
        resources: [
          { id: 'r8', title: 'Dataset — Ventes UCHK', type: 'exercise' },
          { id: 'r9', title: 'Kaggle Learn', type: 'link' },
        ],
      },
      {
        id: 'sub-viz',
        title: 'Visualisation de données',
        description: 'Matplotlib, Seaborn et création de tableaux de bord.',
        order: 2,
        documents: [
          { id: 'd10', title: 'Guide Matplotlib', type: 'slide', size: '6,2 Mo' },
        ],
        quizzes: [
          { id: 'q7', title: 'Quiz — Graphiques', questionsCount: 10, duration: '15 min', status: 'available' },
        ],
        resources: [
          { id: 'r10', title: 'Gallery Matplotlib', type: 'link' },
          { id: 'r11', title: 'Tutoriel Seaborn', type: 'video', duration: '35 min' },
        ],
      },
      {
        id: 'sub-stats',
        title: 'Statistiques descriptives',
        description: 'Mesures de tendance centrale, dispersion et tests d\'hypothèses.',
        order: 3,
        documents: [
          { id: 'd14', title: 'Cours — Statistiques inférentielles', type: 'pdf', size: '3,1 Mo' },
          { id: 'd15', title: 'Formulaire — Tests statistiques', type: 'doc', size: '420 Ko' },
        ],
        quizzes: [
          { id: 'q10', title: 'Quiz — Probabilités', questionsCount: 12, duration: '18 min', status: 'available' },
          { id: 'q11', title: 'Quiz — Tests d\'hypothèses', questionsCount: 10, duration: '15 min', status: 'locked' },
        ],
        resources: [
          { id: 'r15', title: 'Notebook — Analyse descriptive', type: 'exercise' },
          { id: 'r16', title: 'Simulateur statistique', type: 'link' },
        ],
      },
      {
        id: 'sub-ml',
        title: 'Introduction au Machine Learning',
        description: 'Régression, classification et évaluation de modèles avec scikit-learn.',
        order: 4,
        documents: [
          { id: 'd16', title: 'ML — Concepts fondamentaux', type: 'pdf', size: '5,4 Mo' },
          { id: 'd17', title: 'TP — Prédiction churn', type: 'doc', size: '680 Ko' },
        ],
        quizzes: [
          { id: 'q12', title: 'Quiz — Algorithmes ML', questionsCount: 15, duration: '20 min', status: 'locked' },
        ],
        resources: [
          { id: 'r17', title: 'Scikit-learn documentation', type: 'link' },
          { id: 'r18', title: 'Cas pratique — Classification', type: 'video', duration: '50 min' },
        ],
      },
    ],
  },
  {
    id: 'mod-agile',
    title: 'Gestion de Projet Agile',
    description:
      'Apprenez les méthodologies Scrum et Kanban pour piloter des projets informatiques. Sprints, rétrospectives et outils collaboratifs.',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    level: 'Master 1',
    type: 'En ligne',
    managerName: 'Ousmane Fall',
    trainerName: 'Ousmane Fall',
    tutorName: 'Fatou Sow',
    duration: '3 mois',
    sessionUrl: 'https://meet.uchk.sn/agile-session',
    projectDeposits: [
      {
        id: 'dep-agile-backlog',
        title: 'Livrable — Backlog produit priorisé',
        description:
          'Export Jira ou document Excel avec user stories, critères d\'acceptation et priorisation.',
        opensAt: '2026-06-01T08:00:00',
        deadline: '2026-06-18T23:59:00',
        maxFiles: 2,
        maxFileSizeMb: 10,
        allowedExtensions: ['xlsx', 'pdf', 'csv'],
        submittedFiles: [],
      },
    ],
    subModules: [
      {
        id: 'sub-scrum',
        title: 'Fondamentaux Scrum',
        description: 'Rôles, cérémonies et artefacts du framework Scrum.',
        order: 1,
        documents: [
          { id: 'd11', title: 'Scrum Guide 2020', type: 'pdf', size: '1,2 Mo' },
          { id: 'd12', title: 'Template Sprint Planning', type: 'doc', size: '320 Ko' },
        ],
        quizzes: [
          { id: 'q8', title: 'Quiz — Rôles Scrum', questionsCount: 10, duration: '12 min', status: 'available' },
        ],
        resources: [
          { id: 'r12', title: 'Jira — Prise en main', type: 'video', duration: '25 min' },
          { id: 'r13', title: 'Atlassian Agile Coach', type: 'article' },
        ],
      },
      {
        id: 'sub-kanban',
        title: 'Kanban & Lean',
        description: 'Flux de travail, limites WIP et amélioration continue.',
        order: 2,
        documents: [
          { id: 'd13', title: 'Kanban en pratique', type: 'pdf', size: '2,8 Mo' },
        ],
        quizzes: [
          { id: 'q9', title: 'Quiz — Kanban', questionsCount: 8, duration: '10 min', status: 'locked' },
        ],
        resources: [
          { id: 'r14', title: 'Exemple de board Kanban', type: 'link' },
        ],
      },
      {
        id: 'sub-user-stories',
        title: 'User Stories & Backlog',
        description: 'Rédaction de user stories, priorisation et gestion du backlog produit.',
        order: 3,
        documents: [
          { id: 'd18', title: 'Guide User Stories INVEST', type: 'pdf', size: '1,5 Mo' },
          { id: 'd19', title: 'Template Backlog produit', type: 'doc', size: '280 Ko' },
        ],
        quizzes: [
          { id: 'q13', title: 'Quiz — Rédaction US', questionsCount: 10, duration: '12 min', status: 'available' },
        ],
        resources: [
          { id: 'r19', title: 'Atelier refinement backlog', type: 'video', duration: '30 min' },
          { id: 'r20', title: 'Exemples de user stories', type: 'article' },
        ],
      },
      {
        id: 'sub-retro',
        title: 'Rétrospectives & Métriques',
        description: 'Animation de rétrospectives, velocity et indicateurs d\'équipe.',
        order: 4,
        documents: [
          { id: 'd20', title: 'Formats de rétrospective', type: 'slide', size: '4,1 Mo' },
        ],
        quizzes: [
          { id: 'q14', title: 'Quiz — Métriques Agile', questionsCount: 8, duration: '10 min', status: 'locked' },
        ],
        resources: [
          { id: 'r21', title: 'Burndown chart — Exemple', type: 'exercise' },
          { id: 'r22', title: 'Miro — Template rétro', type: 'link' },
        ],
      },
    ],
  },
  {
    id: 'mod-reseaux',
    title: 'Réseaux & Cybersécurité',
    description:
      'Comprendre les architectures réseau, les protocoles TCP/IP et les fondamentaux de la sécurité informatique. Module orienté pratique avec simulations et études de cas.',
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
    level: 'Licence 3',
    type: 'Hybride',
    managerName: 'Mariama Cissé',
    trainerName: 'Ibrahima Ndiaye',
    tutorName: 'Cheikh Gueye',
    duration: '5 mois',
    sessionUrl: 'https://meet.uchk.sn/reseaux-session',
    subModules: [
      {
        id: 'sub-tcpip',
        title: 'Protocoles TCP/IP',
        description: 'Modèle OSI, adressage IP, sous-réseaux et routage.',
        order: 1,
        documents: [
          { id: 'd21', title: 'Cours — Modèle OSI & TCP/IP', type: 'pdf', size: '3,6 Mo' },
          { id: 'd22', title: 'TP — Calcul de sous-réseaux', type: 'doc', size: '510 Ko' },
        ],
        quizzes: [
          { id: 'q15', title: 'Quiz — Adressage IP', questionsCount: 12, duration: '15 min', status: 'completed', score: 78 },
          { id: 'q16', title: 'Quiz — Routage', questionsCount: 10, duration: '12 min', status: 'available' },
        ],
        resources: [
          { id: 'r23', title: 'Simulateur Packet Tracer', type: 'link' },
          { id: 'r24', title: 'Exercices sous-réseaux', type: 'exercise' },
        ],
      },
      {
        id: 'sub-dns',
        title: 'DNS, DHCP & Services réseau',
        description: 'Configuration des services réseau essentiels en entreprise.',
        order: 2,
        documents: [
          { id: 'd23', title: 'Guide DNS & DHCP', type: 'pdf', size: '2,2 Mo' },
        ],
        quizzes: [
          { id: 'q17', title: 'Quiz — Services réseau', questionsCount: 8, duration: '10 min', status: 'available' },
        ],
        resources: [
          { id: 'r25', title: 'Lab — Configuration DHCP', type: 'video', duration: '40 min' },
        ],
      },
      {
        id: 'sub-firewall',
        title: 'Sécurité réseau & Firewall',
        description: 'Pare-feu, VPN, détection d\'intrusion et bonnes pratiques.',
        order: 3,
        documents: [
          { id: 'd24', title: 'Sécurité périmétrique', type: 'pdf', size: '4,0 Mo' },
          { id: 'd25', title: 'Politique de sécurité — Modèle', type: 'slide', size: '2,9 Mo' },
        ],
        quizzes: [
          { id: 'q18', title: 'Quiz — Firewall & VPN', questionsCount: 10, duration: '15 min', status: 'locked' },
        ],
        resources: [
          { id: 'r26', title: 'ANSSI — Bonnes pratiques', type: 'link' },
          { id: 'r27', title: 'Cas d\'étude — Attaque DDoS', type: 'article' },
        ],
      },
      {
        id: 'sub-crypto',
        title: 'Cryptographie appliquée',
        description: 'Chiffrement symétrique, asymétrique, hachage et certificats SSL/TLS.',
        order: 4,
        documents: [
          { id: 'd26', title: 'Introduction à la cryptographie', type: 'pdf', size: '3,3 Mo' },
        ],
        quizzes: [
          { id: 'q19', title: 'Quiz — SSL/TLS', questionsCount: 10, duration: '12 min', status: 'locked' },
        ],
        resources: [
          { id: 'r28', title: "Let's Encrypt — Guide", type: 'link' },
          { id: 'r29', title: 'Démo — Certificats HTTPS', type: 'video', duration: '25 min' },
        ],
      },
    ],
  },
  {
    id: 'mod-bdd',
    title: 'Bases de données & SQL',
    description:
      'Modélisation relationnelle, requêtes SQL avancées et optimisation. De la conception schéma à l\'administration PostgreSQL.',
    imageUrl:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop',
    level: 'Licence 2',
    type: 'Présentiel',
    managerName: 'Ousmane Fall',
    trainerName: 'Pr. Fall',
    tutorName: 'Aissatou Ba',
    duration: '4 mois',
    sessionUrl: 'https://meet.uchk.sn/bdd-session',
    subModules: [
      {
        id: 'sub-model',
        title: 'Modélisation relationnelle',
        description: 'Entités, relations, normalisation et diagrammes ER.',
        order: 1,
        documents: [
          { id: 'd27', title: 'Cours — Modèle relationnel', type: 'pdf', size: '2,8 Mo' },
          { id: 'd28', title: 'Exercices — Diagrammes ER', type: 'doc', size: '640 Ko' },
        ],
        quizzes: [
          { id: 'q20', title: 'Quiz — Normalisation', questionsCount: 10, duration: '12 min', status: 'completed', score: 88 },
        ],
        resources: [
          { id: 'r30', title: 'Draw.io — Modèles ER', type: 'link' },
        ],
      },
      {
        id: 'sub-sql-base',
        title: 'SQL fondamental',
        description: 'SELECT, JOIN, agrégations et sous-requêtes.',
        order: 2,
        documents: [
          { id: 'd29', title: 'SQL — Requêtes essentielles', type: 'pdf', size: '3,5 Mo' },
          { id: 'd30', title: 'Banque de requêtes — TP', type: 'slide', size: '1,8 Mo' },
        ],
        quizzes: [
          { id: 'q21', title: 'Quiz — JOIN & GROUP BY', questionsCount: 12, duration: '18 min', status: 'available' },
          { id: 'q22', title: 'Quiz — Sous-requêtes', questionsCount: 10, duration: '15 min', status: 'available' },
        ],
        resources: [
          { id: 'r31', title: 'SQLBolt — Exercices interactifs', type: 'exercise' },
          { id: 'r32', title: 'PostgreSQL Tutorial', type: 'link' },
        ],
      },
      {
        id: 'sub-sql-advanced',
        title: 'SQL avancé & Optimisation',
        description: 'Index, vues, procédures stockées et plans d\'exécution.',
        order: 3,
        documents: [
          { id: 'd31', title: 'Optimisation des requêtes', type: 'pdf', size: '2,6 Mo' },
        ],
        quizzes: [
          { id: 'q23', title: 'Quiz — Index & Performance', questionsCount: 8, duration: '12 min', status: 'locked' },
        ],
        resources: [
          { id: 'r33', title: 'EXPLAIN ANALYZE — Guide', type: 'article' },
          { id: 'r34', title: 'Atelier optimisation SQL', type: 'video', duration: '45 min' },
        ],
      },
      {
        id: 'sub-postgres',
        title: 'Administration PostgreSQL',
        description: 'Installation, sauvegarde, réplication et sécurité des accès.',
        order: 4,
        documents: [
          { id: 'd32', title: 'Admin PostgreSQL', type: 'pdf', size: '4,2 Mo' },
          { id: 'd33', title: 'Script — Backup automatisé', type: 'doc', size: '120 Ko' },
        ],
        quizzes: [
          { id: 'q24', title: 'Quiz — Administration BDD', questionsCount: 10, duration: '15 min', status: 'locked' },
        ],
        resources: [
          { id: 'r35', title: 'Documentation PostgreSQL', type: 'link' },
        ],
      },
    ],
  },
  {
    id: 'mod-gestion',
    title: 'Gestion d\'entreprise & Comptabilité',
    description:
      'Fondamentaux de la gestion, comptabilité générale et analyse financière. Module destiné aux étudiants en gestion et entrepreneurs.',
    imageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
    level: 'Licence 3',
    type: 'En ligne',
    managerName: 'Fatou Sow',
    trainerName: 'Mme Ba',
    tutorName: 'Khady Mbaye',
    duration: '5 mois',
    sessionUrl: 'https://meet.uchk.sn/gestion-session',
    subModules: [
      {
        id: 'sub-compta-intro',
        title: 'Comptabilité générale',
        description: 'Plan comptable, écritures, bilan et compte de résultat.',
        order: 1,
        documents: [
          { id: 'd34', title: 'Cours — Comptabilité SYSCOHADA', type: 'pdf', size: '5,8 Mo' },
          { id: 'd35', title: 'Journal des écritures — Exemple', type: 'doc', size: '890 Ko' },
        ],
        quizzes: [
          { id: 'q25', title: 'Quiz — Écritures comptables', questionsCount: 15, duration: '20 min', status: 'available' },
        ],
        resources: [
          { id: 'r36', title: 'Logiciel comptable — Démo', type: 'video', duration: '30 min' },
        ],
      },
      {
        id: 'sub-analyse-fin',
        title: 'Analyse financière',
        description: 'Ratios, flux de trésorerie et tableaux de bord financiers.',
        order: 2,
        documents: [
          { id: 'd36', title: 'Ratios financiers clés', type: 'slide', size: '3,4 Mo' },
        ],
        quizzes: [
          { id: 'q26', title: 'Quiz — Ratios de liquidité', questionsCount: 10, duration: '12 min', status: 'available' },
          { id: 'q27', title: 'Quiz — Rentabilité', questionsCount: 10, duration: '12 min', status: 'locked' },
        ],
        resources: [
          { id: 'r37', title: 'Étude de cas — Bilan entreprise', type: 'exercise' },
          { id: 'r38', title: 'Modèle tableau de bord Excel', type: 'link' },
        ],
      },
      {
        id: 'sub-budget',
        title: 'Gestion budgétaire',
        description: 'Élaboration, suivi et contrôle des budgets prévisionnels.',
        order: 3,
        documents: [
          { id: 'd37', title: 'Guide budgétaire', type: 'pdf', size: '2,1 Mo' },
          { id: 'd38', title: 'Template budget prévisionnel', type: 'doc', size: '450 Ko' },
        ],
        quizzes: [
          { id: 'q28', title: 'Quiz — Budget & écarts', questionsCount: 8, duration: '10 min', status: 'locked' },
        ],
        resources: [
          { id: 'r39', title: 'Atelier — Construction budget', type: 'video', duration: '35 min' },
        ],
      },
      {
        id: 'sub-entrepreneuriat',
        title: 'Création d\'entreprise',
        description: 'Business plan, statut juridique et stratégie de lancement.',
        order: 4,
        documents: [
          { id: 'd39', title: 'Business plan — Structure', type: 'pdf', size: '1,9 Mo' },
          { id: 'd40', title: 'Formulaires création SARL', type: 'doc', size: '720 Ko' },
        ],
        quizzes: [
          { id: 'q29', title: 'Quiz — Statuts juridiques', questionsCount: 10, duration: '12 min', status: 'locked' },
        ],
        resources: [
          { id: 'r40', title: 'ADEPME — Ressources entrepreneurs', type: 'link' },
          { id: 'r41', title: 'Pitch deck — Exemple', type: 'article' },
        ],
      },
      {
        id: 'sub-rh-gestion',
        title: 'Gestion des ressources humaines',
        description: 'Recrutement, contrats, paie et droit du travail sénégalais.',
        order: 5,
        documents: [
          { id: 'd41', title: 'Droit du travail — Synthèse', type: 'pdf', size: '3,0 Mo' },
        ],
        quizzes: [
          { id: 'q30', title: 'Quiz — Contrats de travail', questionsCount: 12, duration: '15 min', status: 'locked' },
        ],
        resources: [
          { id: 'r42', title: 'Code du travail — Extraits', type: 'link' },
          { id: 'r43', title: 'Simulateur calcul paie', type: 'exercise' },
        ],
      },
    ],
  },
]

export function findStudentFormationById(id: string) {
  return MOCK_STUDENT_FORMATIONS.find((f) => f.id === id)
}

export function formatTrainerName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`
}

export function findFormationsByTrainerName(trainerName: string) {
  return MOCK_STUDENT_FORMATIONS.filter((f) => f.trainerName === trainerName)
}

export interface TrainerQuizEntry {
  formationId: string
  formationTitle: string
  subModuleId: string
  subModuleTitle: string
  quiz: FormationQuiz
}

export function getTrainerQuizzes(formations: StudentFormation[]): TrainerQuizEntry[] {
  const entries: TrainerQuizEntry[] = []
  for (const formation of formations) {
    for (const sub of formation.subModules) {
      for (const quiz of sub.quizzes) {
        entries.push({
          formationId: formation.id,
          formationTitle: formation.title,
          subModuleId: sub.id,
          subModuleTitle: sub.title,
          quiz,
        })
      }
    }
  }
  return entries
}

export interface TrainerDepositEntry {
  formationId: string
  formationTitle: string
  deposit: FormationProjectDeposit
}

export function getTrainerDeposits(
  formations: StudentFormation[],
): TrainerDepositEntry[] {
  const entries: TrainerDepositEntry[] = []
  for (const formation of formations) {
    for (const deposit of formation.projectDeposits ?? []) {
      entries.push({
        formationId: formation.id,
        formationTitle: formation.title,
        deposit,
      })
    }
  }
  return entries
}

export function countFormationContent(formation: StudentFormation) {
  let documents = 0
  let quizzes = 0
  let resources = 0
  for (const sub of formation.subModules) {
    documents += sub.documents.length
    quizzes += sub.quizzes.length
    resources += sub.resources.length
  }
  return {
    documents,
    quizzes,
    resources,
    subModules: formation.subModules.length,
    deposits: formation.projectDeposits?.length ?? 0,
  }
}
