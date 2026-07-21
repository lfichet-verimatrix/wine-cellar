const API_BASE = '/wines';

/**
 * Fetch all wines, optionally filtered by type, status, and/or search term.
 */
export async function fetchWines(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch wines');
  }
  const json = await res.json();
  return json.data;
}

/**
 * Fetch a single wine by ID.
 */
export async function fetchWineById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch wine');
  }
  const json = await res.json();
  return json.data;
}

/**
 * Create a new wine.
 */
export async function createWine(data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create wine');
  }
  const json = await res.json();
  return json.data;
}

/**
 * Update an existing wine by ID.
 */
export async function updateWine(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update wine');
  }
  const json = await res.json();
  return json.data;
}

/**
 * Delete a wine by ID.
 */
export async function deleteWine(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to delete wine');
  }
  const json = await res.json();
  return json.data;
}
