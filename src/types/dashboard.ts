
import { ReactNode } from 'react';

export type MenuItem = {
  name: string;
  path: string;
  icon: ReactNode;
};

export type Theme = 'light' | 'dark' | 'system';
