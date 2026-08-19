// API service — calls CareerOS FastAPI backend.
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

/** Call /jobs/search and return raw normalized postings + match scores. */
export async function searchJobs({
  query,
  location = '',
  employment_type = '',
  remote = '',
  experience_level = '',
  salary_min = '',
  salary_max = '',
  posted_within_days = '',
  sources = [],
  top_k = 20,
  llm_provider,
  model_name,
}) {
  // Map frontend filter fields to backend SearchRequest schema
  const payload = {
    query: query?.trim() || '',
    location: location?.trim() || (location ? location.trim() : undefined),
    employment_type: employment_type || undefined,
    experience_level: experience_level && experience_level !== 'Any' ? experience_level.toLowerCase() : undefined,
    // Backend expects remote_only: true for remote-only filter
    remote_only: remote === 'remote' ? true : false,
    min_salary: salary_min ? Number(salary_min) : undefined,
    posted_within_days: posted_within_days ? Number(posted_within_days) : undefined,
    llm_provider: llm_provider || undefined,
    model_name: model_name || undefined,
  };

  const r = await fetch(`${BASE}/jobs/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': crypto.randomUUID()
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Search failed: ${r.status}`);

  const data = await r.json();
  // Backend returns array directly, handle both array and object with results
  return Array.isArray(data) ? data : (data.results || []);
}

/** Run full match pipeline for a query. */
export async function matchJobs(payload) {
  const r = await fetch(`${BASE}/jobs/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Request-ID': crypto.randomUUID() },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Match failed: ${r.status}`);
  return r.json();
}

/** Fetch a single job by id. */
export async function getJob(id) {
  const r = await fetch(`${BASE}/jobs/${id}`);
  if (!r.ok) throw new Error(`Get job failed: ${r.status}`);
  return r.json();
}

/** Verify a posting is still live. */
export async function verifyJob(id) {
  const r = await fetch(`${BASE}/jobs/${id}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Request-ID': crypto.randomUUID() },
  });
  if (!r.ok) throw new Error(`Verify failed: ${r.status}`);
  return r.json();
}

export const API_BASE = BASE;