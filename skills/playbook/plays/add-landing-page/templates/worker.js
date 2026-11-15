const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/waitlist') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
    }

    const { email } = await request.json().catch(() => ({}));
    const address = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (address.length > 254 || !EMAIL.test(address)) {
      return Response.json({ error: 'invalid email' }, { status: 400 });
    }

    // A repeat sign-up is a success: the address is already on the list.
    await env.DB.prepare('INSERT INTO signups (email) VALUES (?) ON CONFLICT (email) DO NOTHING')
      .bind(address)
      .run();
    return Response.json({ ok: true });
  },
};
