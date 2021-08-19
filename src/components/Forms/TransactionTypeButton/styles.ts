import styled, { css } from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

type TypeProps = {
  isActive?: boolean;
  type?: 'up' | 'down';
}

export const Container = styled.View<TypeProps>`
  border-width: 1.5px;
  border-style: solid;
  border-color: ${({theme}) => theme.colors.text };

  border-radius: 5px;
  width: 48%;

  ${({ isActive, type }) => isActive && type === 'up' && css`
    background-color: ${({ theme }) => theme.colors.success_light};
    border-color: transparent;
  `};

  ${({ isActive, type }) => isActive && type === 'down' && css`
    background-color: ${({ theme }) => theme.colors.attention_light};
    border-color: transparent;
  `};
`;

export const Button = styled(RectButton)<TypeProps>`  
  padding: 16px;

  flex-direction: row;
  align-items: center;
`;

export const Icon = styled(Feather)<TypeProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;

  ${({ type }) => type === 'up' && css`
    color: ${({ theme }) => theme.colors.success};
  `};

  ${({ type }) => type === 'down' && css`
    color: ${({ theme }) => theme.colors.attention};
  `};
`;

export const Title = styled.Text<TypeProps>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  
  color: ${({ isActive, theme}) => isActive ? theme.colors.text_dark : theme.colors.text};
`;
