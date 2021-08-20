import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import { Button } from '../../components/Forms/Button';
import { CategorySelect } from '../../components/Forms/CategorySelect';
import { InputForm } from '../../components/Forms/InputForm';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectList } from '../CategorySelectList';
import { useNavigation } from '@react-navigation/native';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
} from './styles';

type FormData = {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  amount: Yup.number()
    .typeError('Amount must be number')
    .positive('Amount must be positive')
    .required('Amount is required')
})

export function Register() {
  const navigation = useNavigation()

  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpened, setCategoryModalOpened] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Category'
  });
  
  const {
    control, 
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleOpenSelectCategory() {
    setCategoryModalOpened(true);
  }

  function handleCloseSelectCategory() {
    setCategoryModalOpened(false);
  }

  async function handleRegister(form: FormData) {
    if(!transactionType) {
      return Alert.alert('Select transaction type.')
    }

    if(category.key === 'category') {
      return Alert.alert('Select category.')
    }

    const transaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date(),
    }

    try { 
      const dataKey = '@gofinances:transactions';

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const collectionData = [
        ...currentData,
        transaction
      ];

      const sortedData = collectionData.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      console.log(sortedData);

      await AsyncStorage.setItem(dataKey, JSON.stringify(sortedData));

      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Category'
      });
      reset();

      navigation.navigate('Dashboard');
    } catch(error) {
      console.log(error);
      Alert.alert('Error saving register');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Register</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              error={errors.name?.message}
              placeholder="Name" 
              autoCapitalize="sentences"
              autoCorrect={false}
            />
            <InputForm 
              name="amount"
              error={errors.amount?.message}
              control={control}
              placeholder="Price"
              keyboardType="numeric"
            />

            <TransactionTypes>
              <TransactionTypeButton 
                title="Income" 
                type="up"
                isActive={transactionType === 'up'}
                onPress={() => handleTransactionTypeSelect('up')}
              />
              <TransactionTypeButton 
                title="Outcome" 
                type="down"  
                isActive={transactionType === 'down'}
                onPress={() => handleTransactionTypeSelect('down')}
              />
            </TransactionTypes>

            <CategorySelect 
              title={category.name}
              onPress={handleOpenSelectCategory}
            />
          </Fields>

          <Button 
            title="Send" 
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpened}>
          <CategorySelectList
            category={category}
            setCategory={setCategory}          
            closeCategorySelect={handleCloseSelectCategory}
          />
        </Modal>
     </Container>
  </TouchableWithoutFeedback>
  )
}