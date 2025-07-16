<?php

require_once __DIR__ . '/config.php'; 
require_once __DIR__ . '/api/visiteurs.php'; 

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($username === 'admin' && $password === 'pass') {
        $_SESSION['is_admin'] = true;

        header('Location: dashboard.php');
        exit;
    } else {
        $error = "Identifiants incorrects";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Connexion Admin</title>
  <link rel="stylesheet" href="../application/assets/styles.css">
</head>
<body>

<form class="login" method="post" action="">
  <input name="username" placeholder="Nom d'utilisateur" required autocomplete="username" />
  <input type="password" name="password" placeholder="Mot de passe" required autocomplete="current-password" />
  <button type="submit">Connexion</button>
  <?php if (!empty($error)): ?>
    <p class="error-message"><?= htmlspecialchars($error) ?></p>
  <?php endif; ?>
</form>

</body>
</html>
