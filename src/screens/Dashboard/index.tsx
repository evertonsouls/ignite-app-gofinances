import React from 'react';
import { 
  Container, 
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
} from './styles'

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
       </UserWrapper>
      </Header>      
    </Container>
  );
}