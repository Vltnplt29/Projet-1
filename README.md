===============================
    PROJET-1 - LOG ME 
===============================

Structure du projet :
---------------------
Ce projet est une application web destinée à gérer les entrées et sorties de visiteurs dans un bâtiment. Il est composé de :

1. Frontend (statique) – dans le dossier : application/
   - Formulaires d'entrée/sortie des visiteurs
   - Conçu pour être hébergé sur une plateforme statique (ex : Netlify)

2. Backend (PHP + Cockpit CMS) – dans le dossier : backend/
   - src/api/visiteurs.php : traitement des requêtes liées aux visites
   - src/config.php : configuration serveur/API
   - dashboard.php : vue synthétique des visites en cours
   - historique.php : historique complet des visites

3. CMS Headless – Cockpit (dans le dossier : cockpit-core/)
   - Gère les collections (Visiteurs, Visites, Formations)
   - Exposé via une API sécurisée par token

Fonctionnement :
----------------
- Le formulaire frontend envoie les données via `fetch()` à un backend PHP (`traitement.php`)
- Les données sont stockées dans Cockpit via son API REST
- Chaque visite est liée à un document `Visiteur` et à une `Formation`
- Une étiquette est générée à l’entrée avec les informations du visiteur :
  nom, prénom, téléphone, e-mail

Base de données :
-----------------
- Stockage dans Cockpit CMS (fichiers + base SQLite ou MySQL selon config)
- Collections utilisées :
  - Visiteurs
  - Visites
  - Formations
- Lien entre documents géré via "Content Link"

Installation locale :
---------------------
1. Copier le dossier `cockpit-core` dans le répertoire `htdocs/` de votre serveur local (MAMP/XAMPP)
2. S'assurer que les routes du backend (PHP) sont bien configurées
3. Lancer le serveur local et accéder à `index.html` dans `application/`
4. Tester les soumissions de formulaire depuis le frontend

Sécurité :
----------
- Les appels à l'API Cockpit sont authentifiés par token Bearer (non fourni ici)
- Les tokens doivent être stockés dans un fichier sécurisé (`config.php`)

Remarques :
-----------
- Pas de JavaScript côté serveur : rendu 100% SSR pour les pages PHP
- Aucune redirection de page après formulaire : tout est traité en AJAX
- Un système d’impression d’étiquette est prévu à l’entrée
- Projet évolutif : une couche d’authentification utilisateur peut être ajoutée

Auteur :
--------
Valentin Philippart  
Projet encadré dans le cadre d’une formation en développement web.
