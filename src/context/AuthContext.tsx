import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

type GoogleAuthorizationResponse = {
  params: {
    access_token: string;
  },
  type: string;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

export type AuthContextData = {
  user?: User;
  isLoading: boolean;
  signOut: () => void;
  signInWithGoogle: () => void;
  signInWithApple: () => void;
}

const userKey = '@gofinances:user';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserInfo() {
      const response = await AsyncStorage.getItem(userKey);
      const userInfo = response ? JSON.parse(response) : undefined;

      if (userInfo) {
        setUser(userInfo)
      }

      setIsLoading(false);
    }

    loadUserInfo();
  }, [])

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      
      const { type, params } = await AuthSession.startAsync({ authUrl }) as GoogleAuthorizationResponse;

      if (type === 'success'){
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userData = await response.json();
        const userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.given_name,
          photo: userData.picture,
        };

        setUser(userInfo);
        await AsyncStorage.setItem(userKey, JSON.stringify(userInfo));
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      if (credential) {
        const userInfo = {
          id: credential.user,
          email: credential.email!,
          name: credential.fullName!.givenName!,
          photo: `https://ui-avatars.com/api/?name=${credential.fullName!.givenName!}&length=1`,
        }; 

        setUser(userInfo);
        await AsyncStorage.setItem(userKey, JSON.stringify(userInfo));
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signOut() {
    setUser(undefined);
    await AsyncStorage.removeItem(userKey);
  }

  return (
    <AuthContext.Provider value={{ 
        user, 
        isLoading, 
        signOut,
        signInWithGoogle, 
        signInWithApple 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}