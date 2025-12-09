import React, { useState } from 'react';
import { User, LogOut, HelpCircle, FileText, Shield } from 'lucide-react';
import { RoleType, PatientData } from '../types';

interface PatientFormScreenProps {
  isAdmin: boolean;
  onStartAssistance: (data: PatientData, role: RoleType) => void;
  onLogout: () => void;
  onOpenSupport: () => void;
  onOpenHistory: () => void;
  onOpenAdmin: () => void;
}

// Componente pequeño para el logo de SUMA (para evitar duplicación)
const SumaLogo = ({ sizeClass = 'w-10 h-10', textClass = 'text-lg' }: { sizeClass?: string, textClass?: string }) => (
    <div className={`relative ${sizeClass} flex items-center justify-center animate-heartbeat-slow shrink-0`}>
        {/* Corazón Rojo Base */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-600 drop-shadow-sm">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {/* Borde Azul */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute w-full h-full text-blue-600 pointer-events-none scale-105">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {/* Letra S */}
        <span className={`absolute text-white ${textClass} font-bold font-sans pb-0.5 shadow-sm`}>S</span>
        {/* ECG Animado (Mini) - No incluimos el path ECG aquí para mantenerlo limpio, confiamos en la clase animate-ecg-flow */}
    </div>
);


export const PatientFormScreen: React.FC<PatientFormScreenProps> = ({ 
  isAdmin, 
  onStartAssistance, 
  onLogout, 
  onOpenSupport,
  onOpenHistory,
  onOpenAdmin
}) => {
  // Inicializamos el rol en null para obligar a seleccionarlo
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [formData, setFormData] = useState<PatientData>({
    name: '',
    age: '',
    sex: '',
    medication: '',
    history: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validación: Nombre, Edad y ROL deben estar presentes
  const isFormValid = formData.name.trim().length > 0 && 
                      formData.age.trim().length > 0 && 
                      selectedRole !== null;

  const handleSubmit = () => {
    if (isFormValid && selectedRole) {
      onStartAssistance(formData, selectedRole);
    }
  };

  // Función para mostrar el rol de forma legible
  const getRoleLabel = (role: RoleType) => {
    switch (role) {
      case 'MEDICO': return 'MÉDICO';
      case 'ENFERMERO': return 'ENFERMERO';
      case 'PARAMEDICO': return 'PARAMÉDICO';
      case 'PRIMER_RESPONDIENTE': return '1er RESPONDIENTE';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SumaLogo /> {/* COMPONENTE SIMPLIFICADO */}
            <span className="font-extrabold text-lg text-slate-800 tracking-wider">SUMA</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Botón VER HISTORIAL */}
            <button 
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm font-medium transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span className="font-bold uppercase">VER HISTORIAL</span>
            </button>

            {/* Botón ADMON - Solo Admin */}
            {isAdmin && (
              <button 
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-black text-red-500 hover:bg-gray-900 text-xs sm:text-sm font-medium shadow-md transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="font-bold uppercase">ADMON</span>
              </button>
            )}

            {/* Botón SALIR */}
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold transition-colors uppercase ml-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only">SALIR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Franja NUEVO CASO */}
      <div className="bg-slate-200 py-1 text-center border-b border-slate-300">
        <span className="text-red-600 font-black text-xs uppercase tracking-[0.2em]">
          NUEVO CASO
        </span>
        {isAdmin && (
          <span className="text-blue-600 font-bold text-[10px] ml-2">
            (MODO ADMIN ACTIVO)
          </span>
        )}
      </div>

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-6 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 border-b-2 border-slate-100 pb-2">
             <User className="w-5 h-5 text-red-600" />
             <h2 className="text-xl font-black tracking-wide uppercase">MI ROL ES: <span className="text-red-500">*</span></h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {(['MEDICO', 'ENFERMERO', 'PARAMEDICO', 'PRIMER_RESPONDIENTE