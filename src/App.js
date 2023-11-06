import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './scenes/dashboard';
import FilterBar from './scenes/global/FilterBar';
import { GlobalStateProvider } from './scenes/global/GlobalStateProvider';
import Sidenav from './scenes/global/Sidenav';
import { getTheme } from './theme';

function App() {
  return (
    <GlobalStateProvider>
      <ThemeProvider theme={getTheme()}>
        <CssBaseline />
        <div className="app" style={{ height: '100vh' }}>
          <Sidenav />
          <main className="content">
            <FilterBar />
            <Routes>
              <Route path="/postman-dash" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </GlobalStateProvider>
  );
}

export default App;
