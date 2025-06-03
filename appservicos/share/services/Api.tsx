import { apiUrls } from '../settings/Settings';
import { DadosPaginados } from '../models/objects/DadosPaginados';
import { getSession } from './Auth';
import { RetornoDTO } from '../models/objects/RetornoDTO';
import { ObjetoUtilsService } from './ObjetoUtilsService';
import { RequestParams } from '../models/objects/RequestParams';

// class API {
//   async addAsyncRequestTransform(request: any, params?: RequestParams) {
//     const session = await getSession();

//     request.headers['Content-Type'] = 'application/json';
//     request.headers.Authorization = `Basic ZGlnaWZyZWQ6OX07ZUtYSiN3U0g2bFhWNU9CeCN4d3F9Z0JaSyZRIQ==`;
class API {
  async buildHeaders(params?: RequestParams): Promise<HeadersInit> {
    const session = await getSession();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ZGlnaWZyZWQ6OX07ZUtYSiN3U0g2bFhWNU9CeCN4d3F9Z0JaSyZRIQ==`,
    };

    if (params?.headers && (params.headers as Record<string, any>)['codigoentidade']) {
      headers['codigoentidade'] = (params.headers as Record<string, any>)['codigoentidade'];

    } else if (session?.cidade) {
      headers['codigoentidade'] = String(session.cidade.id);
    }

    if (session?.token) {
      headers['cpfcontribuinte'] = `${session.usuario.cpfCnpj}`;
    }

    if (params?.headers?.['g-recaptcha-response']) {
      headers['g-recaptcha-response'] = params.headers['g-recaptcha-response'];
    }

    if (session?.context) {
      headers['context'] = session.context;
    }
  
  return headers;
  }

  async request<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      const erro = await response.json().catch(() => ({}));
      throw erro;
    }

    return response.json();
  }

  async get<T>(
    classe: any,
    colunas = '',
    filtros = '',
    ordem = '',
    pagina = 0,
    tamanhoPagina = 100,
    params?: RequestParams
  ): Promise<DadosPaginados<T>> {
    const headers = await this.buildHeaders(params);
    const baseUrl = apiUrls[classe.api as keyof typeof apiUrls];

    const queryParams = new URLSearchParams({
      pagina: String(pagina),
      tamanho: String(tamanhoPagina),
    });
    if (colunas) queryParams.append('colunas', colunas);
    if (filtros) queryParams.append('filtros', filtros);
    if (ordem) queryParams.append('ordem', ordem);

    return this.request<DadosPaginados<T>>(`${baseUrl}${classe.endPoint}?${queryParams}`, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(
    classe: any,
    cadastro: T,
    params?: RequestParams
  ): Promise<RetornoDTO> {
    const headers = await this.buildHeaders(params);
    const baseUrl = apiUrls[classe.api as keyof typeof apiUrls];

    try {
      const data = await this.request<RetornoDTO | RetornoDTO[]>(`${baseUrl}${classe.endPoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(cadastro),
      });

      return Array.isArray(data) ? data[0] : data;
    } catch (erro: any) {
      const data = erro as RetornoDTO | RetornoDTO[];
      throw Array.isArray(data) ? data[0] : data;
    }
  }

  async postArray<T>(
    classe: any,
    cadastros: T[],
    params?: RequestParams
  ): Promise<RetornoDTO[]> {
    const headers = await this.buildHeaders(params);
    const baseUrl = apiUrls[classe.api as keyof typeof apiUrls];

    return this.request<RetornoDTO[]>(`${baseUrl}${classe.endPoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(cadastros),
    });
  }

  async delete(
    classe: any,
    id: number,
    params?: RequestParams
  ): Promise<RetornoDTO> {
    const headers = await this.buildHeaders(params);
    const baseUrl = apiUrls[classe.api as keyof typeof apiUrls];

    return this.request<RetornoDTO>(`${baseUrl}${classe.endPoint}/${id}`, {
      method: 'DELETE',
      headers,
    });
  }

  async deleteSelected(
    classe: any,
    cadastros: any[],
    params?: RequestParams
  ): Promise<RetornoDTO> {
    const headers = await this.buildHeaders(params);
    const baseUrl = apiUrls[classe.api as keyof typeof apiUrls];

    return this.request<RetornoDTO>(`${baseUrl}${classe.endPoint}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(cadastros),
    });
  }
}

const api = new API();
export default api;