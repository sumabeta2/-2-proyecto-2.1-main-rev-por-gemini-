// Definiciones de tipos globales para la aplicación

export interface FileMetadata {
  name: string;
  status: 'pending' | 'ready' | 'error';
  lastModified: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  RECOVERY_MODE = 'RECOVERY_MODE',
  ACTIVE = 'ACTIVE'
}

export type RoleType = 'MEDICO' | 'ENFERMERO' | 'PARAMEDICO' | 'PRIMER_RESPONDIENTE';

export interface PatientData {
  name: string;
  age: string;
  sex: string;
  medication: string;
  history: string;
}

// Tipos para el Historial
export interface ClinicalCase {
  id: string;
  patientName: string;
  date: string; // ISO string
  diagnosis_summary: string;
  isProtected: boolean; // Si es true, no se borra automáticamente
  data: PatientData;
  roleUsed: RoleType;
}

// Tipos para Administración
export interface AccessCode {
  code: string;
  type: '24H' | 'MONTHLY';
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
}
