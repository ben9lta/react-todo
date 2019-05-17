import React, { Component } from 'react';
import { StyleSheet, AppRegistry, Text, View, TextInput, ScrollView, 
            TouchableOpacity, Button, Keyboard, Alert, ListView } from 'react-native';
import { StackNavigator } from "react-navigation";


class SelectedItemPage extends React.Component {

    static navigationOptions = ({navigation, }) => (console.log(navigation),{
        title: 'Изменить "'+navigation.state.params.dataItem.title+'"',
        // headerRight: (
            // <Button
            //   onPress={() => alert('This is a button!')}
            //   title="Info"
            //   color="#fff"
            // />
        // ),
    });

    componentDidMount(){
        console.log(this.props.navigation.state.params.dataItem)
        
    }
    

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                <Button
                    onPress={() => alert('This is a button!')}
                    title="Info"
                    color="#fff"
                />
                </View>
                <TextInput placeholder='Заголовок' onChangeText={title => this.setState({title})} style={styles.input}>
                    <Text>{this.props.navigation.state.params.dataItem.title}</Text>
                </TextInput>
                <TextInput placeholder='Текст' onChangeText={text => this.setState({text})} style={styles.input}>
                    <Text>{this.props.navigation.state.params.dataItem.text}</Text>
                </TextInput>
                {/* <Button title='Сохранить'
                onPress={this.saveData}
                color='green'></Button>
        
                <Button title="Показать данные" onPress={this.showData}></Button> */}
              
            </View>
        )
        
    }

    
}

// export default SelectedItemPage
export default SelectedItemPage 


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
  
    }
  });