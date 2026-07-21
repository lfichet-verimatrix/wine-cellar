/**
 * French wine regions mapping.
 * Maps major wine regions to their sub-regions/appellations.
 * Used for coloring the map and filtering wines by region.
 */

const FRENCH_WINE_REGIONS = {
  'Bordeaux': {
    id: 'bordeaux',
    subRegions: [
      'Haut-Médoc', 'Médoc', 'Saint-Estèphe', 'Pauillac', 'Saint-Julien',
      'Margaux', 'Moulis', 'Listrac', 'Graves', 'Pessac-Léognan',
      'Sauternes', 'Barsac', 'Saint-Émilion', 'Pomerol', 'Fronsac',
      'Canon-Fronsac', 'Lalande-de-Pomerol', 'Côtes de Bordeaux',
      'Entre-Deux-Mers', 'Blaye', 'Bourg', 'Côtes de Bourg',
      'Premières Côtes de Bordeaux', 'Cadillac', 'Loupiac', 'Cérons',
    ],
  },
  'Bourgogne': {
    id: 'bourgogne',
    subRegions: [
      'Chablis', 'Côte de Nuits', 'Côte de Beaune', 'Côte Chalonnaise',
      'Mâconnais', 'Gevrey-Chambertin', 'Chambolle-Musigny', 'Vosne-Romanée',
      'Nuits-Saint-Georges', 'Pommard', 'Volnay', 'Meursault',
      'Puligny-Montrachet', 'Chassagne-Montrachet', 'Corton',
      'Beaune', 'Mercurey', 'Givry', 'Rully', 'Montagny',
      'Pouilly-Fuissé', 'Saint-Véran', 'Mâcon',
    ],
  },
  'Champagne': {
    id: 'champagne',
    subRegions: [
      'Montagne de Reims', 'Vallée de la Marne', 'Côte des Blancs',
      'Côte des Bar', 'Aube', 'Reims', 'Épernay',
    ],
  },
  'Vallée du Rhône': {
    id: 'rhone',
    subRegions: [
      'Côte-Rôtie', 'Condrieu', 'Saint-Joseph', 'Hermitage',
      'Crozes-Hermitage', 'Cornas', 'Saint-Péray',
      'Châteauneuf-du-Pape', 'Gigondas', 'Vacqueyras',
      'Côtes du Rhône', 'Côtes du Rhône Villages', 'Lirac',
      'Tavel', 'Beaumes-de-Venise', 'Ventoux', 'Luberon',
      'Costières de Nîmes',
    ],
  },
  'Loire': {
    id: 'loire',
    subRegions: [
      'Muscadet', 'Anjou', 'Saumur', 'Saumur-Champigny',
      'Savennières', 'Coteaux du Layon', 'Bonnezeaux', 'Quarts de Chaume',
      'Chinon', 'Bourgueil', 'Saint-Nicolas-de-Bourgueil',
      'Vouvray', 'Montlouis', 'Touraine',
      'Sancerre', 'Pouilly-Fumé', 'Menetou-Salon', 'Quincy', 'Reuilly',
    ],
  },
  'Alsace': {
    id: 'alsace',
    subRegions: [
      'Alsace Grand Cru', 'Crémant d\'Alsace',
      'Riesling', 'Gewurztraminer', 'Pinot Gris',
      'Muscat d\'Alsace', 'Pinot Blanc', 'Sylvaner',
    ],
  },
  'Beaujolais': {
    id: 'beaujolais',
    subRegions: [
      'Morgon', 'Fleurie', 'Moulin-à-Vent', 'Chiroubles',
      'Juliénas', 'Saint-Amour', 'Chénas', 'Brouilly',
      'Côte de Brouilly', 'Régnié', 'Beaujolais-Villages',
    ],
  },
  'Languedoc': {
    id: 'languedoc',
    subRegions: [
      'Corbières', 'Minervois', 'Fitou', 'Faugères', 'Saint-Chinian',
      'Pic Saint-Loup', 'Terrasses du Larzac', 'La Clape',
      'Coteaux du Languedoc', 'Limoux', 'Blanquette de Limoux',
      'Cabardès', 'Malepère',
    ],
  },
  'Roussillon': {
    id: 'roussillon',
    subRegions: [
      'Côtes du Roussillon', 'Côtes du Roussillon Villages',
      'Collioure', 'Banyuls', 'Maury', 'Rivesaltes',
      'Muscat de Rivesaltes',
    ],
  },
  'Provence': {
    id: 'provence',
    subRegions: [
      'Bandol', 'Cassis', 'Palette', 'Bellet',
      'Côtes de Provence', 'Coteaux d\'Aix-en-Provence',
      'Coteaux Varois en Provence',
    ],
  },
  'Sud-Ouest': {
    id: 'sud-ouest',
    subRegions: [
      'Cahors', 'Madiran', 'Jurançon', 'Bergerac', 'Monbazillac',
      'Pécharmant', 'Buzet', 'Fronton', 'Gaillac', 'Marcillac',
      'Irouléguy', 'Côtes de Duras', 'Côtes du Marmandais',
    ],
  },
  'Jura': {
    id: 'jura',
    subRegions: [
      'Arbois', 'Côtes du Jura', 'Château-Chalon', 'L\'Étoile',
      'Crémant du Jura', 'Vin Jaune', 'Vin de Paille',
    ],
  },
  'Savoie': {
    id: 'savoie',
    subRegions: [
      'Vin de Savoie', 'Roussette de Savoie', 'Crépy', 'Seyssel',
      'Chignin', 'Apremont', 'Abymes',
    ],
  },
  'Corse': {
    id: 'corse',
    subRegions: [
      'Patrimonio', 'Ajaccio', 'Vin de Corse',
      'Muscat du Cap Corse', 'Calvi', 'Figari', 'Porto-Vecchio', 'Sartène',
    ],
  },
};

/**
 * Find the parent region for a given region/sub-region name.
 * Case-insensitive matching.
 * @param {string} regionName - The region or sub-region name from a wine
 * @returns {string|null} The parent region key, or null if no match
 */
export function findParentRegion(regionName) {
  if (!regionName) return null;
  const normalized = regionName.trim().toLowerCase();

  // Check if it's a top-level region name
  for (const [region, data] of Object.entries(FRENCH_WINE_REGIONS)) {
    if (region.toLowerCase() === normalized || data.id === normalized) {
      return region;
    }
  }

  // Check sub-regions
  for (const [region, data] of Object.entries(FRENCH_WINE_REGIONS)) {
    for (const sub of data.subRegions) {
      if (sub.toLowerCase() === normalized) {
        return region;
      }
    }
  }

  return null;
}

/**
 * Get all region names (top-level + sub-regions) that belong to a given parent region.
 * Used for filtering wines when a region is clicked on the map.
 * @param {string} regionKey - The top-level region key (e.g., 'Bordeaux')
 * @returns {string[]} Array of region names to match against
 */
export function getRegionFilterValues(regionKey) {
  const region = FRENCH_WINE_REGIONS[regionKey];
  if (!region) return [];
  return [regionKey, ...region.subRegions];
}

/**
 * Determine which regions are represented in a list of wines.
 * @param {Array} wines - Array of wine objects with a `region` field
 * @returns {Set<string>} Set of top-level region keys that have at least one wine
 */
export function getActiveRegions(wines) {
  const active = new Set();
  for (const wine of wines) {
    const parent = findParentRegion(wine.region);
    if (parent) {
      active.add(parent);
    }
  }
  return active;
}

export default FRENCH_WINE_REGIONS;
