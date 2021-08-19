import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '../../components/Forms/Button';
import { CategorySelect } from '../../components/Forms/CategorySelect';
import { InputForm } from '../../components/Forms/InputForm';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectList } from '../CategorySelectList';

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
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpened, setCategoryModalOpened] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Category'
  });
  
  const {
    control, 
    handleSubmit,
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

  function handleRegister(form: FormData) {
    if(!transactionType) {
      return Alert.alert('Select transaction type.')
    }

    if(category.key === 'category') {
      return Alert.alert('Select category.')
    }

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    }

    console.log(data);
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