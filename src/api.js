import { pool } from './lib/cognito';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');

function getToken() {
  return new Promise((resolve, reject) => {
    const user = pool.getCurrentUser();
    if (!user) return reject(new Error('Not authenticated'));
    user.getSession((err, session) => {
      if (err || !session?.isValid()) return reject(err ?? new Error('Session expired'));
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

async function req(method, path, body) {
  const token = await getToken();
  const init = {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Recipes — PUT used for both create and update (upsert with client-generated id)
export const getRecipes   = ()  => req('GET', '/recipes');
export const saveRecipe   = (r) => req('PUT', `/recipes/${r.id}`, r);
export const removeRecipe = (id) => req('DELETE', `/recipes/${id}`);

// Pantry
export const getPantry = ()      => req('GET', '/pantry');
export const putPantry = (items) => req('PUT', '/pantry', { ingredients: items });

// Planner — no date params returns all entries
export const getPlanner    = ()          => req('GET', '/planner');
export const putPlannerDay = (date, day) => req('PUT', `/planner/${date}`, day);

// Shopping
export const getShopping = ()      => req('GET', '/shopping');
export const putShopping = (items) => req('PUT', '/shopping', { items });
