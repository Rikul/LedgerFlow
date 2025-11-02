import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vendor {
  id?: number;
  company: string;
  contact?: string;
  email: string;
  phone?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  taxId?: string;
  paymentTerms: string;
  accountNumber?: string;
  category: string;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class VendorService {
  private apiUrl = '/api/vendors';

  constructor(private http: HttpClient) {}

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.apiUrl);
  }

  createVendor(vendor: Vendor): Observable<any> {
    return this.http.post(this.apiUrl, vendor);
  }

  updateVendor(vendor: Vendor): Observable<any> {
    return this.http.put(`${this.apiUrl}/${vendor.id}`, vendor);
  }

  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}