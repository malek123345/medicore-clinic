import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import * as signalR from '@microsoft/signalr';
import { firstValueFrom } from 'rxjs';

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionData?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly API = 'http://localhost:5000/api/notifications';

  notifications = signal<Notification[]>([]);
  unreadCount   = signal(0);

  private hubConnection: signalR.HubConnection | null = null;
  private logoutCallback = () => this.reset();

  async init() {
    // ✅ ما تزيدش callback مرتين
    if (!this.auth.logoutCallbacks.includes(this.logoutCallback)) {
      this.auth.logoutCallbacks.push(this.logoutCallback);
    }
    await this.loadNotifications();
    await this.startSignalR();
  }

  reset() {
    this.notifications.set([]);
    this.unreadCount.set(0);
    this.disconnect();
    this.hubConnection = null;
  }

  private async loadNotifications() {
    try {
      const data = await firstValueFrom(
        this.http.get<Notification[]>(this.API)
      );
      this.notifications.set(data);
      this.unreadCount.set(data.filter(n => !n.isRead).length);
    } catch {}
  }

  private async startSignalR() {
    const token = this.auth.getToken();
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/notifications', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notif: Notification) => {
      this.notifications.update(list => [notif, ...list]);
      this.unreadCount.update(c => c + 1);
    });

    try {
      await this.hubConnection.start();
    } catch (err) {
      console.error('SignalR error:', err);
    }
  }

  async markRead(id: number) {
    try {
      await firstValueFrom(this.http.put(`${this.API}/${id}/read`, {}));
      this.notifications.update(list =>
        list.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      this.unreadCount.update(c => Math.max(0, c - 1));
    } catch {}
  }

  async markAllRead() {
    try {
      await firstValueFrom(this.http.put(`${this.API}/read-all`, {}));
      this.notifications.update(list =>
        list.map(n => ({ ...n, isRead: true }))
      );
      this.unreadCount.set(0);
    } catch {}
  }

  async deleteNotif(id: number) {
    try {
      await firstValueFrom(this.http.delete(`${this.API}/${id}`));
      this.notifications.update(list => list.filter(n => n.id !== id));
    } catch {}
  }

  disconnect() {
    this.hubConnection?.stop();
  }
}