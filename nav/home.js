import React from 'react';
import { StyleSheet, AppRegistry, Text, View, TextInput, ScrollView, TouchableOpacity, TouchableElement, AsyncStorage, Button, Keyboard, Alert, ListView, Row } from 'react-native';

class Home extends React.Component {
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
    }
    this.setSource = this.setSource.bind(this);
    this.showData = this.showData.bind(this);
    this.renderData = this.renderData.bind(this);
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
    //AsyncStorage.setItem('newId', this.state.id);
    this.setSource(newItems, newItems, { title: '', text: '',})
    this.showData();

    Keyboard.dismiss();
  }

  componentDidMount(){
    
    this.asyncData()
    //AsyncStorage.clear();
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

  clickOnItem = async(item) => {
    try {
      await AsyncStorage.removeItem(item);
      return true;
    }
    catch(exception) {
      return false;
    }
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

  OpenSelectedItem = (data) => {
    this.props.navigation.navigate('selectedItemPage', { data: data });
    // console.log(data)
  }

  renderData = async(_items) => {
    AsyncStorage.setItem('newItem', JSON.stringify(_items));
    let items = await AsyncStorage.getItem('newItem')
    let data = JSON.parse(items)
    this.setSource(data, data, {loading: false});
  
  }


  render() {
    return (
      <View style={styles.container}>
        <ListView 
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={(data) =>
            <View style={styles.dataView} >
              {/* <Text style={styles.dataViewTitle} onPress={this.OpenSelectedItem.bind(this, data)}>{data.title}</Text> */}
              <Text style={styles.dataViewTitle} onPress={() => {
                this.props.navigation.navigate('selectedItemPage', { 
                  dataItem: data, 
                  allData: this.state.items, 
                  showData: this.showData,
                  renderData: this.renderData
                })
              }}>
                {data.title}
              </Text>
            </View>}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                
        >
        </ListView>
        <Button title="Показать данные" onPress={() => {this.showData()}}></Button>

        <TouchableOpacity style={styles.bottomButton} onPress={() => this.props.navigation.navigate('newItemPage', { showData: this.showData })}>
            <Text style={styles.addText}>+</Text>
          {/* <Button title="Перейти" onPress={() => this.props.navigation.navigate('newItemPage')} ></Button> */}
        </TouchableOpacity>
        
      </View>
    );
  }
}


export default Home;


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
