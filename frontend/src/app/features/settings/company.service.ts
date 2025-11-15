import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface Company {
  id: number;
  name: string;
  contactEmail: string;
  companyPhone: string;
  mailing: Address;
  physical: Address;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  async getCompany() {
    return await lastValueFrom(this.http.get<Company>('/api/company'));
  }

  async saveCompany(company: Partial<Company>) {
    return await lastValueFrom(this.http.post('/api/company', company));
  }
}
