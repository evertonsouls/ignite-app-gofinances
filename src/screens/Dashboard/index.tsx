import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardData } from '../../components/TransactionCard';

import { 
  Container, 
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  ListOfTransactions,
} from './styles'

type DataListProps = TransactionCardData & {
  id: string;
}

const data: DataListProps[] = [{
  id: '1',
  type: 'positive',
  title: "Site development",
  amount: "$ 12.000,00",
  category: {
    name: 'Sales',
    icon: 'dollar-sign'
  },
  date: "14/08/2021"
},
{
  id: '2',
  type: 'negative',
  title: "Burger Pizzy",
  amount: "$ 59,00",
  category: {
    name: 'Food',
    icon: 'coffee'
  },
  date: "15/08/2021"
},
{
  id: '3',
  type: 'negative',
  title: "Rent",
  amount: "$ 1.200,00",
  category: {
    name: 'House',
    icon: 'shopping-bag'
  },
  date: "16/08/2021"
}];

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo 
              source={{ uri: 'https://avatars.githubusercontent.com/u/24877270' }} 
            />
            <User>
              <UserGreeting>Hello,</UserGreeting>
              <UserName>Everton</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>

       </UserWrapper>
      </Header>      
      
      <HighlightCards>
        <HighlightCard 
          title="Incoming" 
          amount="$ 17.000,00" 
          lastTransaction="Last transaction 14 of april" 
          type="up"
        />
        <HighlightCard
          title="Outcome" 
          amount="$ 1.259,00" 
          lastTransaction="Last transaction 14 of april" 
          type="down"
        />
        <HighlightCard
          title="Total" 
          amount="$ 16.141,00" 
          lastTransaction="Last transaction 14 of april" 
          type="total"
        />
      </HighlightCards>
    
      <Transactions>
        <Title>Operations</Title>

        <ListOfTransactions 
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TransactionCard data={item} />}          
        />
        
      </Transactions>
    </Container>
  );
}