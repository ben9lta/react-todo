import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { HeaderBackButton } from 'react-navigation';

import newItemPage from './nav/newItemPage'
import Home from './nav/home'
import selectedItemPage from './nav/selectedItemPage'

class App extends React.Component {

  render() {
    return (
      <AppNavigator/>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#1D76A6',
        },
        headerTintColor: '#FFFFFF',
        title: 'Заметки',
      },
    },
    newItemPage: {
      screen: newItemPage,
      navigationOptions: ({navigation}) => ({
        headerStyle: {
          backgroundColor: '#1D76A6',
        },
        headerTintColor: '#FFFFFF',
        title: 'Новая заметка',
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()}></HeaderBackButton>,
      }),
    },
    selectedItemPage: {
      screen: selectedItemPage,
      navigationOptions: ({navigation}) => ({
        headerStyle: {
          backgroundColor: '#1D76A6',
        },
        headerTintColor: '#FFFFFF',
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()}></HeaderBackButton>,
      }),
    },
  },
 );

const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
