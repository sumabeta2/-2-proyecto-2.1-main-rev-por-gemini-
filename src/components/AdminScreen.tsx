import React, { useState } from 'react';
import { ArrowLeft, Search, Trash2, Power, Shield, Clock, Calendar } from 'lucide-react';
import { AccessCode } from '../types';

interface AdminScreenProps {
  onBack: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'24H' | 'MONTHLY'>('24H');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos simulados
  const [codes, setCodes] = useState<AccessCode[]>([
    { code: '012345', type: '24H', status: 'ACTIVE', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString() },
    { code: '098765', type: '24H', status: 'EXPIRED', createdAt: new Date(Date.now() - 100000000).toISOString(), expiresAt: new Date().toISOString() },
    { code: '123456', type: 'MONTHLY', status: 'ACTIVE', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000 * 31).toISOString() },
    { code: '556677', type: 'MONTHLY', status: 'BLOCKED', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000 * 31).toISOString() },
  ]);

  const handleDelete = (codeToDelete: string) => {
    if (window.confirm('¿Seguro que desea borrar este código?')) {
      setCodes(codes.filter(c => c.code !== codeToDelete));
    }
  };

  const toggleStatus = (codeToToggle: string) => {
    setCodes(codes.map(c => {
      if (c.code === codeToToggle) {
        return { ...c, status: c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' };
      }
      return c;
    }));
  };

  const filteredCodes = codes.filter(c => 
    c.type === activeTab && 
    c.code.includes(searchTerm)
  );

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
              <Shield className="w-5 h-5 text-blue-500" />
              ADMINISTRACIÓN
            </h1>
          </div>
        </div>
      </header>

      {/* Tabs de Navegación */}
      <div className="bg-slate-950 px-4 py-4 sticky top-[60px] z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button 
            onClick={() => setActiveTab('24H')}
            className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all border-2 flex items-center justify-center gap-2
              ${activeTab === '24H' 
                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
          >
            <Clock className="w-4 h-4" />
            24 HORAS (0...)
          </button>
          <button 
            onClick={() => setActiveTab('MONTHLY')}
            className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all border-2 flex items-center justify-center gap-2
              ${activeTab === 'MONTHLY' 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
          >
            <Calendar className="w-4 h-4" />
            MENSUAL
          </button>
        </div>

        {/* Buscador */}
        <div className="max-w-3xl mx-auto mt-4 relative">
          <input
            type="text"
            placeholder="BUSCAR CÓDIGO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold tracking-widest"
          />
          <Search className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Lista de Códigos */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-4 space-y-3">
        {filteredCodes.length > 0 ? (
          filteredCodes.map((item) => (
            <div 
              key={item.code}
              className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm flex items-center justify-between"
            >
              <div>
                <h3 className="font-black text-2xl text-white tracking-widest font-mono">{item.code}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${item.status === 'ACTIVE' ? 'bg-green-900/50 text-green-400 border border-green-900' : 
                      item.status === 'EXPIRED' ? 'bg-slate-700 text-slate-400' : 'bg-red-900/50 text-red-400 border border-red-900'}`
                  }>
                    {item.status === 'ACTIVE' ? 'ACTIVO' : item.status === 'EXPIRED' ? 'EXPIRADO' : 'BLOQUEADO'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Expira: {new Date(item.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.type === '24H' ? (
                  <button 
                    onClick={() => handleDelete(item.code)}
                    className="p-3 bg-slate-900 text-red-500 rounded-lg hover:bg-red-900/20 transition-colors border border-slate-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => toggleStatus(item.code)}
                    className={`p-3 rounded-lg transition-colors border ${
                      item.status === 'ACTIVE' 
                        ? 'bg-green-900/20 text-green-500 border-green-900 hover:bg-green-900/40' 
                        : 'bg-slate-900 text-slate-500 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 opacity-30">
            <Shield className="w-12 h-12 mx-auto text-slate-500 mb-2" />
            <p className="text-sm font-bold text-slate-400 uppercase">No hay códigos</p>
          </div>
        )}
      </main>
    </div>
  );
};
