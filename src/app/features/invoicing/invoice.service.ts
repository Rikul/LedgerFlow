import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceLineItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  taxRate?: number;
}

export interface InvoiceCustomerSummary {
  id: number;
  name: string;
  email?: string;
  company?: string;
}

export interface Invoice {
  id?: number;
  invoiceNumber: string;
  customerId: number;
  status: InvoiceStatus;
  issueDate?: string;
  dueDate?: string;
  paymentTerms?: string;
  notes?: string;
  terms?: string;
  subtotal?: number;
  taxTotal?: number;
  discountTotal?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  lineItems: InvoiceLineItem[];
  customer?: InvoiceCustomerSummary | null;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiUrl = '/api/invoices';

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${invoice.id}`, invoice);
  }

  deleteInvoice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
