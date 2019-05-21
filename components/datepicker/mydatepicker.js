import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { DatePicker } from 'native-base'

class MyDatePicker extends React.Component {
    render(){
        const day = new Date().getDate()
        const month = new Date().getMonth()
        const year = new Date().getFullYear()

        const now = `${day}/${month}/${year}`
        const minDate = new Date(year, month, day)
        const maxDate = new Date().setMonth(minDate.getMonth()+1)
        const styles = this.props.style;
        return (
            <View>
                <DatePicker

                    defaultDate={new Date(minDate)}
                    minimumDate={new Date(minDate)}
                    maximumDate={new Date(maxDate)}
                    locale={"en"}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Дата начала"
                    textStyle={{ color: "#061431" }}
                    placeHolderTextStyle={{ color: "#666666" }}
                    onDateChange={() => { console.log('asd') }}
                    ref={ref => this.MyDatePicker = ref} props
                    // onDateChange={newDate => this.setState({
                    //   date: {
                    //     start: {
                    //       date: newDate
                    //     }
                    //   }
                    // }, () => {console.log(this.state.date)})}
                    disabled={false}
                />
            </View>
        )   
    }  
}

export default MyDatePicker;
