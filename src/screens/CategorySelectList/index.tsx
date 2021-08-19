import React from 'react';
import { FlatList } from 'react-native';
import { 
  Container, 
  Header, 
  Title, 
  Category,
  CategoryIcon,
  CategoryName,
  Separator,
  Footer
} from './styles';

import { categories } from '../../utils/categories';
import { Button } from '../../components/Forms/Button';

type Category = {
  key: string;
  name: string;
}

type CategorySelectListProps = {
  category: Category;
  setCategory: (category: Category) => void;
  closeCategorySelect: () => void;
}

export function CategorySelectList({
  category,
  setCategory,
  closeCategorySelect,
}: CategorySelectListProps) {

  return (
    <Container>
      <Header>
        <Title>Category</Title>
      </Header>

      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({item}) => {
          return (
            <Category
              onPress={() => setCategory(item)}
              isActive={item.key === category.key}
            >
              <CategoryIcon name={item.icon}/>
              <CategoryName>{item.name}</CategoryName>
            </Category>
          )
        }}
      />

      <Footer>
        <Button 
          title="Select" 
          onPress={closeCategorySelect} 
        />
      </Footer>
    </Container>
  )
}