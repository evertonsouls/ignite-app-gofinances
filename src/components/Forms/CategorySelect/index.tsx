import React from 'react';

import { 
  Container,
  Category,
  Icon,
} from './styles';

type CategorySelectProps = {
  title: string;
  onPress: () => void;
}

export function CategorySelect({ title, onPress }: CategorySelectProps) {

  return (
    <Container onPress={onPress}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}