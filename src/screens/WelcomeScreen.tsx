import { Trophy } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-full shadow-2xl">
            <Trophy className="w-20 h-20 text-green-600" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white">Vitrine Pro</h1>
          <p className="text-xl text-white/90 max-w-md mx-auto">
            O seu talento no futebol é visto aqui
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <button
            onClick={onNext}
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Começar Agora
          </button>

          <p className="text-white/70 text-sm">
            Treine, evolua e seja descoberto
          </p>
        </div>
      </div>
    </div>
  );
}
