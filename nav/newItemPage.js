import React, { Component } from 'react';
import { StyleSheet, AppRegistry, Text, View, TextInput, ScrollView, Switch, Slider,
        TouchableOpacity, AsyncStorage, Button, Keyboard, Alert, ListView } from 'react-native';
import App from '../App.js';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Label } from 'native-base';
// import {Textarea} from 'native-base'

// import {DatePicker} from 'native-base'
// import MyDatePicker from '../components/datepicker/mydatepicker'

class newItemPage extends React.Component {
  
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      loading:'true',
      title:'',
      text:'',
      items:[],
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
        weight: 0,
      }

    }
    this.setSource = this.setSource.bind(this);
    this.showData = this.showData.bind(this);
    this.saveData = this.saveData.bind(this);
    //this.showCalendar = this.showCalendar.bind(this);
  }

  componentDidMount(){
    if(!this.state.loading) return
    this.asyncData();
    console.log(this.props.navigation.state.params)
    
    
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



  showData = async() => {
    let items = await AsyncStorage.getItem('newItem')
    let data = JSON.parse(items)
    // console.log('------------------------')
    // console.log(data)
    console.log('=-=-=-=-=-=-=-=-=')
    //console.log(Dpicker)
    
  }

  saveData = () => {
    
    //AsyncStorage.setItem('newItem', JSON.stringify(newItem));

    if(!this.state.title || !this.state.text) return;
    //if(this.state.date.start.date)
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
    this.setSource(newItems, newItems, { title: '', text: '',})

    this.props.navigation.state.params.showData()
    
    
    this.props.navigation.navigate('Home', console.log(newItems), {
        items: this.state.items,
        // asyncData
    });

    // this.showData();
    //this.setSource(data, data, {loading: false});


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

    state.start.date = thisDate
    this.setState({
      date: state
    })

    this.hideDateTimeStartPicker();
  };

  hideDateTimeStartPicker = () => {
    const state = {...this.state.date}
    state.start.focus = false
    this.setState({
      date: state
    })
    console.log('================')
    console.log(this.state.date)
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
    //const month = (new Date(newDate).getMonth() + 1)
    const year = new Date(newDate).getFullYear(); //Current Year
    const thisDate = `${day}/${month}/${year}`
    const state = {...this.state.date}

    state.end.date = thisDate
    this.setState({
      date: state
    })

    this.hideDateTimeEndPicker();
  };

  hideDateTimeEndPicker = () => {
    const state = {...this.state.date}
    state.end.focus = false
    this.setState({
      date: state
    })
    console.log('================')
    console.log(this.state.date)
  };

 //=================================================================
 //------------------------- Scroll Down -------------------------//
 //=================================================================

  scrollDown(){
    console.log(this.refs)
    //this.refs.scrollView.scrollTo(width*2/3);
  }

 //=================================================================
 //--------------------- Switch Notification ---------------------//
 //=================================================================

  toggleNotif = async() => {
    this.state.switch.notification ? this.setState({
      switch: {
        notification: false,
        done: false,
      }
    }) : this.setState({
      switch: {
        notification: true,
        done: false,
      }
    })
    console.log(this.state.switch.notification)
  }

  //=================================================================
  //--------------------- Switch Done ---------------------//
  //=================================================================

  sliderWeight = async (value) => {
    this.setState({ slider: { weight: value } })

  }

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
            <TouchableOpacity style={styles.header_button}
              onPress={this.showData}>
              <Text style={styles.header_button_text}>
                Показать данные
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.switch_text}>
            <Text style={{width: '50%'}}>Уведомления: {this.state.switch.notification ? ' Включены' : ' Выключены'}</Text>
            <Switch value={this.state.switch.notification} enabled
              onValueChange={() => {this.toggleNotif()}} style={{width: '50%', alignItems:'flex-end', flexDirection: 'row', position: 'relative'}} 
            />
          </View>
          
          <View style={{ ...styles.switch_done }}>
            <Text style={{ width: '50%' }}>Важность: {this.state.slider.weight + 1}</Text>
            <Slider minimumValue={0} maximumValue={4} onValueChange={(value) => this.sliderWeight(value)}
              value={this.state.slider.weight} style={{ width: '50%' }} step={1}></Slider>
          </View>

          <TextInput placeholder='Заголовок' onChangeText={title => this.setState({ title })} style={styles.input}
            placeholderTextColor="#666666">

          </TextInput>
          {/* <TextInput placeholder='Текст' onChangeText={text => this.setState({ text })} style={styles.input}
            placeholderTextColor="#666666">

          </TextInput> */}

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
          
          <View style={{marginLeft: '3%'}}>

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
            />

          </View>

        </View>
        
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
    paddingTop: 15,
    paddingBottom: 50,
  },
  input: {
    backgroundColor: '#fff', 
    // color: 'blue',
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
      // backgroundColor: '#2BB5FF',
      // backgroundColor: '#F30000',
      // backgroundColor: "#2296F3",
      // borderRadius: 10,

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
    // paddingTop: 10,
    // paddingBottom: 30,
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