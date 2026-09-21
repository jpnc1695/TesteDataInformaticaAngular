import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ResultadoBusca {
  id: number;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class BuscaService {
  private readonly apiUrl = '/api/produtos';

  constructor(private readonly http: HttpClient) {}

  buscar(termo: string): Observable<ResultadoBusca[]> {
    const params = new HttpParams().set('q', termo);
    return this.http.get<ResultadoBusca[]>(this.apiUrl, { params });
  }
}

