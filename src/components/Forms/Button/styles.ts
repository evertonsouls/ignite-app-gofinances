import styled from "styled-components/native";
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled(RectButton)`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  width: 100%;

  padding: 18px;

  align-items: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;

  color: ${({ theme}) => theme.colors.shape};
`;