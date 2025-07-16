<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dashboard Visiteurs</title>
  <link rel="icon" href="assets/img/dashboard.svg" type="image/svg+xml" />
 <link rel="stylesheet" href="../application/assets/styles.css"></head>
<body>
  <header>
    <div class="dashboard-navbar" id="historiqueContainer">
        <h1>Visiteurs actuellement dans le bâtiment</h1>
        <a href="historique.php" class="navbar-btnLogin" id="voirHistorique">📄 Voir l'historique</a>
        <button class="refresh-btn">🔄 Rafraîchir</button>
    </div>
  </header>
  <main class="dashboard-container">
    <input type="text" class="search-bar" placeholder="Recherche par nom, email ou formation..." />
    <table>
      <thead>
        <tr>
          <th>NOM</th>
          <th>PRÉNOM</th>
          <th>TYPE</th>
          <th>DÉTAIL</th>
          <th>HEURE ENTRÉE</th>
          <th>LOCAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Dupont</strong></td>
          <td>Claire</td>
          <td><span class="badge visite">Visite</span></td>
          <td>Mme Martin</td>
          <td>09:15</td>
          <td>B104</td>
        </tr>
        <tr>
          <td><strong>Nguyen</strong></td>
          <td>Lucas</td>
          <td><span class="badge formation">Formation</span></td>
          <td>Introduction à Python</td>
          <td>10:00</td>
          <td>Salle 12</td>
        </tr>
      </tbody>
    </table>
  </main>
</body>
</html>
