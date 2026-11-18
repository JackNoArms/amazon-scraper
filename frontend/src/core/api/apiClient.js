export class ApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL.replace(/\/$/, '');
  }
  async scrapeProducts(keyword, page = 1) {
    const params = new URLSearchParams({ keyword, page: String(page) });
    let response;
    try {
      response = await fetch(this.baseURL + '/api/scrape?' + params.toString(), {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new Error('Não foi possível conectar à API local. Verifique se o backend está ligado.');
    }
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(typeof result.message === 'string' ? result.message : 'Falha ao consultar produtos.');
    }
    if (!result || !Array.isArray(result.products)) {
      throw new Error('Resposta inesperada da API.');
    }
    return result;
  }
}
