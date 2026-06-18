PRD (Product Requirements Document)
Nom du produit
UCHK Smart Campus

Vision Produit
Développer une plateforme web moderne permettant la gestion administrative, pédagogique et institutionnelle de l'université.

Architecture Technique
Frontend
Angular
Angular Material
RxJS
API
REST API
JWT Authentication
Backend
Spring Boot
Spring Security
JPA/Hibernate
Base de données
PostgreSQL
Déploiement
Docker
Nginx

Gestion des rôles
Administrateur
Permissions :
Gestion utilisateurs
Gestion rôles
Gestion système

Personnel Administratif
Permissions :
Gestion documents
Gestion RH
Gestion budget

Enseignant
Permissions :
Gestion cours
Gestion réunions pédagogiques

Tuteur
Permissions :
Gestion tutorat

Service Insertion
Permissions :
Gestion stages
Gestion statistiques emploi

Étudiant
Permissions :
Consultation dossier
Consultation formations

Module 1 : Communication
Fonctionnalités
Comptes rendus
CRUD :
Réunion
Séminaire
Webinaire
Conseil d'université
Notifications
Email
Notification interne
Archivage
Classement par catégorie
Recherche avancée

User Stories
US-COM-001
En tant qu'administratif
Je veux publier un compte rendu
Afin que les utilisateurs puissent le consulter.
US-COM-002
En tant qu'utilisateur
Je veux recevoir une notification
Afin d'être informé d'une nouvelle publication.

Module 2 : Administration
Gestion documentaire
CRUD :
Courrier arrivé
Courrier départ
Notes de service
Notes administratives
Circulaires

Gestion budgétaire
CRUD :
Projet budget
Note orientation
Budget réalisé

Gestion RH
CRUD :
Personnel administratif
Enseignants
Tuteurs

User Stories
US-ADM-001
En tant qu'administratif
Je veux enregistrer un courrier entrant
Afin de l'archiver.

Module 3 : Appui à l'Insertion
Gestion étudiants
Registre contacts
Bilan de stages
Gestion partenaires
Entreprises partenaires
Conventions
Statistiques
Auto-emploi
Emploi salarié

User Stories
US-INS-001
En tant qu'agent insertion
Je veux enregistrer un stage
Afin d'assurer le suivi de l'étudiant.

Module 4 : Formations
Gestion des formations
Champs :
Intitulé
Date début
Date fin
Niveau
Type formation
Financement
Nombre hommes
Nombre femmes

Emploi du temps
Création
Modification
Consultation

Gestion des formateurs
Enseignants
Enseignants associés
Tuteurs

Réunions
Préparation cours
Préparation évaluations
Suivi tutorat

User Stories
US-FOR-001
En tant que responsable formation
Je veux créer une formation
Afin de l'affecter aux étudiants.

Module 5 : Étudiants
Données Étudiant
INE
Nom
Prénom
Date naissance
Formation
Promotion
Année début
Année sortie
Diplômes
Autres formations

User Stories
US-ETU-001
En tant qu'étudiant
Je veux consulter mon dossier
Afin de suivre mon parcours universitaire.

Exigences Non Fonctionnelles
Sécurité
JWT
RBAC (Role Based Access Control)
Chiffrement des mots de passe avec BCrypt
Journalisation des actions
Performance
Temps de réponse < 2 secondes
Pagination des listes
Cache des données fréquemment utilisées
Disponibilité
99 % uptime
Scalabilité
Architecture modulaire
Préparation microservices

MVP Recommandé pour l'Examen
Pour maximiser les points dans le temps imparti :
Priorité 1
Authentification
Gestion rôles
Gestion étudiants
Gestion formations
Priorité 2
Communication
Gestion documentaire
Priorité 3
Appui insertion
Budget
Statistiques
Priorité 4
Export PDF/Excel

