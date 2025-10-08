import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

export interface SecuritySettingsPayload {
  enable2fa: boolean;
  twoFactorMethod?: 'email' | 'sms';
}

export interface SecuritySettings {
  enable2fa: boolean;
  twoFactorMethod: 'email' | 'sms';
}

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private baseUrl = '/api/security';
  
  constructor(private http: HttpClient) {}

  getSecuritySettings(): Observable<SecuritySettings | null> {
    return this.http.get<SecuritySettings | null>(`${this.baseUrl}/settings`);
  }

  updateSecuritySettings(payload: SecuritySettingsPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/settings`, payload);
  }

  changePassword(payload: PasswordChangePayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/change-password`, payload);
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Minimum 8 characters
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    // At least one number
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    // At least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async login(password: string): Promise<true | 'setup' | false> {
    // Check if password exists in DB
    const settings: any = await this.getSecuritySettings().toPromise();
    if (!settings || typeof settings.hasPassword === 'undefined' || !settings.hasPassword) {
      return 'setup';
    }
    // Validate password with backend
    try {
      const result = await this.http.post<any>(`${this.baseUrl}/login`, { password }).toPromise();
      if (result && result.token) {
        localStorage.setItem('jwtToken', result.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async setInitialPassword(newPassword: string): Promise<any> {
    // Set initial password in backend
    const result = await this.http.post<any>(`${this.baseUrl}/set-password`, { password: newPassword }).toPromise();
    return result;
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;
    try {
      const result = await this.http.post<any>(`${this.baseUrl}/verify-token`, { token }).toPromise();
      return result && result.valid;
    } catch {
      return false;
    }
  }
}