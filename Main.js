import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, X, Clock, Target, Flame, Brain, Coffee, Zap, Moon, Sun, Cloud, CloudRain, Wind } from 'lucide-react';

const MomentumDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [focusGoal, setFocusGoal] = useState('');
  const [editingFocus, setEditingFocus] = useState(false);
  const [streak, setStreak] = useState(3);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoro, setIsPomodoro] = useState(false);
  const [breathePhase, setBreathePhase] = useState(0);

  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" }
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPomodoro && pomodoroTime > 0) {
      const timer = setTimeout(() => setPomodoroTime(pomodoroTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (pomodoroTime === 0) {
      setIsPomodoro(false);
      setPomodoroTime(25 * 60);
    }
  }, [isPomodoro, pomodoroTime]);

  useEffect(() => {
    const breathe = setInterval(() => {
      setBreathePhase(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(breathe);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return '☀️ Good Morning';
    if (hour < 18) return '🌤️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const getTimeOfDay = () => {
    const hour = time.getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const backgrounds = {
    night: 'from-indigo-950 via-purple-900 to-slate-900',
    morning: 'from-orange-300 via-pink-300 to-purple-300',
    afternoon: 'from-blue-400 via-cyan-300 to-teal-300',
    evening: 'from-orange-400 via-red-400 to-purple-500'
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo, done: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const saveFocus = () => {
    setEditingFocus(false);
  };

  const togglePomodoro = () => {
    if (isPomodoro) {
      setIsPomodoro(false);
      setPomodoroTime(25 * 60);
    } else {
      setIsPomodoro(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = todos.filter(t => t.done).length;
  const completionRate = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const breatheText = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'][breathePhase];
  const breatheScale = breathePhase === 0 ? 1.2 : breathePhase === 2 ? 0.8 : 1;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgrounds[getTimeOfDay()]} transition-all duration-[3000ms] p-6`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-7xl font-bold text-white mb-2 drop-shadow-lg">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </h1>
          <p className="text-2xl text-white/90 font-light">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xl text-white/80 mt-4">{getGreeting()}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Focus Goal */}
          <div className="lg:col-span-3 backdrop-blur-xl bg-white/20 rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.01]">
            {editingFocus ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={focusGoal}
                  onChange={(e) => setFocusGoal(e.target.value)}
                  onBlur={saveFocus}
                  onKeyPress={(e) => e.key === 'Enter' && saveFocus()}
                  placeholder="What's your main focus today?"
                  className="flex-1 bg-white/30 border-2 border-white/50 rounded-2xl px-6 py-4 text-white text-2xl placeholder-white/60 focus:outline-none focus:border-white"
                  autoFocus
                />
              </div>
            ) : (
              <div onClick={() => setEditingFocus(true)} className="cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="text-white" size={28} />
                  <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Today's Focus</span>
                </div>
                <p className="text-3xl text-white font-light">
                  {focusGoal || 'Click to set your main goal for today...'}
                </p>
              </div>
            )}
          </div>

          {/* Todo List */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/20 rounded-3xl p-6 border border-white/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-white" size={24} />
                <h2 className="text-2xl font-bold text-white">Tasks</h2>
              </div>
              <div className="text-white/80 text-sm">
                {completedCount}/{todos.length} • {completionRate}%
              </div>
            </div>

            <form onSubmit={addTodo} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 bg-white/30 border border-white/40 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="bg-white/30 hover:bg-white/40 border border-white/40 rounded-xl px-4 transition-all"
                >
                  <Plus className="text-white" size={20} />
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {todos.length === 0 ? (
                <p className="text-white/60 text-center py-8">No tasks yet. Add one to get started!</p>
              ) : (
                todos.map(todo => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 bg-white/20 rounded-xl p-3 hover:bg-white/30 transition-all group"
                  >
                    <button onClick={() => toggleTodo(todo.id)}>
                      {todo.done ? (
                        <CheckCircle2 className="text-green-300" size={24} />
                      ) : (
                        <Circle className="text-white/60" size={24} />
                      )}
                    </button>
                    <span className={`flex-1 text-white ${todo.done ? 'line-through opacity-60' : ''}`}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-white/60 hover:text-red-300" size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats & Tools */}
          <div className="space-y-6">
            
            {/* Pomodoro Timer */}
            <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-6 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-white" size={20} />
                <h3 className="text-lg font-bold text-white">Focus Timer</h3>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-4">
                  {formatTime(pomodoroTime)}
                </div>
                <button
                  onClick={togglePomodoro}
                  className={`w-full ${isPomodoro ? 'bg-red-500/40 hover:bg-red-500/50' : 'bg-white/30 hover:bg-white/40'} rounded-xl py-3 text-white font-semibold transition-all`}
                >
                  {isPomodoro ? 'Stop' : 'Start'} Pomodoro
                </button>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-6 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="text-orange-300" size={20} />
                <h3 className="text-lg font-bold text-white">Streak</h3>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-1">{streak}</div>
                <div className="text-white/80 text-sm">days in a row!</div>
              </div>
            </div>

            {/* Breathe */}
            <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-6 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Wind className="text-white" size={20} />
                <h3 className="text-lg font-bold text-white">Breathe</h3>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="w-24 h-24 rounded-full bg-white/40 mb-4 transition-transform duration-[3000ms] ease-in-out"
                  style={{ transform: `scale(${breatheScale})` }}
                />
                <p className="text-white text-lg font-light">{breatheText}</p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="lg:col-span-3 backdrop-blur-xl bg-white/20 rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="text-center">
              <p className="text-2xl text-white font-light italic mb-3">"{quote.text}"</p>
              <p className="text-white/80">— {quote.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomentumDashboard;
