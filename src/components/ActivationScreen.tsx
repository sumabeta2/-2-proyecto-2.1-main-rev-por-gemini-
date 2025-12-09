import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Activity } from 'lucide-react';

interface ActivationScreenProps {
  onActivate: (code: string) => void;
}

export const ActivationScreen: React.FC<ActivationScreenProps> = ({ onActivate }) => {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);

  // Maneja la entrada de exactamente 6 dígitos
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
    }
  };

  const handleActivateClick = () => {
    if (code.length === 6) {
      onActivate(code);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Contenedor Principal */}
      <div className="w-full max-w-md flex flex-col items-center z-10 space-y-8">
        
        {/* Sección Logo Animado Corazón */}
        <div className="relative w-40 h-40 flex items-center justify-center animate-heartbeat">
          {/* SVG Corazón Rojo Base */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-red-600 drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          
          {/* Borde Azul Superpuesto */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="absolute w-full h-full text-blue-600 pointer-events-none"
            style={{ transform: 'scale(1.05)' }}
          >
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {/* Letra S Blanca Centrada */}
          <span className="absolute text-white text-6xl font-bold font-sans pb-2">S</span>
          
          {/* Onda ECG Verde Animada */}
          <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none overflow-hidden rounded-full mask-heart">
            <svg className="w-full h-12" viewBox="0 0 500 100" preserveAspectRatio="none">
               <path
                 d="M0 50 L40 50 L50 20 L60 80 L70 50 L100 50 L110 50 L120 20 L130 80 L140 50 L180 50 L190 20 L200 80 L210 50 L250 50 L260 20 L270 80 L280 50 L320 50 L330 20 L340 80 L350 50 L500 50"
                 fill="none"
                 stroke="#22c55e" 
                 strokeWidth="6" 
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 className="animate-ecg-flow"
                 style={{ strokeDasharray: '500', strokeDashoffset: '500' }}
               />
            </svg>
          </div>
        </div>

        {/* Texto de Marca */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-[0.3em] text-slate-800">
            SUMA
          </h1>
          <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
            Tu Asistente Médico Personal, <br/> Cuando Más Lo Necesitas
          </p>
        </div>

        {/* Input y Botón */}
        <div className="w-full space-y-6 pt-4 flex flex-col items-center">
          {/* Input de código con toggle de contraseña */}
          <div className="relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Activity className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              type={showCode ? "text" : "password"}
              maxLength={6}
              value={code}
              onChange={handleCodeChange}
              className="block w-full pl-10 pr-12 py-4 border-2 border-gray-200 rounded-2xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 sm:text-2xl text-xl tracking-[0.5em] text-center font-bold transition-all shadow-sm"
              placeholder="000000"
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showCode ? (
                <EyeOff className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Eye className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Botón ACTIVAR */}
          <button
            type="button"
            disabled={code.length !== 6}
            onClick={handleActivateClick}
            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white transition-all transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:scale-[0.98]
              ${code.length === 6 
                ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/30 cursor-pointer' 
                : 'bg-gray-300 cursor-not-allowed'}`}
          >
            ACTIVAR
          </button>

          {/* Etiqueta de Versión */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              v1.5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};