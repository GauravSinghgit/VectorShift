// App.js
// Main application layout: TopBar + Sidebar + Canvas + ConfigPanel
// Theme state managed via useTheme hook, passed to children.
// ─────────────────────────────────────────────────────────────

import { PipelineUI } from './ui';
import { Sidebar } from './common/Sidebar';
import { TopBar } from './common/TopBar';
import { ConfigPanel } from './common/ConfigPanel';
import { useToast } from './common/Toast';
import { useSubmitPipeline } from './submit';
import { useTheme } from './common/useTheme';

function App() {
  const { addToast, ToastContainer } = useToast();
  const { handleSubmit, isLoading } = useSubmitPipeline(addToast);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      <TopBar
        onSubmit={handleSubmit}
        isLoading={isLoading}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="app-body">
        <Sidebar />
        <PipelineUI theme={theme} />
        <ConfigPanel />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
