/**
 * Root application component.
 * Sets up context providers and routing.
 */

import { KolProvider } from './context/KolContext';
import { Dashboard } from './pages/Dashboard';

function App(): JSX.Element {
  return (
    <KolProvider>
      <Dashboard />
    </KolProvider>
  );
}

export default App;



