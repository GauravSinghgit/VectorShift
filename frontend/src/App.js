// App.js
// Main application layout: TopBar + Sidebar + Canvas + ConfigPanel
// ─────────────────────────────────────────────────────────────

import { PipelineUI } from './ui';
import { Sidebar } from './common/Sidebar';
import { TopBar } from './common/TopBar';
import { ConfigPanel } from './common/ConfigPanel';
import { useToast } from './common/Toast';
import { useSubmitPipeline } from './submit';

function App() {
  const { addToast, ToastContainer } = useToast();
  const { handleSubmit, isLoading } = useSubmitPipeline(addToast);

  return (
    <div className="app-layout">
      <TopBar onSubmit={handleSubmit} isLoading={isLoading} />
      <div className="app-body">
        <Sidebar />
        <PipelineUI />
        <ConfigPanel />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
