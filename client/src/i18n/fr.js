const fr = {
  // App
  appTitle: 'Cave à Vins',
  appSubtitle: 'Gérez votre collection personnelle de vins',

  // Actions
  addWine: '+ Ajouter un vin',
  addFirstWine: '+ Ajouter votre premier vin',
  edit: '✏️ Modifier',
  delete: '🗑️ Supprimer',
  cancel: 'Annuler',
  updateWine: 'Mettre à jour',
  addWineSubmit: 'Ajouter',
  retry: 'Réessayer',
  clearFilters: '✕ Effacer les filtres',

  // Modal titles
  addNewWine: 'Ajouter un vin',
  editWine: 'Modifier le vin',

  // Stats
  bottlesInCellar: 'Bouteilles en cave',
  estimatedValue: 'Valeur estimée',
  totalEntries: 'Total des entrées',
  byType: 'Par type',

  // Wine types
  'type.Red': 'Rouge',
  'type.White': 'Blanc',
  'type.Rosé': 'Rosé',
  'type.Sparkling': 'Effervescent',
  'type.Dessert': 'Liquoreux',
  'type.Fortified': 'Muté',

  // Wine statuses
  'status.In Cellar': 'En cave',
  'status.Consumed': 'Consommé',
  'status.Wishlist': 'Liste de souhaits',

  // Filter
  allTypes: 'Tous les types',
  allStatuses: 'Tous les statuts',
  searchPlaceholder: 'Rechercher par nom ou producteur...',

  // Wine card
  bottle: 'bouteille',
  bottles: 'bouteilles',
  ratingLabel: '{rating} sur 5 étoiles',
  deleteConfirm: 'Supprimer « {name} » ?',

  // Wine form fields
  'field.name': 'Nom',
  'field.producer': 'Producteur',
  'field.type': 'Type',
  'field.vintage': 'Millésime',
  'field.grape': 'Cépage',
  'field.region': 'Région',
  'field.country': 'Pays',
  'field.status': 'Statut',
  'field.quantity': 'Quantité',
  'field.price': 'Prix',
  'field.rating': 'Note (1–5)',
  'field.notes': 'Notes',

  // Form placeholders
  'placeholder.name': 'ex. Château Margaux 2015',
  'placeholder.producer': 'ex. Château Margaux',
  'placeholder.type': 'Sélectionner un type...',
  'placeholder.vintage': 'ex. 2020',
  'placeholder.grape': 'ex. Cabernet Sauvignon',
  'placeholder.region': 'ex. Bordeaux',
  'placeholder.country': 'ex. France',
  'placeholder.quantity': '1',
  'placeholder.price': '0,00',
  'placeholder.rating': '—',
  'placeholder.notes': 'Notes de dégustation, accords mets-vins...',

  // Validation errors
  'error.nameRequired': 'Le nom est requis',
  'error.nameMax': 'Le nom ne peut pas dépasser 200 caractères',
  'error.producerRequired': 'Le producteur est requis',
  'error.producerMax': 'Le producteur ne peut pas dépasser 200 caractères',
  'error.vintageRange': 'Le millésime doit être entre 1900 et {max}',
  'error.typeRequired': 'Le type est requis',
  'error.grapeMax': 'Le cépage ne peut pas dépasser 200 caractères',
  'error.regionMax': 'La région ne peut pas dépasser 200 caractères',
  'error.countryMax': 'Le pays ne peut pas dépasser 100 caractères',
  'error.quantityInvalid': 'La quantité doit être un entier positif ou zéro',
  'error.priceInvalid': 'Le prix doit être un nombre positif ou zéro',
  'error.ratingInvalid': 'La note doit être entre 1 et 5',
  'error.notesMax': 'Les notes ne peuvent pas dépasser 2000 caractères',

  // Empty / loading states
  loadingWines: 'Chargement des vins...',
  noWinesMatch: 'Aucun vin ne correspond à vos filtres',
  cellarEmpty: 'Votre cave est vide',
  tryAdjustingFilters: 'Essayez d\'ajuster ou d\'effacer vos filtres.',
  addFirstWinePrompt: 'Ajoutez votre premier vin pour commencer !',

  // Map
  wineRegions: 'Régions viticoles',
  inCellar: 'En cave',
  noWines: 'Pas de vins',
  clearRegionFilter: 'Effacer le filtre de région',

  // Language
  language: 'Langue',
};

export default fr;
