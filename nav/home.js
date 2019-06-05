import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ListView, Button} from 'react-native';
import {CheckBox} from 'native-base'

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
      checkedItem: [],
      notifications: {},
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      longPressItem: false,
    }
    this.setSource = this.setSource.bind(this);
    this.showData = this.showData.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  componentDidMount(){
    this.asyncData()
  }

  asyncData(){
    AsyncStorage.getItem('newItem').then((json)=>{
      if(json === null) return;
      try {
        const items = JSON.parse(json);
        this.setState({items: json});
        this.setSource(items, items, {loading: false});     
      } catch(e) {
        console.log(e + '-> error')
        this.setState({
          loading: false,
        });
      }
    })
  }

  showData = async(item) => {
    let items = await AsyncStorage.getItem('newItem')
    let data = JSON.parse(items)
    this.setSource(data, data, {loading: false});

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
  }

  renderData = async(_items) => {
    AsyncStorage.setItem('newItem', JSON.stringify(_items));
    let items = await AsyncStorage.getItem('newItem')
    let data = JSON.parse(items)
    this.setSource(data, data, {loading: false});
  
  }

  changeItems(data, state){
    //console.log(data)
    let newItems = state
    state.map((item, index) => {
      
      if (item.key === data.key) {
        if (index !== -1) {
          // newItems.splice(index, 1)
          // newItems.push(data);
          newItems[index].complete = data.complete
        }
      }
    });

    this.renderData(newItems)
  }

  handleCheckBox = (data) => {
    if(false === data.complete){
      data.complete = true
    }
    else 
    {
      data.complete = false
    }

    this.changeItems(data, this.state.items)  
  }


  render() {

    return (
      <View style={styles.container}>
        {this.state.items.length > 0 ? 
        <ListView 
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={(data) =>
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('selectedItemPage', {
                  dataItem: data,
                  allData: this.state.items,
                  showData: this.showData,
                  renderData: this.renderData
                })
              }}
                onLongPress={() => this.setState({
                  longPressItem: true
                })}
              >
                <View style={data.complete ? styles.dataViewComplete : styles.dataView} >
                  <View style={styles.row2}>
                    <View style={{...styles.colorView, backgroundColor: data.complete ? 'red' : '#447BD4'}} />
                    <View style={styles.col2}>
                      <Text style={styles.dataViewTitle} >
                        {data.title}
                      </Text>
                      <Text>{data.dateStart}</Text>
                    </View>
                    <View style={styles.rowCenter}>
                      {this.state.longPressItem ? 
                      <CheckBox style={{marginRight: 25}} 
                        checked={data.complete} 
                        onPress={() => this.handleCheckBox(data)}
                      >
                      </CheckBox> 
                      : 
                      null
                      }
                    </View>
                  </View>
                  
                </View>
               
            </TouchableOpacity>
            }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                
        >
        </ListView>
        : <Text style={{
          paddingLeft: 10, paddingTop: 10, height: 60, 
          justifyContent: 'center', alignContent: 'center', 
          color: '#F30000',
          fontSize: 26, width: '100%',}}>Записей нет</Text>
        }
        
        {this.state.longPressItem ? 
        <View>
          <Button title='Принять' onPress={() => this.setState({
            longPressItem: false
          })}></Button>
        </View>
        : 
        <TouchableOpacity style={styles.bottomButton} 
          onPress={() => this.props.navigation.navigate('newItemPage', { showData: this.showData })}>
            <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
        }
        
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
    backgroundColor: '#000',
  },
  dataView: {
    height: 60,
    // marginLeft: 12,
    justifyContent: 'center',
    backgroundColor: '#E2E4CE'
  },
  dataViewComplete: {
    height: 60,
    // marginLeft: 10,
    justifyContent: 'center',
    // backgroundColor: '#D7D5D5'
    backgroundColor: '#E2E4CE'
    
  },
  colorView: {
    // backgroundColor: 'red',
    paddingLeft: 5,
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
  addText: {
    fontSize: 25,
    color: '#fff',
  },
  col2: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 5,
    paddingLeft: 10,
  },
  row2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowCenter: {
    justifyContent: 'center'
  }
});
