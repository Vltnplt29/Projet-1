// ==============================
// 1. CONFIG API COCKPIT
// ==============================
const isLocal = window.location.hostname === 'localhost';
const COCKPIT_API_URL = isLocal 
  ? 'http://localhost:8888/cockpit-core/api/' 
  : 'https://ton-backend-distant.com/cockpit-core/api/';
const COCKPIT_API_TOKEN = 'USR-b29b5c88b4490e79305a4526a213ee4ef9788415'

// ==============================
// 2. Onglets "Entrée / Sortie"
// ==============================
function showTab(event, id) {
  document.querySelectorAll('.navigation-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.navigation-text').forEach(tab => tab.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(id).classList.add('active');
}


// ==============================
// 3. Affichage conditionnel : catégorie
// ==============================
function updateContainersVisibility() {
  const formateurContainer = document.getElementById('visiteContainer');
  const formationContainer = document.getElementById('formationContainer');

  formateurContainer.classList.remove('active');
  formationContainer.classList.remove('active');

  const selected = document.querySelector('input[name="categorie"]:checked');
  if (!selected) return;

  if (selected.value === 'formateur') {
    formateurContainer.classList.add('active');
  } else if (selected.value === 'formation') {
    formationContainer.classList.add('active');
  }
}


// ==============================
// 4. API Cockpit – Enregistrer ou Récupérer
// ==============================
async function apiSaveItem(collection, data) {
  const url = `${COCKPIT_API_URL}content/item/${collection}`;
  console.log(collection)
  console.log(data)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COCKPIT_API_TOKEN}`
      },
      body: JSON.stringify({data: data} )
    });

    if (!response.ok) {
      console.error('API Error:', response.status, await response.text());
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('Fetch error (saveItem):', err);
    return null;
  }
}



async function apiGetItemById(collection, id) {
  const url = `${COCKPIT_API_URL}content/${collection}/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${COCKPIT_API_TOKEN}`
      }
    });

    if (!response.ok) {
      console.error('API Error (getItemById):', response.status, await response.text());
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('Fetch error (getItemById):', err);
    return null;
  }
}

  async function loadFormations() {
  const select = document.getElementById('formationSelect');

  try {
    const response = await fetch(`${COCKPIT_API_URL}content/items/Formations`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.entries && data.entries.length > 0) {
      data.entries.forEach(formation => {
        const option = document.createElement('option');
        option.value = formation._id;
        option.textContent = formation.titre || formation.title || formation.name || 'Formation';
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Erreur lors du chargement des formations:', err);
  }
}


  loadFormations();

// ==============================
// 5. Traitement formulaire : Entrée
// ==============================
async function traiterEntree(formData) {
  const nom = formData.nom?.trim() || '';
  const prenom = formData.prenom?.trim() || '';
  const email = formData.email?.trim() || '';
  const telephone = formData.telephone?.trim() || '';
  const categorie = formData.categorie || '';
  const formation = formData.formation || '';  // devrait contenir l'_id sélectionné dans le select
  const formateur = formData.formateur || '';  // pareil

  if (!nom || !prenom || !email || !categorie) {
    alert("Tous les champs obligatoires ne sont pas remplis.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("L'adresse email n'est pas valide.");
    return;
  }

  // Enregistrement visiteur (création d'un nouvel item Visiteurs)
  const visiteurResp = await apiSaveItem('Visiteurs', { nom, prenom, email, telephone });

  if (!visiteurResp || !visiteurResp._id) {
    alert("Erreur lors de l'enregistrement du visiteur.");
    return;
  }

  // Construire visiteData en incluant les Content Links correctement
  const visiteData = {
    visiteur: {
      _id: visiteurResp._id,
      collection: 'Visiteurs'
    },
    date_entree: new Date().toISOString().slice(0, 19).replace('T', ' '),
    categorie
  };

  if (categorie === 'formation') {
    if (!formation) {
      alert("Veuillez sélectionner une formation.");
      return;
    }
    visiteData.formation = {
      _id: formation,
      collection: 'Formations'
    };
  } else if (categorie === 'formateur') {
    if (!formateur) {
      alert("Veuillez sélectionner un formateur.");
      return;
    }
    visiteData.formateur = {
      _id: formateur,
      collection: 'Formateurs'
    };
  } else {
    alert("Catégorie invalide.");
    return;
  }

  // Enregistrement de la visite
  const visiteResp = await apiSaveItem('Visite', visiteData);

  if (!visiteResp || !visiteResp._id) {
    alert("Erreur lors de l'enregistrement de la visite.");
  } else {
    alert("Entrée enregistrée !");
    document.getElementById('formEntree').reset();
    updateContainersVisibility();
  }
}






// ==============================
// 6. Traitement formulaire : Sortie
// ==============================
async function traiterSortie(formData) {
  const id = formData.id?.trim();
  if (!id) {
    alert("ID visiteur requis.");
    return;
  }

  const visiteResp = await apiGetItemById('Visite', id);

  if (!visiteResp || !visiteResp.entries || visiteResp.entries.length === 0) {
    alert("Visite non trouvée.");
    return;
  }

  const visite = visiteResp.entries[0];
  if (visite.date_sortie) {
    alert("Sortie déjà enregistrée.");
    return;
  }

  visite.date_sortie = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const updateResp = await apiSaveItem('Visite', visite);

  if (!updateResp || !updateResp._id) {
    alert("Erreur de validation.");
  } else {
    alert("Sortie validée !");
    document.getElementById('formSortie').reset();
  }
}
// ==============================
// Nouvelle fonction : récupérer visite avec liens peuplés
// ==============================
async function getVisiteWithPopulate(id) {
  const url = `${COCKPIT_API_URL}content/item/Visite`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COCKPIT_API_TOKEN}`
      },
      body: JSON.stringify({
        filter: { _id: id },
        populate: [
          'visiteur',
          'formation',
          'formation.formateur',
          'formateur'
        ]
      })
    });
    if (!response.ok) {
      console.error('Erreur getVisiteWithPopulate:', response.status, await response.text());
      return null;
    }
    const data = await response.json();
    return data.entries?.[0] || null;
  } catch (err) {
    console.error('Fetch error (getVisiteWithPopulate):', err);
    return null;
  }
}

// ==============================
// Nouvelle fonction : affichage console des détails d'une visite
// ==============================
async function afficherDetailsVisite(id) {
  const visite = await getVisiteWithPopulate(id);
  if (!visite) {
    alert("Visite non trouvée.");
    return;
  }

  console.log("Visite complète :", visite);

  const nomVisiteur = visite.visiteur ? (visite.visiteur.nom + ' ' + visite.visiteur.prenom) : 'N/A';
  const titreFormation = visite.formation ? visite.formation.titre || visite.formation.name || 'N/A' : 'N/A';
  const nomFormateurDeFormation = visite.formation && visite.formation.formateur 
    ? (visite.formation.formateur.nom + ' ' + visite.formation.formateur.prenom)
    : 'N/A';
  const nomFormateurDirect = visite.formateur ? (visite.formateur.nom + ' ' + visite.formateur.prenom) : 'N/A';

  console.log("Visiteur :", nomVisiteur);
  console.log("Formation :", titreFormation);
  console.log("Formateur (via formation) :", nomFormateurDeFormation);
  console.log("Formateur (direct) :", nomFormateurDirect);
}
afficherDetailsVisite(id);

// ==============================
// Fonction générique pour charger une collection et remplir un select
// ==============================
async function loadCollectionIntoSelect(collectionName, selectId, formatOptionText) {
  const select = document.getElementById(selectId);
  if (!select) {
    console.error(`Select avec id "${selectId}" introuvable`);
    return;
  }

  try {
    const response = await fetch(`${COCKPIT_API_URL}content/items/${collectionName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${COCKPIT_API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} lors du chargement de ${collectionName}`);
    }

    const data = await response.json();

    if (data.entries && data.entries.length > 0) {
      // Option par défaut vide
      select.innerHTML = `<option value="">-- Sélectionner --</option>`;
      data.entries.forEach(item => {
        const option = document.createElement('option');
        option.value = item._id;
        option.textContent = formatOptionText(item);
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error(`Erreur chargement ${collectionName}:`, err);
  }
}

// ==============================
// Charger les formations
// ==============================
function formatFormationOption(item) {
  return item.titre || item.title || 'Formation sans titre';
}

// ==============================
// Charger les formateurs
// ==============================
function formatFormateurOption(item) {
  return `${item.nom || ''} ${item.prenom || ''}`.trim() || 'Formateur inconnu';
}

// ==============================
// 7. Initialisation
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  // Clic radios
  document.querySelectorAll('input[name="categorie"]').forEach(radio => {
    radio.addEventListener('change', updateContainersVisibility);
  });

  updateContainersVisibility(); // au chargement

  // Formulaires
  const formEntree = document.getElementById('formEntree');
  const formSortie = document.getElementById('formSortie');
  loadCollectionIntoSelect('Formations', 'formationSelect', formatFormationOption);
  loadCollectionIntoSelect('Formateurs', 'formateurSelect', formatFormateurOption);

  if (formEntree) {
    formEntree.addEventListener('submit', e => {
      e.preventDefault();
      traiterEntree(Object.fromEntries(new FormData(formEntree).entries()));
    });
  }

  if (formSortie) {
    formSortie.addEventListener('submit', e => {
      e.preventDefault();
      traiterSortie(Object.fromEntries(new FormData(formSortie).entries()));
    });
  }
});
