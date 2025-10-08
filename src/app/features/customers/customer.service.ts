import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  taxId?: string;
  paymentTerms: string;
  creditLimit?: number;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = '/api/customers';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  createCustomer(customer: Customer): Observable<any> {
    return this.http.post(this.apiUrl, customer);
  }

  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(`${this.apiUrl}/${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
