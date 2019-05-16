import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, TouchableElement, AsyncStorage, Button, Keyboard, Alert, ListView, Row } from 'react-native';
import Main from './Main'
import { createStackNavigator, createAppContainer } from "react-navigation";
import newItemPage from './nav/newItemPage'

class App extends React.Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      loading:'true',
      title:'',
      text:'',
      items:[],
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    }
    this.setSource = this.setSource.bind(this);
    // this.showData = this.showData.bind(this);
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
        complete: false
      }
    ]
    AsyncStorage.setItem('newItem', JSON.stringify(newItems));
    this.setSource(newItems, newItems, { title: '', text: '',})

    Keyboard.dismiss();
  }

  componentDidMount(){
    AsyncStorage.getItem('newItem').then((json)=>{
      if(json === null) return;
      try {
        const items = JSON.parse(json);
        this.setState({items: json});
        this.setSource(items, items, {loading: false});
        console.log(items);
        // console.log(json);
      } catch(e) {
        console.log(e + '-> error')
        this.setState({
          loading: false,
        });
      }
    })
    //AsyncStorage.clear();
  }

  showData = async() => {
    let items = await AsyncStorage.getItem('newItem')
    let data = JSON.parse(items)
    console.log('------------------------')
    console.log(data)
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
    // if(this.props.navigation.isFocused()) return console.log('----------->tuta<----------');
    return (

      <View style={styles.container}>
        <ListView 
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={(data) =>
              <View style={styles.dataView}>
                <Text style={styles.dataViewTitle}>{data.title}</Text>
              </View>}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        >
        </ListView>
        <Button title="Показать данные" onPress={this.showData}></Button>

        <TouchableOpacity style={styles.bottomButton} onPress={() => this.props.navigation.navigate('newItemPage')}>
            <Text style={styles.addText}>+</Text>
          {/* <Button title="Перейти" onPress={() => this.props.navigation.navigate('newItemPage')} ></Button> */}
        </TouchableOpacity>
        
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    home: {
      screen: App,
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
      navigationOptions: {
        headerStyle: {
          backgroundColor: '#1D76A6',

        },
        headerTintColor: '#FFFFFF',
        title: 'Новая заметка',
      },
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
