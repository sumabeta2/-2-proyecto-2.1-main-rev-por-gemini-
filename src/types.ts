export type RoleType = 'PROFESSIONAL' | 'PATIENT';

export interface PatientData {
  name: string;
  age: string;
  sex: string;
  medication: string;
  history: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  parts: { text: string }[];
  timestamp: number;
}
