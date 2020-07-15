import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

// useAuth para saber o usuario esta logado ou nao
import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  // Caso ainda esteja carregando os dados do cliente
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    )
  }

  // Se tiver um usuario mostra AppRoutes
  // sano AuthROutes
  return user ? <AppRoutes/> : <AuthRoutes />
}

export default Routes;
