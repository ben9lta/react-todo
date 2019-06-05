import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Switch, Slider, 
        TouchableOpacity, AsyncStorage, Keyboard, Alert, ListView } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";


class newItemPage extends React.Component {
  
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      loading:'true',
      title:'',
      text:'',
      items:[],
      item: {
        title: '',
        text: '',
        key: '',
        complete: '',
        weight: '',
        notification: '',
        dateStart: '',
        dateEnd: '',
      },
      showData: null,
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),

      datePicker: false,

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
        weight: 1,
      },

      style: false,
      keyboardShow: false,
      marginTop: 0,

    }
    this.showData = this.showData.bind(this);
    this.saveData = this.saveData.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
  }

  componentDidMount(){
    // if(!this.state.loading) return
    this.asyncData();   

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({
      keyboardShow: true
    });
  }

  _keyboardDidHide() {
    this.setState({
      keyboardShow: false
    });
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



  showData = async() => {
    let items = await AsyncStorage.getItem('newItem')
    let data = JSON.parse(items)

  }

  saveData = () => {

    if(!this.state.title){
      Alert.alert('Необходимо заполнить заголовок')
      return
    } else {
      const key = Date.now()

      const stateItem = {...this.state.item}
      stateItem.key = key
      stateItem.title = this.state.title
      stateItem.text = this.state.text
      stateItem.complete = this.state.switch.done
      stateItem.weight = this.state.slider.weight
      stateItem.notification = this.state.switch.notification
      stateItem.dateStart = this.state.date.start.date
      stateItem.dateEnd = this.state.date.end.date
  
      this.setState({
        item: stateItem,
      })
  
      const newItems = [
        ...this.state.items,
        {
          ...stateItem
          
        }
      ]
      AsyncStorage.setItem('newItem', JSON.stringify(newItems));
      this.setSource(newItems, newItems, { title: '', text: '',})
  
      this.props.navigation.state.params.showData(stateItem)
      
      
      this.props.navigation.navigate('Home', console.log(newItems), {
          items: this.state.items,
      });
  
  
      Keyboard.dismiss();
  
  
      Alert.alert('Данные добавлены');
    }

    
  }

  setSource(items,itemsDatasource, otherState = {}) {
    this.setState({
      items, 
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ...otherState
    });
    AsyncStorage.setItem('newItem', JSON.stringify(items));
  }

 //=================================================================
 //------------------------- DATE START --------------------------//
 //=================================================================
  showDateTimeStartPicker = () => {
    Keyboard.dismiss();
    const state = {...this.state.date}
    state.start.focus = true
    this.setState({
      date: state
    })

  };
 
  handleDateStartPicked = (date) => {
    date = new Date(date)
    const newDate = date.toString()
    const day = new Date(newDate).getDate(); //Current Date
    const month = (new Date(newDate).getMonth() + 1) < 10 ? `0${(new Date(newDate).getMonth() + 1)}` : new Date(newDate).getMonth() + 1; //Current Month
    // const month = (new Date(newDate).getMonth() + 1)
    const year = new Date(newDate).getFullYear(); //Current Year
    const thisDate = `${day}/${month}/${year}`
    const state = {...this.state.date}
    const stateItem = {...this.state.item}
    stateItem.dateStart = thisDate
    state.start.date = thisDate
    this.setState({
      date: state,
      item: stateItem,
    })

    this.hideDateTimeStartPicker();
  };

  hideDateTimeStartPicker = () => {
    const state = {...this.state.date}
    state.start.focus = false
    this.setState({
      date: state
    })
  };

  //=================================================================
  //--------------------------- DATE END ---------------------------//
  //=================================================================
  showDateTimeEndPicker = () => {
    Keyboard.dismiss();
    const state = {...this.state.date}
    state.end.focus = true
    this.setState({
      date: state
    })

  };
 
  handleDateEndPicked = (date) => {
    date = new Date(date)
    const newDate = date.toString()
    const day = new Date(newDate).getDate(); //Current Date
    const month = (new Date(newDate).getMonth() + 1) < 10 ? `0${(new Date(newDate).getMonth() + 1)}` : new Date(newDate).getMonth() + 1; //Current Month
    const year = new Date(newDate).getFullYear(); //Current Year
    const thisDate = `${day}/${month}/${year}`
    const state = {...this.state.date}
    const stateItem = {...this.state.item}
    stateItem.dateEnd = thisDate
    state.end.date = thisDate
    this.setState({
      date: state,
      item: stateItem,
    })

    this.hideDateTimeEndPicker();
  };

  hideDateTimeEndPicker = () => {
    const state = {...this.state.date}
    state.end.focus = false
    this.setState({
      date: state
    })
  };

 //=================================================================
 //--------------------- Switch Notification ---------------------//
 //=================================================================

  toggleNotif = async() => {
    const stateItem = {...this.state.item}
    if(this.state.switch.notification){
      stateItem.notification = false 
      this.setState({
        switch: {
          notification: false,
          done: false,
        },
        item: stateItem
      })
    } else {
      stateItem.notification = true
      this.setState({
        switch: {
          notification: true,
          done: false,
        },
        item: stateItem
      })
    }
  }

  //=================================================================
  //--------------------- Switch Done ---------------------//
  //=================================================================

  sliderWeight = async (value) => {
    const stateItem = {...this.state.item}
    stateItem.weight = value
    this.setState({ slider: { weight: value }, item: stateItem })
    console.log(this.state.item)
  }

  //=================================================================
  //------------------------- Notification ------------------------//
  //=================================================================
  // scheduleNotification = async () => {
  //   //this.state.items
  //   if (Platform.OS === 'android') {
  //     Expo.Notifications.createChannelAndroidAsync('1', {
  //       name: '1',
  //       sound: true,
  //       vibrate: [0, 250, 250, 250],
  //     });
  //   }
  //   Expo.Notifications.presentLocalNotificationAsync({
  //     title: 'New Message',
  //     body: 'Message!!!!',
  //     android: {
  //       channelId: '1',
  //     },
  //   });
  // };
  //=================================================================
  //=================================================================

  render() {
    const minDay = new Date()
    let startDateString = this.state.date.start.date
    startDateString = startDateString.split('/')
    let startDate = new Date()
    startDate.setDate(startDateString[0])
    startDate.setMonth(startDateString[1] > '9' ? startDateString[1] : startDateString[1]-1)
    startDate.setFullYear(startDateString[2])

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header_buttons}>
            <TouchableOpacity style={{ ...styles.header_button }}
              onPress={this.saveData}>
              <Text style={styles.header_button_text}>
                Сохранить
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView>
        <View 
          { ...this.state.style && this.state.keyboardShow ? style={marginTop: this.state.marginTop} : style={marginTop: 0}}
        >
          <View style={styles.switch_text}>
            <Text style={{width: '50%'}}>Уведомления: {this.state.switch.notification ? ' Включены' : ' Выключены'}</Text>
            <Switch value={this.state.switch.notification} enabled
              onValueChange={() => {this.toggleNotif()}} style={{width: '50%', alignItems:'flex-end', flexDirection: 'row', position: 'relative'}} 
            />
          </View>
          <View style={{ ...styles.switch_done }}>
            <Text style={{ width: '50%' }}>Важность: {this.state.slider.weight}</Text>
            <Slider minimumValue={1} maximumValue={5} onValueChange={(value) => this.sliderWeight(value)}
              value={this.state.slider.weight} style={{ width: '50%' }} step={1}></Slider>
          </View>
          <TextInput placeholder='Заголовок' onChangeText={title => this.setState({ title })} style={styles.input}
            placeholderTextColor="#666666"
            onFocus={() => this.setState({
              style: true,
              keyboardShow: true,
              marginTop: -150,
            })}
            onBlur={() => this.setState({
              style: false,
              keyboardShow: false,
              marginTop: 0,
            })}
          >
          </TextInput>
          <View style={styles.col2}>
            <TextInput onFocus={this.showDateTimeStartPicker}
              style={{...styles.input, ...styles.col2_items}}
              placeholder={'Дата начала'}
              placeholderTextColor="#666666"
              value={this.state.date.start.date}
            />
            <TextInput onFocus={this.showDateTimeEndPicker}
              style={{...styles.input, ...styles.col2_items}}
              placeholder={'Дата окончания'}
              placeholderTextColor="#666666"
              value={this.state.date.end.date}
            />
          </View>
          <View>
            {
              this.state.date.start.focus ?
                <DateTimePicker
                  minimumDate={minDay}
                  isVisible={this.state.date.start.focus}
                  onConfirm={this.handleDateStartPicked}
                  onCancel={this.hideDateTimeStartPicker}>
                </DateTimePicker> : null
            }
            {
              this.state.date.end.focus ?
                <DateTimePicker
                  minimumDate={startDate}
                  // minimumDate={minDay}
                  isVisible={this.state.date.end.focus}
                  onConfirm={this.handleDateEndPicked}
                  onCancel={this.hideDateTimeEndPicker}>
                </DateTimePicker> : null
            }
          </View>
          <View style={{marginLeft: '3%', marginTop: '-10%'}}>
            <TextInput 
              style={{ height: 150, width: '97%', borderColor: 'black', borderWidth: 1, 
                borderRadius: 10, backgroundColor: '#fff', textAlignVertical: 'top',
                padding: 10,
                marginTop: 5,
              }}
              placeholder='Текст' 
              onChangeText={text => this.setState({ text })}
              placeholderTextColor="#666666"
              editable={true}
              multiline={true}
              onFocus={() => this.setState({
                style: true,
                keyboardShow: true,
                marginTop: -300,
              })}
              onBlur={() => this.setState({
                style: false,
                keyboardShow: false,
                marginTop: 0,
              })}
            />
          </View>
        </View> 
        </ScrollView>
      </View>
    )
  }
}
export default newItemPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  header: {
    backgroundColor: '#1D76A6',
    paddingTop: 15,
    paddingBottom: 50,
  },
  input: {
    backgroundColor: '#fff', 
    color: '#061431',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    margin: 10,

  },
  header_buttons:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  header_button: {
    width: '40%',
    right: 1,
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#CC440E',
    borderColor: '#EDEEF0',
    borderRadius: 5,
    borderWidth: 1,
  },
  header_button_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,

  },
  col2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 75,

  },
  col2_items: {
    width: '45%',
    height: 50
  },
  switch_text: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    width: '95%',
    marginLeft: '2.5%',
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    padding: 10,
    marginBottom: 10,
  },
  switch_notif: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: '95%',
    marginLeft: '2.5%',
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    padding: 10,
    marginBottom: 10,
  },
  switch_done: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: '95%',
    marginLeft: '2.5%',
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    padding: 10,
    marginBottom: 10,
  }


});