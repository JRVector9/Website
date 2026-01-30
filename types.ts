
export interface Service {
  id: string;
  title: string;
  description: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'DEVELOPING';
  version: string;
}

export interface TerminalLine {
  text: string;
  type: 'info' | 'error' | 'success' | 'command';
  timestamp: string;
}
