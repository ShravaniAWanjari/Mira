import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarCard() {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentDay = 15;

  return (
    <div className="neo-card flex flex-col h-96">
      <div className="bg-[var(--secondary)] border-b-4 border-black p-3 flex items-center justify-between text-black">
        <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-wide">
          <CalendarIcon size={20} />
          Schedule
        </h3>
        <div className="flex gap-1">
          <button className="p-1 border-2 border-black hover:bg-[var(--primary)]"><ChevronLeft size={16} /></button>
          <button className="p-1 border-2 border-black hover:bg-[var(--primary)]"><ChevronRight size={16} /></button>
        </div>
      </div>
      
      <div className="p-4 bg-transparent text-[var(--text-color)] flex-1 flex flex-col">
        <h4 className="font-bold text-xl mb-4 uppercase text-center">October</h4>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(day => (
            <div key={day} className="text-center font-bold text-xs uppercase text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty days for offset */}
          <div className="aspect-square"></div>
          <div className="aspect-square"></div>
          <div className="aspect-square"></div>
          
          {dates.map(date => (
            <div 
              key={date} 
              className={`aspect-square flex items-center justify-center font-bold text-sm border-2 border-transparent cursor-pointer transition-colors
                ${date === currentDay ? 'bg-[var(--primary)] text-black neo-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:border-black'}
              `}
            >
              {date}
            </div>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t-2 border-black border-dashed">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--primary)] border border-black"></div>
            <span className="text-xs font-bold uppercase">10:00 AM - Design Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}
