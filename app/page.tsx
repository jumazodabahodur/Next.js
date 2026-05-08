'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Filter, Calendar, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Priority = 'low' | 'medium' | 'high';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}

const INITIAL_DATA: Todo[] = [
  { id: '1', text: 'Learn Next.js App Router', completed: true, priority: 'high', createdAt: Date.now() - 86400000 * 2 },
  { id: '2', text: 'Implement Premium UI with Glassmorphism', completed: true, priority: 'high', createdAt: Date.now() - 86400000 },
  { id: '3', text: 'Add Localization (EN/RU)', completed: true, priority: 'medium', createdAt: Date.now() - 43200000 },
  { id: '4', text: 'Build a CRUD Table', completed: false, priority: 'medium', createdAt: Date.now() - 100000 },
  { id: '5', text: 'Deploy to Vercel', completed: false, priority: 'low', createdAt: Date.now() },
];

export default function TodoPage() {
  const t = useTranslations('TodoApp');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [priorityValue, setPriorityValue] = useState<Priority>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isMounted, setIsMounted] = useState(false);
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState<Priority>('medium');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aura-todos-v2');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse todos", e);
        setTodos(INITIAL_DATA);
      }
    } else {
      setTodos(INITIAL_DATA);
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aura-todos-v2', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      priority: priorityValue,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setEditingPriority(todo.priority);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setTodos(todos.map(todo => 
      todo.id === editingId ? { 
        ...todo, 
        text: editingText.trim() || todo.text,
        priority: editingPriority
      } : todo
    ));
    setEditingId(null);
  };

  const switchLanguage = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    remaining: todos.filter(t => !t.completed).length
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
    }
  };

  if (!isMounted) return null;

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 min-h-screen flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/20">
            <ListTodo className="w-8 h-8 text-brand-primary animate-float" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gradient">{t('title')}</h1>
            <p className="text-slate-400 text-sm">{t('subtitle')}</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex gap-2 glass p-1">
          <button 
            onClick={() => switchLanguage('en')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${document.cookie.includes('NEXT_LOCALE=en') || !document.cookie.includes('NEXT_LOCALE') ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
          >
            EN
          </button>
          <button 
            onClick={() => switchLanguage('ru')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${document.cookie.includes('NEXT_LOCALE=ru') ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
          >
            RU
          </button>
        </div>
      </header>

      {/* Input Section */}
      <section className="glass p-1">
        <form onSubmit={addTodo} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-lg placeholder:text-slate-500"
          />
          <select 
            value={priorityValue}
            onChange={(e) => setPriorityValue(e.target.value as Priority)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-sm text-slate-300 mr-2"
          >
            <option value="low" className="bg-slate-900">{t('priorities.low')}</option>
            <option value="medium" className="bg-slate-900">{t('priorities.medium')}</option>
            <option value="high" className="bg-slate-900">{t('priorities.high')}</option>
          </select>
          <button
            type="submit"
            className="p-3 mr-1 rounded-xl bg-brand-primary hover:bg-brand-secondary transition-all duration-300 shadow-lg shadow-brand-primary/20 group"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </form>
      </section>

      {/* Stats & Filters */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === f 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t(`filters.${f}`)}
            </button>
          ))}
        </div>
        
        <div className="text-sm text-slate-400 flex gap-4">
          <span>{t('remaining', { count: stats.remaining })}</span>
          <span>{t('completed_stats', { count: stats.completed })}</span>
        </div>
      </section>

      {/* Todo Table */}
      <section className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-400 w-16">{t('table.status')}</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-400">{t('table.task')}</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-400 w-32">{t('table.priority')}</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-400 w-32">{t('table.date')}</th>
                <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-400 w-32 text-right">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-8 h-8 opacity-20" />
                      <p>{t('no_tasks')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTodos.map((todo) => (
                  <tr 
                    key={todo.id} 
                    className={`group border-b border-white/5 last:border-none transition-colors hover:bg-white/[0.02] ${todo.completed ? 'opacity-60' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="transition-transform duration-300 active:scale-90"
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-brand-accent" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-500 hover:text-brand-primary transition-colors" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="bg-white/10 border border-brand-primary/30 rounded px-2 py-1 outline-none text-white w-full"
                          autoFocus
                        />
                      ) : (
                        <p className={`text-lg transition-all duration-300 ${
                          todo.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}>
                          {todo.text}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === todo.id ? (
                        <select 
                          value={editingPriority}
                          onChange={(e) => setEditingPriority(e.target.value as Priority)}
                          className="bg-slate-800 border border-brand-primary/30 rounded px-2 py-1 text-xs outline-none text-white"
                        >
                          <option value="low">{t('priorities.low')}</option>
                          <option value="medium">{t('priorities.medium')}</option>
                          <option value="high">{t('priorities.high')}</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(todo.priority)}`}>
                          {t(`priorities.${todo.priority}`)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingId === todo.id ? (
                          <>
                            <button onClick={saveEdit} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEditing(todo)}
                              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteTodo(todo.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer / Info */}
      <footer className="mt-auto py-8 text-center border-t border-white/5">
        <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
          {t.rich('footer', {
            heart: (chunks) => <span className="text-brand-accent animate-pulse">❤️</span>
          })}
        </p>
      </footer>
    </main>
  );
}
