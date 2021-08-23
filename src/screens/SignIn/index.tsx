import React, { useState } from 'react';
import { Platform, ActivityIndicator, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/useAuth';
import LogoSvg from '../../assets/logo.svg';
import GoogleSvg from '../../assets/google.svg';
import AppleSvg from '../../assets/apple.svg';
import { 
  Container, 
  Header, 
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles';

export function SignIn() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const {
    signInWithGoogle,
    signInWithApple
  } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      Alert.alert('Error connecting with Google');
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      Alert.alert('Error connecting with Apple');
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Control your{'\n'}
            finances very{'\n'}
            simply
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Login with one of{'\n'}
          the accounts below
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Login with Google"
            icon={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === 'ios' && (
            <SignInSocialButton
              title="Login with Apple"
              icon={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator 
            size="small" 
            style={{ marginTop: 15 }} 
            color={theme.colors.shape} 
          />
        )}
      </Footer>
    </Container>
  );
}