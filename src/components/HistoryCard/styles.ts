import styled from "styled-components/native";
import { RFValue } from 'react-native-responsive-fontsize';

type ContainerProps = {
  color: string;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;

  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 13px 24px;
  margin-bottom: 10px;

  border-left-width: 5px;
  border-left-color: ${({ color }) => color};
`;

export const Title = styled.Text`
  font-family: ${({ theme}) => theme.fonts.regular};
  color: ${({ theme}) => theme.colors.text_dark};
  font-size: ${RFValue(15)}px;
`;

export const Amount = styled.Text`
  font-family: ${({ theme}) => theme.fonts.bold};
  color: ${({ theme}) => theme.colors.text_dark};
  font-size: ${RFValue(15)}px;
`;