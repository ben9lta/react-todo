import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableElement, AsyncStorage, Button, ListView, Platform } from 'react-native';
import {Permissions, Notifications} from 'expo';

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
      notifications: {},
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    }
    this.setSource = this.setSource.bind(this);
    this.showData = this.showData.bind(this);
    this.renderData = this.renderData.bind(this);
    // this.setNotif = this.setNotif.bind(this);
    // this.sendNotificationImmediately = this.sendNotificationImmediately.bind(this)
    this.scheduleNotification = this.scheduleNotification.bind(this)
    // this.saveData = this.saveData.bind(this);
  }

  componentDidMount(){
    
    this.asyncData()
    // this.sendNotificationImmediately()
    //console.log(this.state.items)
    //AsyncStorage.clear();

    // AsyncStorage.getItem('notification').then((json)=>{
    //   if(json === null) return;
    //   try {
    //     const items = JSON.parse(json);
    //     // this.setNotif(items)
    //     //console.log(json);
    //     console.log(items)
    //     console.log('Загружено notification')
        
    //   } catch(e) {
    //     console.log(e + '-> error')
    //   }
    // })
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

  askPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== granted) {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== granted) {
      return false;
    }
    return true;
  };

  scheduleNotification = async (item) => {
    if (item.notification) {
      const id = item.key
      console.log(id)
      if (Platform.OS === 'android') {
        Expo.Notifications.createChannelAndroidAsync(id.toString(), {
          name: id.toString(),
          sound: true,
          vibrate: [0, 250, 250, 250],
        });
      }
  
      Expo.Notifications.presentLocalNotificationAsync({
        // title: 'New Message',
        title: 'Важное дело',
        body: item.title,
        android: {
          channelId: id.toString(),
        },
      });
    } else {
      console.log('BAN')
    }

    let currentDate = Date.now();
    currentDate = new Date(currentDate);

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let date = currentDate.getDate();

    let not0 = new Date(year, month, date, 13,48, 30);
        not0 = Date.parse(not0);
  };

  showData = async(item) => {
    let items = await AsyncStorage.getItem('newItem')
    let data = JSON.parse(items)
    // console.log('------------------------')
    // console.log(data)
    this.setSource(data, data, {loading: false});
    console.log('***************')
    console.log(item)
    console.log('****************')
    item ? this.scheduleNotification(item) : null

    // this.setNotif(items)
    // AsyncStorage.setItem('notification', JSON.stringify(items));
    // let notif = await AsyncStorage.getItem('notification')
    // let notifData = JSON.parse(notif)

    // console.log('===============NOTIFICATION================')
    // console.log(this.state.notifications)
    // console.log('===========================================')
  }

  // setNotif(items){
  //   this.setState({notifications: items})
  //   // AsyncStorage.setItem('notification', JSON.stringify(items));
  // }

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
            }}>
                <View style={styles.dataView} >
                  <Text style={styles.dataViewTitle} >
                    {data.title}
                  </Text>
                  <Text>{data.dateStart}</Text>
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
