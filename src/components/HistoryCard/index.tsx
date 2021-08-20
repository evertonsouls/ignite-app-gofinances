import React from 'react';

import { Container, Title, Amount } from './styles';

type HistoryCardProps = {
  title: string;
  amount: string;
  color: string;
}

export function HistoryCard({ color, title, amount }: HistoryCardProps) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}