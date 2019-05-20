import React, { Component } from 'react';
// import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Calendar from 'react-native-calendario';
import { StyleSheet, View, Button, Keyboard, Alert } from 'react-native';

class NewCalendar extends React.Component {
    constructor(props){
        super(props)

        this.state = {
           
        }

    }

    render() {
        const date = new Date().getDate(); //Current Date
        const month = (new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : new Date().getMonth(); //Current Month
        const year = new Date().getFullYear(); //Current Year
        const now = `${year}-${month}-${date}`
        console.log(now);
        return (
                // <Calendar
                //     minDate={now}
                //     onChange={(day) => {this.rangeDate(day)}}
                //     disableRange={true}
                //     initialListSize={2}

                // >

                // </Calendar>
        )
    }

    rangeDate = async(day) => { 
        let date = day;
        console.log(date);
        date1 = new Date(date.startDate)
        date2 = new Date(date.endDate)
        const dateStart = date1.toString()
        const dateEnd = date2 !== null ? date2.toString() : dateStart
        console.log(dateStart)
        console.log(dateEnd)


    }


}  

export default NewCalendar

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