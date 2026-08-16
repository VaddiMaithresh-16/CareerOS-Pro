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
  const url = new URL(`${BASE}/jobs/search`);
  const params = {
    query,
    top_k,
    location: location || 'India',
    employment_type: employment_type || undefined,
    remote: remote && remote !== 'any' ? remote : undefined,
    experience_level: experience_level && experience_level !== 'Any' ? experience_level : undefined,
    salary_min: salary_min || undefined,
    salary_max: salary_max || undefined,
    posted_within_days: posted_within_days || undefined,
    llm_provider: llm_provider || undefined,
    model_name: model_name || undefined,
  };
  if (Array.isArray(sources) && sources.length) {
    params.sources = sources.join(',');
  }
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && v !== null && url.searchParams.set(k, v));
  const r = await fetch(url, { method: 'GET', headers: { 'X-Request-ID': crypto.randomUUID() } });
  if (!r.ok) throw new Error(`Search failed: ${r.status}`);
  return r.json();
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
  const r = await fetch(`${BASE}/jobs/${id}/verify`, { method: 'POST' });
  if (!r.ok) throw new Error(`Verify failed: ${r.status}`);
  return r.json();
}

export const API_BASE = BASE;