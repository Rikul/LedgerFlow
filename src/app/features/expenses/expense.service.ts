import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExpenseAssociation {
  id: number;
  name: string;
  company?: string | null;
  email?: string | null;
  contact?: string | null;
}

export interface Expense {
  id?: number;
  type: string;
  amount: number;
  date: string;
  paymentMethod?: string | null;
  referenceNumber?: string | null;
  description?: string | null;
  taxDeductible: boolean;
  vendorName?: string | null;
  vendorId?: number | null;
  customerId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  vendor?: ExpenseAssociation | null;
  customer?: ExpenseAssociation | null;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private apiUrl = '/api/expenses';

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  updateExpense(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${expense.id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
