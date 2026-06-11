import ResearchNotesCard from './cards/ResearchNotesCard';
import EmailCard from './cards/EmailCard';
import DocumentationCard from './cards/DocumentationCard';
import VideoContentCard from './cards/VideoContentCard';
import TasksCard from './cards/TasksCard';
import CalendarCard from './cards/CalendarCard';

interface WorkspaceGridProps {
  eyeState: 'relaxed' | 'strained';
}

export default function WorkspaceGrid({ eyeState }: WorkspaceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <ResearchNotesCard />
      <EmailCard />
      <DocumentationCard />
      <VideoContentCard eyeState={eyeState} />
      <TasksCard />
      <CalendarCard />
    </div>
  );
}
