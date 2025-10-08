import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompanyPayload {
  companyName: string;
  mailing: {
    address1?: string; address2?: string; city?: string; state?: string; postalCode?: string; country?: string;
  };
  physical: {
    address1?: string; address2?: string; city?: string; state?: string; postalCode?: string; country?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private baseUrl = '/api/company';
  constructor(private http: HttpClient) {}

  getCompany(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  upsertCompany(payload: CompanyPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }
}
