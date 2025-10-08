import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TaxSettingsPayload {
  org: {
    entityType: string;
    taxId?: string;
    country?: string;
    region?: string;
  };
  defaultTaxRate: number;
  rates: Array<{
    name: string;
    rate: number;
    compound: boolean;
  }>;
}

@Injectable({ providedIn: 'root' })
export class TaxSettingsService {
  private baseUrl = '/api/tax-settings';
  
  constructor(private http: HttpClient) {}

  getTaxSettings(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  upsertTaxSettings(payload: TaxSettingsPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }
}