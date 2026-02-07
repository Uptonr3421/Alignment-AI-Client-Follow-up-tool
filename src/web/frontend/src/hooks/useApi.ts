import { useState, useCallback } from 'react';
import { getAuthToken, getCurrentUserId } from './useFirebase';

const API_URL = import.meta.env.VITE_API_URL || 'https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      const userId = getCurrentUserId();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (userId) {
        headers['X-User-Id'] = userId;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    request,
    loading,
    error,
  };
}

// API helper functions
export const api = {
  // Clients
  getClients: () => fetchApi('/clients'),
  createClient: (data: any) => fetchApi('/clients', { method: 'POST', body: data }),
  updateClient: (id: string, data: any) => fetchApi(`/clients/${id}`, { method: 'PUT', body: data }),
  deleteClient: (id: string) => fetchApi(`/clients/${id}`, { method: 'DELETE' }),
  getClient: (id: string) => fetchApi(`/clients/${id}`),
  getClientEmails: (id: string) => fetchApi(`/clients/${id}/emails`),

  // Settings
  getSettings: () => fetchApi('/settings'),
  updateSettings: (data: any) => fetchApi('/settings', { method: 'PUT', body: data }),

  // Templates
  getTemplates: () => fetchApi('/templates'),
  updateTemplate: (id: string, data: any) => fetchApi(`/templates/${id}`, { method: 'PUT', body: data }),
  updateTemplates: (templates: any[]) => fetchApi('/templates', { method: 'PUT', body: { templates } }),

  // Dashboard
  getDashboard: () => fetchApi('/dashboard'),
  getTodayTasks: () => fetchApi('/dashboard/today'),

  // Gmail
  getGmailStatus: () => fetchApi('/gmail/status'),
  disconnectGmail: () => fetchApi('/gmail/disconnect', { method: 'POST' }),

  // Emails
  getPendingEmails: () => fetchApi('/emails/pending'),
  sendEmail: (data: any) => fetchApi('/emails/send', { method: 'POST', body: data }),
  cancelEmail: (id: string) => fetchApi(`/emails/${id}/cancel`, { method: 'POST' }),
};

async function fetchApi(endpoint: string, options: ApiOptions = {}) {
  const token = await getAuthToken();
  const userId = getCurrentUserId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (userId) {
    headers['X-User-Id'] = userId;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}
