import React, { Component } from 'react';
import { StyleSheet, AppRegistry, Text, View, TextInput, ScrollView, 
            TouchableOpacity, AsyncStorage, Button, Keyboard, Alert, ListView } from 'react-native';
import { StackNavigator } from "react-navigation";
import { Row } from 'native-base';


class SelectedItemPage extends React.Component {

    componentDidMount(){
        //console.log(this.props.navigation.state.params.dataItem)
        // const dataItem = this.props.navigation.state.params.dataItem
        // const allData = this.props.navigation.state.params.allData
        // console.log(this.props.navigation.state.params.allData)
        // console.log('=======================================')
        // console.log(this.state.allItems)
        // console.log('///////')
    } 

    constructor(props){
        super(props)
        const dataItem = this.props.navigation.state.params.dataItem
        const allData = this.props.navigation.state.params.allData
        // const allItems = this.props.navigation.state.params.allData
        this.state = {
            isEditable: false,
            changeButton: {
                textButtonOfChange: false,
                text: 'Изменить',
                backgroundColor: '#CC440E',
            },
            textInput: {
                backgroundColor: '#CACBCC',
            },
            item: {
                title: dataItem.title,
                text: dataItem.text,
                key: dataItem.key,
            },
            allItems: allData,
            
        }

    }
    

    static navigationOptions = ({navigation, }) => (console.log(navigation),{
        title: 'Запись "'+navigation.state.params.dataItem.title+'"',
        // headerRight: (
            // <Button
            //   onPress={() => alert('This is a button!')}
            //   title="Info"
            //   color="#fff"
            // />
        // ),
    });

    handleEdit = () => {
        const isEditable = this.state.isEditable;
        this.setState({ isEditable: !isEditable });
        // console.log(isEditable)
        const textInput = {...this.state.textInput}
        const changeButton = {...this.state.changeButton}


        if(changeButton.textButtonOfChange) {
            changeButton.text = 'Изменить'
            changeButton.textButtonOfChange = false
            changeButton.backgroundColor = '#CC440E'
            this.setState({changeButton})
            
            textInput.backgroundColor = '#CACBCC'
            this.setState({textInput})

            this.saveItem(this.state.item.key)
            // console.log('=======');
            //console.log(this.state.item)

        } else {
            changeButton.text = 'Сохранить'
            changeButton.textButtonOfChange = true
            changeButton.backgroundColor = '#00CC00'
            this.setState({changeButton})

            textInput.backgroundColor = "#fff"
            this.setState({textInput})
        }

        // console.log(this.state.textInput.backgroundColor)
        // console.log(this.state.changeButton)
        // console.log(this.state)
        
    };

    saveItem = async(key) => {
        const newItem = this.state.item
        let newItems = this.state.allItems

        this.state.allItems.map((item, index) => {
            if(item.key === key) {
                if(index !== -1) {
                    newItems.splice(index, 1)
                    newItems.push(newItem);
                    this.setState({
                        allItems: newItems
                    })
                }
            }
        });
        // console.log('=-****************************-=')
        // console.log(this.state.allItems)

        AsyncStorage.setItem('newItem', JSON.stringify(newItems));

        this.props.navigation.state.params.showData()
        this.props.navigation.navigate('Home', {
            items: this.state.allItems,
        });
    }
    

    deleteItem(key){
        let array = [];
        const newItems = this.props.navigation.state.params.allData.map((item, index) => {
            if(item.key === key) {
                const newItem = this.props.navigation.state.params.allData
                newItem.splice(index,1);
                
                array = newItem

                this.setState({
                    allItems: array
                })
                // return {
                //     ...newItem
                // }
            }
        })

        AsyncStorage.setItem('newItem', JSON.stringify(array));
        this.props.navigation.state.params.showData()
        this.props.navigation.navigate('Home', console.log(this.state.allItems), {
            items: array,
        });
        // this.props.navigation.state.params.renderData(array);
        // this.props.navigation.navigate('Home' ,{
        //     items: array,
        // });
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.header_buttons}>
                        <TouchableOpacity style={{...styles.header_button, backgroundColor: this.state.changeButton.backgroundColor}}
                            onPress={() => {this.handleEdit()}}>
                            {/* , this.saveItem(this.state.item.key, this.state.item.title) */}
                            <Text style={{...styles.header_button_text}}>
                                {this.state.changeButton.text}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.header_button}
                            onPress={() => {this.deleteItem(this.state.item.key)}}>
                            <Text style={styles.header_button_text}>Удалить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TextInput placeholder='Заголовок'
                    editable={this.state.isEditable}
                    onChangeText={title => this.setState({
                        item: {
                            title: title,
                            text: this.state.item.text,
                            key: this.state.item.key
                        }
                    })} 
                    style={{...styles.input, backgroundColor: this.state.textInput.backgroundColor}}
                >
                    <Text>{this.props.navigation.state.params.dataItem.title}</Text>
                </TextInput>

                <TextInput placeholder='Текст' 
                    editable={this.state.isEditable}
                    onChangeText={text => this.setState({
                        item: {
                            text: text, 
                            title: this.state.item.title,
                            key: this.state.item.key
                        }
                    })} 
                    style={{...styles.input, backgroundColor: this.state.textInput.backgroundColor}}
                >
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
      paddingTop: 15,      
      paddingBottom: 50,
    },
    input: {
      backgroundColor: '#fff', 
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
        
    }
  });