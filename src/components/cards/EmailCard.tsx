import { Mail, Search, Inbox } from 'lucide-react';

export default function EmailCard() {
  return (
    <div className="neo-card flex flex-col h-96">
      <div className="bg-[var(--secondary)] border-b-4 border-black p-3 flex items-center justify-between text-black">
        <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-wide">
          <Mail size={20} />
          Inbox
        </h3>
        <span className="bg-black text-white px-2 py-1 text-xs font-bold">2 NEW</span>
      </div>
      
      <div className="p-3 border-b-4 border-black bg-[var(--bg-color)]">
        <div className="flex bg-white neo-border items-center px-2">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search emails..." 
            className="w-full p-2 outline-none text-black font-medium bg-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b-2 border-black p-3 bg-[var(--primary)] text-black cursor-pointer hover:bg-opacity-90">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-sm">Design Team</span>
            <span className="text-xs font-bold">10:42 AM</span>
          </div>
          <p className="font-bold text-md truncate">New Brand Assets</p>
          <p className="text-xs font-medium truncate opacity-80">The requested orange/yellow neo-brutalist assets are attached.</p>
        </div>
        
        <div className="border-b-2 border-black p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-sm">System</span>
            <span className="text-xs font-bold">Yesterday</span>
          </div>
          <p className="font-medium text-md truncate">Deployment Success</p>
          <p className="text-xs truncate opacity-70">Build #404 passed all tests.</p>
        </div>

        <div className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center h-24 opacity-50">
          <div className="text-center font-bold text-sm flex flex-col items-center">
            <Inbox size={24} className="mb-2" />
            No more emails
          </div>
        </div>
      </div>
    </div>
  );
}
