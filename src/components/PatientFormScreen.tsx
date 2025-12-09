import React, { useState } from 'react';
import { ArrowLeft, User, Heart, Pills, Clipboard, AlertCircle } from 'lucide-react';
import { RoleType, PatientData } from '../types';

interface PatientFormScreenProps {
  onBack: () => void;
  onSubmit: (data: PatientData, role: RoleType) => void;
  role: RoleType;
}

export const PatientFormScreen: React.FC<PatientFormScreenProps> = ({ onBack, onSubmit, role }) => {
  const [data, setData] = useState<PatientData>({
    name: '',
    age: '',
    sex: '',
    medication: '',
    history: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(data).every(val => val.trim() !== '')) {
      onSubmit(data, role);
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  const isFormValid = Object.values(data).every(val => val.trim() !== '');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-200">
      {/* Cabecera */}
      <header className="bg-slate-950 shadow-md sticky top-0 z-20 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-lg text-white uppercase tracking-wide flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-red-500" />
              NUEVO REPORTE
            </h1>
          </div>
          <span className="text-xs font-semibold text-red-500 bg-red-900/20 px-3 py-1 rounded-full border border-red-900">
            ROL: {role}
          </span>
        </div>
      </header>

      {/* Formulario */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Sección de Datos Básicos */}
          <section className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-red-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <User className="w-5 h-5" /> Datos del Paciente
            </h2>
            <InputGroup icon={User} name="name" label="Nombre/ID" value={data.name} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputGroup icon={Clock} name="age" label="Edad" value={data.age} onChange={handleChange} type="number" />
              <InputGroup icon={Heart} name="sex" label="Sexo (F/M)" value={data.sex} onChange={handleChange} />
            </div>
          </section>

          {/* Sección de Antecedentes y Medicación */}
          <section className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-blue-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Pills className="w-5 h-5" /> Antecedentes
            </h2>
            <InputGroup icon={Pills} name="medication" label="Medicamentos Regulares/Alergias" value={data.medication} onChange={handleChange} />
            <TextAreaGroup icon={Clipboard} name="history" label="Historia Clínica Relevante y Motivo de Consulta" value={data.history} onChange={handleChange} rows={5} />
          </section>

          {/* Botón de Envío y Alerta */}
          <div className="pt-4">
            {!isFormValid && (
              <div className="p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-medium">Debe completar todos los campos antes de solicitar asistencia.</p>
              </div>
            )}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl text-lg font-black uppercase transition-all shadow-md ${
                isFormValid
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/50'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              SOLICITAR ASISTENCIA IA
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

// Componente auxiliar para Input
interface InputGroupProps {
  icon: React.ElementType;
  name: keyof PatientData;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ icon: Icon, name, label, value, onChange, type = 'text' }) => (
  <div className="relative">
    <label htmlFor={name} className="absolute -top-3 left-3 text-xs font-medium text-slate-400 bg-slate-800 px-1 z-10">
      {label}
    </label>
    <Icon className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium transition-colors"
      required
    />
  </div>
);

// Componente auxiliar para TextArea
interface TextAreaGroupProps {
  icon: React.ElementType;
  name: keyof PatientData;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const TextAreaGroup: React.FC<TextAreaGroupProps> = ({ icon: Icon, name, label, value, onChange, rows = 3 }) => (
  <div className="relative">
    <label htmlFor={name} className="absolute -top-3 left-3 text-xs font-medium text-slate-400 bg-slate-800 px-1 z-10">
      {label}
    </label>
    <Icon className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium transition-colors resize-none"
      required
    />
  </div>
);
