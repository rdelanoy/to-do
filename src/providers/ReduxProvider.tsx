'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { Props } from '@/types/types';

export function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
