import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from '../src/routes/index';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
