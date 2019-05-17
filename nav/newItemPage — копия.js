import React, { Component } from 'react';
import { StyleSheet, AppRegistry, Text, View, TextInput, ScrollView, TouchableOpacity, AsyncStorage, Button, Keyboard, Alert, ListView } from 'react-native';
import App from '../App.js';


class newItemPage extends React.Component {
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
    this.showData = this.showData.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount(){
    console.log(this.props.navigation)
    if(!this.state.loading) return
    this.asyncData();
    
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
        
      } catch(e) {
        console.log(e + '-> error')
        this.setState({
          loading: false,
        });
      }
    })
  }



  

  saveData = () => {
    
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
    
    this.props.navigation.navigate('home', console.log(newItems), {
        items: this.state.items,
        // asyncData
    });

    // this.showData();
    //this.setSource(data, data, {loading: false});
    this.showData
    Keyboard.dismiss();



    Alert.alert('Данные добавлены');
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
      <View style={styles.container}>
        <View style={styles.header}>
        
        </View>
        <TextInput placeholder='Заголовок' onChangeText={title => this.setState({title})} style={styles.input}>

        </TextInput>
        <TextInput placeholder='Текст' onChangeText={text => this.setState({text})} style={styles.input}>

        </TextInput>
        <Button title='Сохранить'
        onPress={this.saveData}
        color='green'></Button>

        <Button title="Показать данные" onPress={this.showData}></Button>
          
      </View>
    )
  }
}
export default newItemPage

// AppRegistry.registerComponent('newItemPage', () => App);

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

  }
});