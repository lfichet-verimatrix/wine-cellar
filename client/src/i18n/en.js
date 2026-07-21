const en = {
  // App
  appTitle: 'Wine Cellar',
  appSubtitle: 'Manage your personal wine collection',

  // Actions
  addWine: '+ Add Wine',
  addFirstWine: '+ Add Your First Wine',
  edit: '✏️ Edit',
  delete: '🗑️ Delete',
  cancel: 'Cancel',
  updateWine: 'Update Wine',
  addWineSubmit: 'Add Wine',
  retry: 'Retry',
  clearFilters: '✕ Clear filters',

  // Modal titles
  addNewWine: 'Add New Wine',
  editWine: 'Edit Wine',

  // Stats
  bottlesInCellar: 'Bottles in Cellar',
  estimatedValue: 'Estimated Value',
  totalEntries: 'Total Entries',
  byType: 'By Type',

  // Wine types
  'type.Red': 'Red',
  'type.White': 'White',
  'type.Rosé': 'Rosé',
  'type.Sparkling': 'Sparkling',
  'type.Dessert': 'Dessert',
  'type.Fortified': 'Fortified',

  // Wine statuses
  'status.In Cellar': 'In Cellar',
  'status.Consumed': 'Consumed',
  'status.Wishlist': 'Wishlist',

  // Filter
  allTypes: 'All Types',
  allStatuses: 'All Statuses',
  searchPlaceholder: 'Search by name or producer...',

  // Wine card
  bottle: 'bottle',
  bottles: 'bottles',
  ratingLabel: '{rating} out of 5 stars',
  deleteConfirm: 'Delete "{name}"?',

  // Wine form fields
  'field.name': 'Name',
  'field.producer': 'Producer',
  'field.type': 'Type',
  'field.vintage': 'Vintage',
  'field.grape': 'Grape Variety',
  'field.region': 'Region',
  'field.country': 'Country',
  'field.status': 'Status',
  'field.quantity': 'Quantity',
  'field.price': 'Price',
  'field.rating': 'Rating (1–5)',
  'field.notes': 'Notes',

  // Form placeholders
  'placeholder.name': 'e.g. Château Margaux 2015',
  'placeholder.producer': 'e.g. Château Margaux',
  'placeholder.type': 'Select type...',
  'placeholder.vintage': 'e.g. 2020',
  'placeholder.grape': 'e.g. Cabernet Sauvignon',
  'placeholder.region': 'e.g. Bordeaux',
  'placeholder.country': 'e.g. France',
  'placeholder.quantity': '1',
  'placeholder.price': '0.00',
  'placeholder.rating': '—',
  'placeholder.notes': 'Tasting notes, pairing suggestions...',

  // Validation errors
  'error.nameRequired': 'Name is required',
  'error.nameMax': 'Name cannot exceed 200 characters',
  'error.producerRequired': 'Producer is required',
  'error.producerMax': 'Producer cannot exceed 200 characters',
  'error.vintageRange': 'Vintage must be between 1900 and {max}',
  'error.typeRequired': 'Type is required',
  'error.grapeMax': 'Grape cannot exceed 200 characters',
  'error.regionMax': 'Region cannot exceed 200 characters',
  'error.countryMax': 'Country cannot exceed 100 characters',
  'error.quantityInvalid': 'Quantity must be a non-negative integer',
  'error.priceInvalid': 'Price must be a non-negative number',
  'error.ratingInvalid': 'Rating must be between 1 and 5',
  'error.notesMax': 'Notes cannot exceed 2000 characters',

  // Empty / loading states
  loadingWines: 'Loading wines...',
  noWinesMatch: 'No wines match your filters',
  cellarEmpty: 'Your cellar is empty',
  tryAdjustingFilters: 'Try adjusting or clearing your filters.',
  addFirstWinePrompt: 'Add your first wine to get started!',

  // Map
  wineRegions: 'Wine Regions',
  inCellar: 'In cellar',
  noWines: 'No wines',
  clearRegionFilter: 'Clear region filter',

  // Language
  language: 'Language',
};

export default en;
