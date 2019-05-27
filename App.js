import React from 'react';
import { StyleSheet, AppRegistry, AsyncStorage, Keyboard, Alert, ListView } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { HeaderBackButton } from 'react-navigation';

import newItemPage from './nav/newItemPage'
import Home from './nav/home'
import selectedItemPage from './nav/selectedItemPage'




class App extends React.Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      loading:'true',
      title:'',
      text:'',
      id: 1,
      items:[],
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),

      date: {
        start: {
          focus: false,
          date: '',
        },
        end: {
          focus: false,
          date: '',
        },
      },

      switch: {
        notification: false,
        done: false,
      },

      slider: {
        weight: 0,
      },
    }
    this.setSource = this.setSource.bind(this);
    this.showData = this.showData.bind(this);
    // this.saveData = this.saveData.bind(this);
  }
  saveData = () => {
    Alert.alert('Данные добавлены');
    //AsyncStorage.setItem('newItem', JSON.stringify(newItem));

    if(!this.state.title || !this.state.text) return;
    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        title: this.state.title,
        text: this.state.text,
        complete: this.state.switch.done,
        weight: this.state.slider.weight,
        notification: this.state.switch.notification,
        dateStart: this.state.date.start.date,
        dateEnd: this.state.date.end.date,
      }
    ]
    AsyncStorage.setItem('newItem', JSON.stringify(newItems));
    //AsyncStorage.setItem('newId', this.state.id);
    this.setSource(newItems, newItems, { title: '', text: '',})
    this.showData();

    Keyboard.dismiss();
  }

  componentDidMount(){
    
    this.asyncData()
    // AsyncStorage.clear();
  }

  

  asyncData(){
    AsyncStorage.getItem('newItem').then((json)=>{
      if(json === null) return;
      try {
        const items = JSON.parse(json);
        this.setState({items: json});
        this.setSource(items, items, {loading: false});
        // console.log(items);
        // console.log(json);
        console.log('Загружено')
        
      } catch(e) {
        console.log(e + '-> error')
        this.setState({
          loading: false,
        });
      }
    })
  }

   
  showData = async() => {
    let items = await AsyncStorage.getItem('newItem')
    let data = JSON.parse(items)
    console.log('------------------------')
    console.log(data)
    this.setSource(data, data, {loading: false});
    //console.log(this.state.id)
  }

  setSource(items,itemsDatasource, otherState = {}) {
    this.setState({
      items, 
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ...otherState
    });
    AsyncStorage.setItem('newItem', JSON.stringify(items));
  }
  

  render() {
    return (
      <AppNavigator/>
    );
  }
}

AppRegistry.registerComponent('newItemPage', () => App);

const AppNavigator = createStackNavigator(
  {
    Home: {
      // screen: App,
      screen: Home,
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#1D76A6',
          // backgroundColor: '#333333',

        },
        headerTintColor: '#FFFFFF',
        // headerTintColor: '#DC2509',
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
        // title: 'Выбраный айтем',
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()}></HeaderBackButton>,
      }),
    },
        
  },
 
);

const AppContainer = createAppContainer(AppNavigator);
//export default createAppContainer(AppNavigator);
export default AppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  header: {
    backgroundColor: '#1D76A6',
    padding: 20,
  },
  input: {
    backgroundColor: '#fff', 
    padding:10,
    margin: 10,

  },
  list: {
    backgroundColor: '#fff'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  dataView: {
    height: 60,
    //alignItems: 'center',
    marginLeft: 12,
    justifyContent: 'center',
  },
  dataViewTitle: {
    fontSize: 20,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#F30C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText:{
    fontSize: 25,
    color: '#fff',
  }
});
