const API_ORIGIN = 'https://carpidi-api-a3w662uxxq-uc.a.run.app/api/v1';
const HOP_BY_HOP_HEADERS = new Set([
  'connection', 'content-length', 'host', 'origin', 'referer', 'transfer-encoding',
]);

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Idempotency-Key');
  response.setHeader('Access-Control-Expose-Headers', 'Location');
  response.setHeader('Vary', 'Origin');
}

export default async function handler(request, response) {
  setCorsHeaders(response);
  if (request.method === 'OPTIONS') return response.status(204).end();

  const segments = Array.isArray(request.query.path) ? request.query.path : [request.query.path];
  const target = `${API_ORIGIN}/${segments.filter(Boolean).map(encodeURIComponent).join('/')}`;
  const headers = Object.fromEntries(Object.entries(request.headers)
    .filter(([name]) => !HOP_BY_HOP_HEADERS.has(name.toLowerCase())));
  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody && request.body !== undefined
      ? (typeof request.body === 'string' ? request.body : JSON.stringify(request.body))
      : undefined,
  });

  for (const header of ['content-type', 'location']) {
    const value = upstream.headers.get(header);
    if (value) response.setHeader(header, value);
  }
  const payload = Buffer.from(await upstream.arrayBuffer());
  return response.status(upstream.status).send(payload);
}
