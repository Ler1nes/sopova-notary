import { createRoot } from 'react-dom/client';

import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';

import './styles/tokens.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/responsive.css';

import App from './App';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
