// ==============================
// 1. CONFIG API COCKPIT
// ==============================
const isLocal = window.location.hostname === 'localhost';
const COCKPIT_API_URL = isLocal 
  ? 'http://localhost:8888/cockpit-core/api/' 
  : 'https://ton-backend-distant.com/cockpit-core/api/';

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
      const response = await fetch('http://localhost:8888/cockpit-core/api/content/item/Formations', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COCKPIT_API_TOKEN}`
      },
      });
      const data = await response.json();

      if(data.entries && data.entries.length > 0) {
        data.entries.forEach(formation => {
          const option = document.createElement('option');
          option.value = formation._id;
          option.textContent = formation.title || formation.name || 'Formations';
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
