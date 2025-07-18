<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Historique des visites</title>
  <link rel="icon" href="assets/img/historique.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="../application/assets/styles.css">
</head>
<body>

  <div class="container">
    <div class="header">
      <h2>📅 Historique des visites</h2>
      <a href="dashboard.php" class="back-link">← Retour au dashboard</a>
    </div>

    <div class="controls">
      <label for="date">Choisissez une date :</label>
      <input type="date" id="date" />
      <button class="btn-primary">Afficher</button>
      <button class="btn-export">🧾 Exporter en CSV</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>NOM</th>
            <th>PRÉNOM</th>
            <th>TYPE</th>
            <th>DÉTAIL</th>
            <th>DATE</th>
            <th>ENTRÉE</th>
            <th>SORTIE</th>
            <th>LOCAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Durand</strong></td>
            <td>Alice</td>
            <td><span class="badge visite">Visite</span></td>
            <td>M. Lefevre</td>
            <td>12/07</td>
            <td>08:45</td>
            <td>10:00</td>
            <td>B203</td>
          </tr>
          <tr>
            <td><strong>Ziani</strong></td>
            <td>Karim</td>
            <td><span class="badge formation">Formation</span></td>
            <td>Excel Avancé</td>
            <td>12/07</td>
            <td>09:30</td>
            <td>16:30</td>
            <td>Salle 5</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</body>
</html>
