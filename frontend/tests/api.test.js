import api from '../src/services/api.js';

describe('api (frontend)', () => {
  beforeEach(() => {
    // reset localStorage stub
    global.localStorage?.clear?.();
    if (!global.localStorage) {
      global.localStorage = {
        _store: {},
        getItem(key) { return this._store[key] ?? null; },
        setItem(key, val) { this._store[key] = val; },
        removeItem(key) { delete this._store[key]; },
        clear() { this._store = {}; }
      };
    }
  });

  it('tem baseURL padrão para localhost quando variável não definida', () => {
    // axios instance guarda base url em defaults.baseURL
    expect(api.defaults.baseURL).toBe('http://localhost:3000');
  });

  it('interceptor de request anexa Authorization quando token presente', async () => {
    localStorage.setItem('token', 'abc123');

    // axios armazena handlers em interceptors.request.handlers
    const handlers = api.interceptors?.request?.handlers;
    expect(Array.isArray(handlers)).toBe(true);
    const fulfilled = handlers[0].fulfilled;

    const config = { headers: {} };
    const out = await fulfilled(config);
    expect(out.headers.Authorization).toBe('Bearer abc123');
  });
});
