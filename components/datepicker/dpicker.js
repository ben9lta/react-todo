import React, { Component } from 'react';
import { StyleSheet, AppRegistry, Text, View, TextInput, ScrollView,
        TouchableOpacity, AsyncStorage, Button, Keyboard, Alert, ListView } from 'react-native';
import App from '../App.js';
import DateTimePicker from "react-native-modal-datetime-picker";
import {DatePicker} from 'native-base'

class Dpicker extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
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
    //this.showCalendar = this.showCalendar.bind(this);
  }

  componentDidMount(){
    if(!this.state.loading) return
    this.asyncData();
    console.log(this.props.navigation.state.params)
    
    
  }

  showDateTimePicker = () => {
    Keyboard.dismiss();
    const state = {...this.state.date}
    state.start.focus = true
    this.setState({
      date: state
    })
    // console.log('--------------')
    // console.log(this.state.date)
  };
 
  hideDateTimePicker = () => {
    const state = {...this.state.date}
    state.start.focus = false
    this.setState({
      date: state
    })
  };
 
  handleDatePicked = date => {
    // console.log(date);
    date = new Date(date)
    const dateStart = date.toString()
    // console.log(dateStart)

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
    // console.log('================')
    // console.log(this.state.date)
    this.hideDateTimePicker();
  };

}
export default Dpicker
