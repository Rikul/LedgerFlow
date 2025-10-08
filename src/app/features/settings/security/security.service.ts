import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}