import { Home, Dumbbell, User, MoreHorizontal, Trophy, Target, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function MainHub() {
  const [activeTab, setActiveTab] = useState('home');

  const menuItems = [
    { icon: Dumbbell, label: 'Treinos', color: 'bg-blue-500' },
    { icon: Trophy, label: 'Peneiras', color: 'bg-green-500' },
    { icon: Target, label: 'Desafios', color: 'bg-orange-500' },
    { icon: TrendingUp, label: 'Ranking', color: 'bg-purple-500' },
    { icon: Calendar, label: 'Peladas', color: 'bg-red-500' },
    { icon: User, label: 'Perfil', color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Olá, Atleta!</h1>
            <p className="text-green-100 text-sm">Pronto para treinar hoje?</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-green-100">Treinos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-green-100">Pontos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-xs text-green-100">Ranking</div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Principal</h2>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:scale-105"
              >
                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-gray-800 font-semibold">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">Treino do Dia</h3>
          <p className="text-green-100 text-sm mb-4">
            Complete seu treino diário e ganhe pontos extras
          </p>
          <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Iniciar Treino
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-green-600' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Início</span>
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'training' ? 'text-green-600' : 'text-gray-400'}`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs">Treinos</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-green-600' : 'text-gray-400'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </button>
          <button
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'more' ? 'text-green-600' : 'text-gray-400'}`}
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-xs">Mais</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
