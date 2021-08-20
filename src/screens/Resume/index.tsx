import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, subMonths, format } from 'date-fns';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import { 
  LoadingContainer,
  Container, 
  Header, 
  Title, 
  ChartContainer,
  ListOfCategories,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';

type TransactionData = {
  category: string;
  transactionType: 'up' | 'down'
  amount: number | string;
  date: string;
}

type CategoryEntries = {
  [key: string]: number;
}

type CategoryData = {
  key: string;
  name: string;
  percent: string;
  color: string;
  total: number;
  totalFormatted: string;
}

export function Resume() {
  const theme = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState<CategoryData[]>([]);

  async function loadData() {

    setIsLoading(true);
    
    const dataKey = '@gofinances:transactions';

    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted : TransactionData[] = response ? JSON.parse(response) : [];

    const expensive = responseFormatted.filter(item => {
      return item.transactionType === 'down' &&
        new Date(item.date).getMonth() === selectedDate.getMonth() &&
        new Date(item.date).getFullYear() === selectedDate.getFullYear();
    });

    let totalCategories = 0;

    const totalExpensive: CategoryEntries = expensive.reduce((reducer, item) => {
      
      if (!reducer[item.category]) {
        reducer[item.category] = 0;
      }

      reducer[item.category] +=  Number(item.amount);

      totalCategories += Number(item.amount);

      return reducer;
    }, {} as CategoryEntries);  

    const totalByCategory = Object.entries(totalExpensive).map( ([key, total]) => {
      const { name, color } = categories.find(find => find.key === key)!;

      const percent =  `${(total / totalCategories * 100).toFixed(0)}%`;
      const totalFormatted =  total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

      return {
        key,
        name,
        color,
        total,        
        percent,
        totalFormatted,
      } as CategoryData;
    });

    setData(totalByCategory)
    setIsLoading(false);
  }

  useFocusEffect(useCallback( () => {
    loadData();
  }, [selectedDate]));

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    }
    else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  return (
    <Container>
      <Header>
        <Title>Resume by categories</Title>
      </Header>

      {isLoading && <LoadingContainer color={theme.colors.secondary} />}

      {!isLoading && (
        <ListOfCategories
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flex: 1, 
            paddingHorizontal: 24,
            paddingBottom: bottomTabBarHeight,
          }}
        >

          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <SelectIcon name="chevron-left" />
            </MonthSelectButton>
            <Month>
              {format(selectedDate, 'MMMM, yyyy')}
            </Month>
            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <SelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={data}
              x="percent"
              y="total"
              labelRadius={50}
              colorScale={data.map(({ color }) => color)}
              style={{
                labels: { 
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape,
                },
              }}
            />
          </ChartContainer>

          {data.map(({ key, color, name, totalFormatted}) => {        
            return (
              <HistoryCard 
                key={key}
                color={color}
                title={name}
                amount={totalFormatted}
              />
            )
          })}
        </ListOfCategories>
      )}
    </Container>
  );
}