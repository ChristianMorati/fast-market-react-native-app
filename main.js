import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

// Função para verificar se o token está expirado
const isTokenExpired = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      // Verifique se o token está expirado
      return decodedToken.exp < currentTime;
    }
    return true; // Se não houver token, considere como expirado
  } catch (error) {
    console.error('Erro ao verificar expiração do token:', error);
    return true;
  }
};

// Exemplo de uso em algum lugar do seu aplicativo
const checkTokenExpiration = async () => {
  const isExpired = await isTokenExpired();
  if (isExpired) {
    // Redirecione para a página de login ou renove o token
    console.log('Token expirado. Redirecionando para a página de login...');
  } else {
    // Continue com a lógica normal
    console.log('Token válido. Continue com a lógica do aplicativo...');
  }
};

// Chame a função de verificação sempre que necessário
checkTokenExpiration();
