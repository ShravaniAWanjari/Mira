import { BookOpen, Terminal } from 'lucide-react';

export default function DocumentationCard() {
  return (
    <div className="neo-card flex flex-col h-96">
      <div className="bg-white text-black border-b-4 border-black p-3 flex items-center justify-between">
        <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-wide">
          <BookOpen size={20} />
          API Docs
        </h3>
        <span className="text-xs font-bold">v2.4.0</span>
      </div>
      
      <div className="flex-1 flex">
        <div className="w-1/3 border-r-4 border-black p-2 bg-[var(--bg-color)] overflow-y-auto">
          <ul className="space-y-2 text-sm font-bold">
            <li className="p-1 bg-[var(--primary)] text-black neo-border">Authentication</li>
            <li className="p-1 hover:underline cursor-pointer">Endpoints</li>
            <li className="p-1 hover:underline cursor-pointer">Webhooks</li>
            <li className="p-1 hover:underline cursor-pointer">Errors</li>
          </ul>
        </div>
        <div className="w-2/3 p-4 overflow-y-auto bg-white text-black">
          <h4 className="font-black text-xl mb-2 flex items-center gap-2 border-b-2 border-black pb-1">
            <Terminal size={18} />
            Authentication
          </h4>
          <p className="text-sm font-medium mb-4">
            Use Bearer tokens to authenticate your requests. Keep your tokens secure!
          </p>
          <div className="bg-gray-100 border-2 border-black p-2 font-mono text-xs overflow-x-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[var(--primary)] font-bold">Authorization:</span> Bearer &lt;token&gt;
          </div>
          <p className="text-sm font-medium mt-4">
            If you encounter issues, verify the token format.
          </p>
        </div>
      </div>
    </div>
  );
}
