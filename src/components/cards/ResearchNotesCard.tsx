import { FileText, Bold, Italic, List } from 'lucide-react';

export default function ResearchNotesCard() {
  return (
    <div className="neo-card flex flex-col h-96">
      <div className="bg-[var(--primary)] border-b-4 border-black p-3 flex items-center justify-between">
        <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-wide">
          <FileText size={20} />
          Research Notes
        </h3>
        <span className="neo-badge">3 Notes</span>
      </div>
      
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex gap-2">
          <button className="neo-btn-secondary p-2"><Bold size={16} /></button>
          <button className="neo-btn-secondary p-2"><Italic size={16} /></button>
          <button className="neo-btn-secondary p-2"><List size={16} /></button>
        </div>
        
        <textarea 
          className="flex-1 neo-border p-3 resize-none bg-white text-black font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
          defaultValue="Mira Lite Prototype Notes:&#10;&#10;- Need to implement adaptive dark mode.&#10;- Ensure neo-brutalist theme pops with orange and yellow!&#10;- Verify custom scrollbars work."
        ></textarea>
        
        <div className="text-right text-xs font-bold text-gray-500 uppercase">
          Auto-saved
        </div>
      </div>
    </div>
  );
}
