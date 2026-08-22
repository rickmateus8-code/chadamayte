export interface HealthResponse {
  ok: boolean;
  service: string;
  timestamp?: string;
  hasDbBinding?: boolean;
  hasMediaBinding?: boolean;
}

export interface AppSettings {
  title: string;
  subtitle: string;
  theme: {
    primaryColor: string;
    accentColor: string;
  };
}
