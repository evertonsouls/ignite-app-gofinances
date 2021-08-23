import { useContext } from 'react';
import { AuthContext, AuthContextData } from '../context/AuthContext';

type UseAuthResult = AuthContextData & { 
  dataKey: string;
}

export function useAuth(): UseAuthResult {
  const context = useContext(AuthContext);
  const dataKey = `@gofinances:transactions_user:${context?.user?.id || ''}`;

  return { ...context, dataKey };
}