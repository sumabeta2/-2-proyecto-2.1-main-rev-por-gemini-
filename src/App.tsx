import React, { useState } from 'react';
import { ActivationScreen } from './components/ActivationScreen';
import { PatientFormScreen } from './components/PatientFormScreen';
import { AssistanceScreen } from './components/AssistanceScreen';
import { SupportScreen } from './components/SupportScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AdminScreen } from './components/AdminScreen';
import { PatientData, RoleType } from './types';

// Código maestro de administrador definido en los requisitos
const ADMIN_CODE = '561393';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'ACTIVATION' | 'PATIENT_FORM' | 'ASSISTANCE' | 'SUPPORT' | 'HISTORY' | 'ADMIN'>('ACTIVATION');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estado para guardar los datos del paciente y pasarlos a la IA
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [userRole, setUserRole] = useState<RoleType>('PRIMER_RESPONDIENTE');
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);

  const handleActivation = (code: string) => {
    if (code === ADMIN_CODE) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setCurrentScreen('PATIENT_FORM');
  };

  const handleStartAssistance = (data: PatientData, role: RoleType) => {
    console.log("Datos recibidos:", data);
    setPatientData(data);
    setUserRole(role);
    setSelectedHistoryDate(null);
    setCurrentScreen('ASSISTANCE');
  };

  const handleSelectHistoryCase = (data: PatientData, role: RoleType, date: string) => {
    setPatientData(data);
    setUserRole(role);
    setSelectedHistoryDate(date);
    setCurrentScreen('ASSISTANCE');
  };

  const handleEndSession = () => {
    setPatientData(null);
    setSelectedHistoryDate(null);
    setCurrentScreen('PATIENT_FORM');
  };

  const handleLogout = () => {
    setPatientData(null);
    setIsAdmin(false);
    setCurrentScreen('ACTIVATION');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {currentScreen === 'ACTIVATION' && (
        <ActivationScreen onActivate={handleActivation} />
      )}
      
      {currentScreen === 'PATIENT_FORM' && (
        <PatientFormScreen 
          isAdmin={isAdmin} 
          onStartAssistance={handleStartAssistance}
          onLogout={handleLogout}
          onOpenSupport={() => setCurrentScreen('SUPPORT')}
          onOpenHistory={() => setCurrentScreen('HISTORY')}
          onOpenAdmin={() => setCurrentScreen('ADMIN')}
        />
      )}

      {currentScreen === 'ASSISTANCE' && patientData && (
        <AssistanceScreen 
          patientData={patientData}
          userRole={userRole}
          onEndSession={handleEndSession}
        />
      )}

      {currentScreen === 'SUPPORT' && (
        <SupportScreen onBack={() => setCurrentScreen('PATIENT_FORM')} />
      )}

      {currentScreen === 'HISTORY' && (
        <HistoryScreen 
          onBack={() => setCurrentScreen('PATIENT_FORM')} 
          onSelectCase={handleSelectHistoryCase}
        />
      )}

      {currentScreen === 'ADMIN' && (
        <AdminScreen onBack={() => setCurrentScreen('PATIENT_FORM')} />
      )}
    </div>
  );
};

export default App;
