import { theme } from 'antd';

import { type TTheme } from './app.zustand';

export const defaultTheme: TTheme = {
  token: {
    colorPrimary: '#686de0',
    colorInfo: '#3498db',
    colorSuccess: '#27ae60',
    colorWarning: '#f39c12',
    colorError: '#c0392b',
    colorLink: '#3498db',
    borderRadius: 8,

    fontFamily: 'Noto Sans Display, sans-serif',
    fontFamilyCode: 'Chivo Mono, monospace',
  },
  algorithm: [theme.defaultAlgorithm],
};
