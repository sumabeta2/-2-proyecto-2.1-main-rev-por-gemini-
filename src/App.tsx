import { useState, useCallback } from 'react';
import { StartScreen } from './components/StartScreen';
import { PatientFormScreen } from './components/PatientFormScreen';
import { AssistanceScreen } from './components/AssistanceScreen';
import { RoleType, PatientData } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'start' | 'form' | 'assistance'>('start');
  const [userRole, setUserRole] = useState<RoleType>('PATIENT');
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  const handleRoleSelect = useCallback((role: RoleType) => {
    setUserRole(role);
    setCurrentScreen('form');
  }, []);

  const handleFormSubmit = useCallback((data: PatientData, role: RoleType) => {
    setPatientData(data);
    setUserRole(role);
    setCurrentScreen('assistance');
  }, []);

  const handleBackToStart = useCallback(() => {
    setCurrentScreen('start');
    setPatientData(null);
  }, []);

  const handleBackToForm = useCallback(() => {
    setCurrentScreen('form');
    setPatientData(null);
  }, []);

  let initialContext = '';
  if (userRole === 'PROFESSIONAL') {
    initialContext = 'Actuando como un profesional de la salud. La respuesta debe ser detallada y precisa.';
  } else if (userRole === 'PATIENT') {
    initialContext = 'Actuando como un paciente que solicita información médica. La respuesta debe ser empática y fácil de entender.';
  }

  return (
    <>
      {currentScreen === 'start' && <StartScreen onRoleSelect={handleRoleSelect} />}

      {currentScreen === 'form' && (
        <PatientFormScreen 
          onBack={handleBackToStart} 
          onSubmit={handleFormSubmit} 
          role={userRole}
        />
      )}

      {currentScreen === 'assistance' && patientData && (
        <AssistanceScreen
          onBack={handleBackToForm}
          patientData={patientData}
          initialContext={initialContext}
        />
      )}
    </>
  );
}

export default App;
