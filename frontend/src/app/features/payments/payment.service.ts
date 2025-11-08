import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentParty {
  id: number;
  name: string;
  company?: string | null;
  email?: string | null;
  contact?: string | null;
}

export interface PaymentInvoiceSummary {
  id: number;
  invoiceNumber: string;
  status?: string | null;
  total?: number | null;
  customerName?: string | null;
}

export interface Payment {
  id?: number;
  amount: number;
  date: string;
  paymentMethod?: string | null;
  referenceNumber?: string | null;
  notes?: string | null;
  invoiceId?: number | null;
  vendorId?: number | null;
  customerId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  invoice?: PaymentInvoiceSummary | null;
  vendor?: PaymentParty | null;
  customer?: PaymentParty | null;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = '/api/payments';

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${payment.id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
