import '@ant-design/v5-patch-for-react-19';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
