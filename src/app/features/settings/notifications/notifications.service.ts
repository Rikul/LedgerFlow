import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationSettingsPayload {
  enableEmail: boolean;
  emailAddress?: string;
  enableSms: boolean;
  phoneNumber?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationSettingsService {
  private baseUrl = '/api/notification-settings';
  
  constructor(private http: HttpClient) {}

  getNotificationSettings(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  upsertNotificationSettings(payload: NotificationSettingsPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }
}