import { useState, useEffect } from 'react';
import { supabase } from './config/supabase';
import WelcomeScreen from './screens/WelcomeScreen';
import MainHub from './screens/MainHub';

function App() {
  const [currentStep, setCurrentStep] = useState<string>('welcome');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentStep('main-hub');
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentStep('main-hub');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Carregando...</div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setCurrentStep('main-hub')} />;
      case 'main-hub':
        return <MainHub />;
      default:
        return <WelcomeScreen onNext={() => setCurrentStep('main-hub')} />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderScreen()}</div>;
}

export default App;
