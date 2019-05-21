import React, { Component } from 'react';
import { StyleSheet, AppRegistry, Text, View, TextInput, ScrollView,
        TouchableOpacity, AsyncStorage, Button, Keyboard, Alert, ListView } from 'react-native';
import App from '../App.js';
import DateTimePicker from "react-native-modal-datetime-picker";
import {DatePicker} from 'native-base'

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
    console.log('------------------------')
    console.log(data)
    //this.setSource(data, data, {loading: false});
    // App.showData();
    
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

  // showCalendar(){
  //   if(this.state.datePicker){
  //     this.setState({
  //       datePicker: false,
  //     })
  //   }
  //   else
  //   {
  //     this.setState({
  //       datePicker: true,
  //     })
  //   }
  //   console.log(this.state);
  // }

  showDateTimePicker = () => {
    Keyboard.dismiss();
    //this.setState({ datePicker: true });
    console.log(this.state.date)
    this.setState({
      date: {
        start: {
          focus: true,
          date: ''
        },
        end: {
          focus: false,
          date: ''
        }
      }
    })
    console.log('--------------')
    console.log(this.state.date)
  };
 
  hideDateTimePicker = () => {
    //this.setState({ datePicker: false });
    const state = this.state.date
    this.setState({
      date: {...state}
    })
    // this.setState({
    //   date: {
    //     start: {
    //       focus: false,
    //       date: this.state.date.start.date
    //     },
    //     end: {
    //       focus: false,
    //       date: ''
    //     }
    //   }
    // })
  };
 
  handleDatePicked = date => {
    // console.log("A date has been picked: ", date);
    console.log(date);
    date = new Date(date)
    const dateStart = date.toString()
    console.log(dateStart)

    const day = new Date(dateStart).getDate(); //Current Date
    const month = (new Date(dateStart).getMonth() + 1) < 10 ? `0${(new Date(dateStart).getMonth() + 1)}` : new Date(dateStart).getMonth(); //Current Month
    const year = new Date(dateStart).getFullYear(); //Current Year
    const thisDate = `${day}/${month}/${year}`

    //this.setState({ dateStart: thisDate })
    const state = {...this.state.date}
    state.start.date = thisDate
    this.setState({
      date: state
    })
    console.log('================')
    console.log(this.state.date)
    this.hideDateTimePicker();
  };

  render() {
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
        <TextInput placeholder='Заголовок' onChangeText={title => this.setState({title})} style={styles.input}
          placeholderTextColor = "#666666">

        </TextInput>
        <TextInput placeholder='Текст' onChangeText={text => this.setState({text})} style={styles.input}
          placeholderTextColor = "#666666">

        </TextInput>

        <View>
          {/* <Button title={'Дата'} onPress={this.showDateTimePicker}></Button> */}
          <TextInput onFocus={this.showDateTimePicker}
            style={styles.input}
            placeholder={'Дата начала'}
            placeholderTextColor = "#666666"
            // value={this.state.dateStart}
            value={this.state.date.start.date}
          />
          <View>
            {/* {this.state.date.start.focus ?
              <DateTimePicker 
                isVisible={this.state.date.start.focus}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}>
              </DateTimePicker> : null
            } */}
            <DatePicker
              defaultDate={new Date(2018, 4, 4)}
              minimumDate={new Date(2018, 1, 1)}
              maximumDate={new Date(2018, 12, 31)}
              locale={"en"}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"calendar"}
              placeHolderText="Select date"
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={newDate => this.setState({
                date: {
                  start: {
                    date: newDate
                  }
                }
              }, () => {console.log(this.state.date)})}
              disabled={false}
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

});