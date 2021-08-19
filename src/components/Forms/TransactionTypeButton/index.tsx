import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { Container, Button, Icon, Title } from './styles';

type TransactionTypeButtonProps = RectButtonProps & {
  title: string;
  type: 'up' | 'down';
  isActive?: boolean;
}

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
}

export function TransactionTypeButton({title, type, isActive = false, ...rest} : TransactionTypeButtonProps) {
  return (
    <Container
      type={type}
      isActive={isActive}
    >
      <Button {...rest}>
        <Icon 
          type={type} 
          name={icons[type]} 
        />
        <Title
          isActive={isActive}
        >
          {title}
        </Title>
      </Button>
    </Container>
  );
};