import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardData } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';

import { 
  LoadingContainer,
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
import { useAuth } from '../../hooks/useAuth';

type HighlightProps = {
  amount: string;
  lastTransaction: string;
}

type HighlightData = {
  entries: HighlightProps;
  expensive: HighlightProps;
  total: HighlightProps;
}

type DataListProps = TransactionCardData & {
  id: string;
}

const dateFormat = Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit'
});

const formatNumber = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: "USD"
  })
}

export function Dashboard() {
  const theme = useTheme();  
  const { signOut, user, dataKey } = useAuth();

  function getLastTransactionDateByType(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
  ) {
    const filteredCollection = collection.filter(item => item.type === type);
    if (filteredCollection.length === 0) {
      return 'Not transaction registered';
    }

    const lastTransaction = new Date(Math.max.apply(
        Math, filteredCollection
          .map(item => new Date(item.date).getTime()
        )
      )
    );

    const month = lastTransaction.toLocaleString('en-US', {month: 'long'});
    
    return `Last transaction ${lastTransaction.getDate()} of ${month}`;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>();

  let entriesTotal = 0;
  let expensiveTotal = 0;

  async function loadTransactions() {
    const transactionStore = await AsyncStorage.getItem(dataKey)

    const currentData = transactionStore ? JSON.parse(transactionStore) : [];

    const transactions : DataListProps[] = currentData.map(item => {
      const type = item.transactionType === 'up' ? 'positive' : 'negative';

      if (type === 'positive') {
        entriesTotal += Number(item.amount);
      }
      else {
        expensiveTotal += Number(item.amount);
      }

      const amount = formatNumber(Number(item.amount));

      const date = dateFormat.format(new Date(item.date));

      const category = categories.find(category => category.key === item.category);
      
      return {
        id: item.id,
        title: item.name,
        amount,
        category,
        type,
        date
      }
    });

    const lastEntriesTransaction = getLastTransactionDateByType(transactions, 'positive');
    const lastExpensiveTransaction = getLastTransactionDateByType(transactions, 'negative');
    
    const lastTransactionDate = transactions.length > 0 ? new Date(transactions[0].date) : null;
    const lastTransaction = lastTransactionDate 
      ? `Last transaction 
        ${lastTransactionDate.getDate()} of 
        ${lastTransactionDate.toLocaleString('en-US', { month: 'long' })}`
      : 'Not transaction registered';
        
    const total = entriesTotal -  expensiveTotal;

    setData(transactions);
    setHighlightData({
      entries: { 
        amount: formatNumber(entriesTotal),
        lastTransaction: lastEntriesTransaction
      },
      expensive: { 
        amount: formatNumber(expensiveTotal),
        lastTransaction: lastExpensiveTransaction
      },
      total: { 
        amount: formatNumber(total),
        lastTransaction 
      }
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback( () => {
    loadTransactions();
  }, []));

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer color={theme.colors.secondary} />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo 
              source={{ uri: user?.photo }} 
            />
            <User>
              <UserGreeting>Hello,</UserGreeting>
              <UserName>{user!.name}</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={signOut}>
            <Icon name="power" />
          </LogoutButton>

       </UserWrapper>
      </Header>      
      
      <HighlightCards>
        <HighlightCard 
          title="Incoming" 
          amount={highlightData?.entries.amount || '0'}
          lastTransaction={highlightData?.entries.lastTransaction || ''}
          type="up"
        />
        <HighlightCard
          title="Outcome" 
          amount={highlightData?.expensive.amount || '0'}
          lastTransaction={highlightData?.expensive.lastTransaction || ''}
          type="down"
        />
        <HighlightCard
          title="Total" 
          amount={highlightData?.total.amount || '0'}
          lastTransaction={highlightData?.total.lastTransaction || ''}
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