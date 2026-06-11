import { CheckSquare, Square, Plus } from 'lucide-react';
import { useState } from 'react';

export default function TasksCard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Initialize Vite React App', done: true },
    { id: 2, text: 'Design Neo-Brutalist theme', done: true },
    { id: 3, text: 'Implement adaptive logic', done: false },
    { id: 4, text: 'Integrate MediaPipe FaceMesh', done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const progress = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);

  return (
    <div className="neo-card flex flex-col h-96">
      <div className="bg-[var(--primary)] border-b-4 border-black p-3 flex items-center justify-between">
        <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-wide">
          <CheckSquare size={20} />
          Tasks
        </h3>
        <span className="neo-badge bg-white">{progress}% Done</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-color)]">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`flex items-center gap-3 p-3 neo-border bg-white cursor-pointer transition-colors hover:bg-gray-50 ${task.done ? 'opacity-60' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            {task.done ? (
              <CheckSquare size={20} className="text-[var(--primary)] flex-shrink-0" />
            ) : (
              <Square size={20} className="text-black flex-shrink-0" />
            )}
            <span className={`font-bold ${task.done ? 'line-through text-gray-500' : 'text-black'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 border-t-4 border-black bg-white">
        <button className="w-full neo-btn-secondary flex items-center justify-center gap-2">
          <Plus size={20} />
          Add Task
        </button>
      </div>
    </div>
  );
}
