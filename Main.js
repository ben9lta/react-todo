import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';

export default class Main extends Component {
  render() {
    return (
      <View style={styles.container}>
            <View style={styles.header}>
                
            </View>

            <ScrollView style={styles.scrollContainer}>

            </ScrollView>

            <View >
            
                <TextInput placeholder='>Заголовок' underlineColorAndroid='transparent'>

                </TextInput>

            </View>
            
            <TouchableOpacity>
                <Text style={styles.addButtonText}>Сохранить</Text>
            </TouchableOpacity>
            
            
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        backgroundColor: '#E91E63',
        
    },
    addButtonText: {
        color: '#333',
        fontSize: 24,
    },
   
    
    

});
