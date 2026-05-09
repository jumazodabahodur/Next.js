'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, CheckCircle2, Circle, ListTodo, 
  Filter, Calendar, Edit2, Check, X, Loader2, 
  Search, ArrowUpDown, ArrowUp, ArrowDown, MoreVertical,
  AlertCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { 
  useGetTodosQuery, 
  useAddTodoMutation, 
  useUpdateTodoMutation, 
  useDeleteTodoMutation,
  Todo
} from '@/api/todo.api';

type Priority = 'low' | 'medium' | 'high';
type SortField = 'text' | 'priority' | 'createdAt' | 'completed';
type SortOrder = 'asc' | 'desc';

export default function TodoPage() {
  const t = useTranslations('TodoApp');
  
  // RTK Query Hooks (Queries & Mutations)
  const { data: todos = [], isLoading, isError, refetch } = useGetTodosQuery();
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  // Local State
  const [inputValue, setInputValue] = useState('');
  const [priorityValue, setPriorityValue] = useState<Priority>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isMounted, setIsMounted] = useState(false);
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState<Priority>('medium');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // CRUD Handlers
  const handleAddTodo = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await addTodo({
        text: inputValue.trim(),
        completed: false,
        priority: priorityValue,
        createdAt: Date.now(),
      }).unwrap();
      setInputValue('');
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      await updateTodo({
        id: todo.id,
        completed: !todo.completed
      }).unwrap();
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTodo(id).unwrap();
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text || '');
    setEditingPriority(todo.priority || 'medium');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateTodo({
        id: editingId,
        text: editingText.trim(),
        priority: editingPriority
      }).unwrap();
      setEditingId(null);
    } catch (err) {
      console.error('Failed to save edit:', err);
    }
  };

  // Logic: Filtering, Searching & Sorting
  const processedTodos = useMemo(() => {
    let result = [...todos];

    // Filter by status
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => t.text.toLowerCase().includes(term));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'priority') {
        const priorityMap = { high: 3, medium: 2, low: 1 };
        comparison = priorityMap[a.priority] - priorityMap[b.priority];
      } else if (sortField === 'text') {
        comparison = a.text.localeCompare(b.text);
      } else if (sortField === 'completed') {
        comparison = (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
      } else {
        comparison = a.createdAt - b.createdAt;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [todos, filter, searchTerm, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const switchLanguage = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    remaining: todos.filter(t => !t.completed).length
  };

  const getPriorityColor = (p?: Priority) => {
    const priority = p || 'medium';
    switch(priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-primary" /> : <ArrowDown className="w-3 h-3 text-brand-primary" />;
  };

  if (!isMounted) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 min-h-screen flex flex-col gap-8 antialiased">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 shadow-xl shadow-brand-primary/5">
            <ListTodo className="w-10 h-10 text-brand-primary animate-float" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gradient">{t('title')}</h1>
            <p className="text-slate-400 text-sm font-medium">{t('subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
            />
          </div>

          {/* Language Switcher */}
          <div className="flex gap-1 glass p-1 h-10">
            <button 
              onClick={() => switchLanguage('en')}
              className={`px-3 rounded-lg text-xs font-bold transition-all ${document.cookie.includes('NEXT_LOCALE=en') || !document.cookie.includes('NEXT_LOCALE') ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              EN
            </button>
            <button 
              onClick={() => switchLanguage('ru')}
              className={`px-3 rounded-lg text-xs font-bold transition-all ${document.cookie.includes('NEXT_LOCALE=ru') ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              RU
            </button>
          </div>
        </div>
      </header>

      {/* Input Section */}
      <section className="glass p-1 shadow-2xl shadow-black/20">
        <form onSubmit={handleAddTodo} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-lg placeholder:text-slate-500 font-medium"
          />
          <div className="flex items-center gap-2 pr-2">
            <select 
              value={priorityValue}
              onChange={(e) => setPriorityValue(e.target.value as Priority)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-sm text-slate-300 transition-colors focus:border-brand-primary/50"
            >
              <option value="low" className="bg-slate-900">{t('priorities.low')}</option>
              <option value="medium" className="bg-slate-900">{t('priorities.medium')}</option>
              <option value="high" className="bg-slate-900">{t('priorities.high')}</option>
            </select>
            <button
              type="submit"
              disabled={isAdding || !inputValue.trim()}
              className="p-3 rounded-xl bg-brand-primary hover:bg-brand-secondary transition-all duration-300 shadow-lg shadow-brand-primary/20 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />}
            </button>
          </div>
        </form>
      </section>

      {/* Stats & Filters */}
      <section className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === f 
                  ? 'bg-white text-black shadow-lg scale-105' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t(`filters.${f}`)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none mb-1">Progress</span>
            <div className="text-sm font-bold flex gap-4">
              <span className="text-brand-primary">{stats.remaining} <span className="text-[10px] text-slate-500 uppercase">Left</span></span>
              <span className="text-brand-accent">{stats.completed} <span className="text-[10px] text-slate-500 uppercase">Done</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Todo Table */}
      <section className="glass overflow-hidden relative min-h-[400px] shadow-2xl">
        {(isLoading || isError) && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4">
            {isLoading ? (
              <>
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-brand-primary/20 rounded-full"></div>
                </div>
                <p className="text-slate-300 font-medium animate-pulse">Syncing with cloud...</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-12 h-12 text-red-400" />
                <p className="text-red-400 font-medium">Failed to load tasks</p>
                <button onClick={() => refetch()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all">Try Again</button>
              </>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th 
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-20 cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => toggleSort('completed')}
                >
                  <div className="flex items-center gap-2">{t('table.status')} <SortIcon field="completed" /></div>
                </th>
                <th 
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => toggleSort('text')}
                >
                  <div className="flex items-center gap-2">{t('table.task')} <SortIcon field="text" /></div>
                </th>
                <th 
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-36 cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => toggleSort('priority')}
                >
                  <div className="flex items-center gap-2">{t('table.priority')} <SortIcon field="priority" /></div>
                </th>
                <th 
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-40 cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => toggleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">{t('table.date')} <SortIcon field="createdAt" /></div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-32 text-right">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processedTodos.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                      <div className="p-6 rounded-full bg-white/5 border border-white/10">
                        <Filter className="w-12 h-12 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-300 mb-1">No tasks found</h3>
                        <p className="text-slate-500 text-sm">{searchTerm ? "Try adjusting your search or filters" : "Your task list is empty. Start by adding one!"}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                processedTodos.map((todo) => (
                  <tr 
                    key={todo.id} 
                    className={`group transition-all hover:bg-white/[0.04] ${todo.completed ? 'opacity-50 grayscale-[0.5]' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleTodo(todo)}
                        disabled={isUpdating}
                        className="relative transition-transform duration-300 active:scale-90 disabled:opacity-50"
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="w-7 h-7 text-brand-accent drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]" />
                        ) : (
                          <Circle className="w-7 h-7 text-slate-600 hover:text-brand-primary transition-colors" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === todo.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            className="bg-white/10 border border-brand-primary/50 rounded-xl px-3 py-2 outline-none text-white w-full font-medium"
                            autoFocus
                          />
                        </div>
                      ) : (
                          <p className={`text-base font-semibold transition-all duration-300 ${
                            todo.completed ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}>
                            {todo.text || todo.name || todo.fullName || todo.firstName || 'Untitled Task'}
                          </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === todo.id ? (
                        <select 
                          value={editingPriority}
                          onChange={(e) => setEditingPriority(e.target.value as Priority)}
                          className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none text-white w-full"
                        >
                          <option value="low">{t('priorities.low')}</option>
                          <option value="medium">{t('priorities.medium')}</option>
                          <option value="high">{t('priorities.high')}</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(todo.priority)}`}>
                          {t(`priorities.${todo.priority || 'medium'}`)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                        {new Date(todo.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingId === todo.id ? (
                          <>
                            <button onClick={saveEdit} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all">
                              <Check className="w-5 h-5" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEditing(todo)}
                              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                              title="Edit task"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTodo(todo.id)}
                              disabled={isDeleting}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                              title="Delete task"
                            >
                              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
      <footer className="mt-auto py-12 text-center border-t border-white/5">
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">
            {t.rich('footer', {
              heart: (chunks) => <span className="text-brand-accent animate-pulse mx-1">❤️</span>
            })}
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-1 bg-brand-primary rounded-full opacity-20"></div>
            <div className="w-8 h-1 bg-brand-secondary rounded-full opacity-20"></div>
            <div className="w-8 h-1 bg-brand-accent rounded-full opacity-20"></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
