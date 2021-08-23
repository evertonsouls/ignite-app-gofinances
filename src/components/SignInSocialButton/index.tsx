import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';
import { Content, IconContainer, Title } from './styles';

interface SignInSocialButtonProps extends RectButtonProps {
  title: string;
  icon: React.FC<SvgProps>;
}

export function SignInSocialButton({ title, icon: Icon, ...rest }: SignInSocialButtonProps) {
  return (
    <Content
      {...rest}
    >
      <IconContainer>
        <Icon />
      </IconContainer>
      <Title>{title}</Title>
    </Content>
  );
}