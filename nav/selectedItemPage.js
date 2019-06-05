import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View, TextInput, Switch, Slider,
            TouchableOpacity, AsyncStorage, Keyboard } from 'react-native';
//import { StackNavigator } from "react-navigation";
import DateTimePicker from "react-native-modal-datetime-picker";
//import { Row } from 'native-base';


class SelectedItemPage extends React.Component {

    componentDidMount(){
        const dataItem = this.props.navigation.state.params.dataItem
        this.setState({
            item: dataItem
        })
        
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
        // console.log('=================STATE==================')
        // console.log(this.state)
        // console.log('========================================')
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
                complete: dataItem.complete,
                weight: dataItem.weight,
                notification: dataItem.notification,
                dateStart: dataItem.dateStart,
                dateEnd: dataItem.dateEnd,
            },
            allItems: allData,

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
        this._keyboardDidShow = this._keyboardDidShow.bind(this)
        this._keyboardDidHide = this._keyboardDidHide.bind(this)

    }
    

    static navigationOptions = ({navigation, }) => (console.log(navigation),{
        title: 'Запись "'+navigation.state.params.dataItem.title+'"',
    });

    handleEdit = () => {
        const isEditable = this.state.isEditable;
        this.setState({ isEditable: !isEditable });
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

        } else {
            changeButton.text = 'Сохранить'
            changeButton.textButtonOfChange = true
            changeButton.backgroundColor = '#00CC00'
            this.setState({changeButton})

            textInput.backgroundColor = "#fff"
            this.setState({textInput})
        }
        
    };

    saveItem = async(key) => {
        const newItem = this.state.item
        let newItems = this.state.allItems

        this.state.allItems.map((item, index) => {
            if(item.key === key) {
                if(index !== -1) {
                    newItems.splice(index, 1)
                    newItems.push(newItem);
                }
            }
        });
        const stateItem = {...this.state.item}
        let notifItem = stateItem
        notifItem.time = new Date().getTime() + 5000

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
            }
        })
        AsyncStorage.setItem('newItem', JSON.stringify(array));
        // console.log(this.state)
        this.props.navigation.state.params.showData(this.state.item)
        this.props.navigation.navigate('Home', console.log(this.state.allItems), {
            items: array,
        });
    }

    //=================================================================
    //------------------------- DATE START --------------------------//
    //=================================================================
    showDateTimeStartPicker = () => {
        Keyboard.dismiss();
        const state = { ...this.state.date }
        state.start.focus = true
        this.setState({
            date: state
        })

    };

    handleDateStartPicked = (date) => {
        date = new Date(date)
        const newDate = date.toString()
        const day = new Date(newDate).getDate(); //Current Date
        const month = (new Date(newDate).getMonth() + 1) < 10 ? `0${(new Date(newDate).getMonth() + 1)}` : new Date(newDate).getMonth() + 1;
        const year = new Date(newDate).getFullYear(); //Current Year
        const thisDate = `${day}/${month}/${year}`
        const state = {...this.state.item}
        state.dateStart = thisDate
        this.setState({item: state})

        this.hideDateTimeStartPicker();
    };

    hideDateTimeStartPicker = () => {
        const state = { ...this.state.date }
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
        const state = { ...this.state.date }
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
        const state = {...this.state.item}
        state.dateEnd = thisDate
        this.setState({item: state})
        this.hideDateTimeEndPicker();
    };

    hideDateTimeEndPicker = () => {
        const state = { ...this.state.date }
        state.end.focus = false
        this.setState({
            date: state
        })
    };
    //=================================================================
    //--------------------- Switch Notification ---------------------//
    //=================================================================

    toggleNotif = async () => {
        const state = {...this.state.item}
        if(this.state.item.notification){
            state.notification = false
            this.setState({item: state})
        } else {
            state.notification = true
            this.setState({item: state})
        }

    }

    //=================================================================
    //--------------------- Switch Done ---------------------//
    //=================================================================

    toggleDone = async () => {
        const state = {...this.state.item}
        if(this.state.item.complete){
            state.complete = false
            this.setState({item: state})
        } else {
            state.complete = true
            this.setState({item: state})
        }
    }

    
    //=================================================================
    //--------------------- Switch Done ---------------------//
    //=================================================================

    sliderWeight = async(value) => {
        const state = {...this.state.item}
        state.weight = value;
        this.setState({
            item: state,
        })
    }

    //=================================================================
    //=================================================================

    render(){
        const minDay = new Date()
        let startDateString = this.state.date.start.date
        startDateString = startDateString.split('/')
        let startDate = new Date()
        startDate.setDate(startDateString[0])
        startDate.setMonth(startDateString[1] > '9' ? startDateString[1] : startDateString[1]-1)
        startDate.setFullYear(startDateString[2])
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

                <ScrollView>
                <View 
                    { ...this.state.style && this.state.keyboardShow ? style={marginTop: this.state.marginTop} : style={marginTop: 0}}
                >
                    <View style={{...styles.switch_notif, backgroundColor: this.state.textInput.backgroundColor}}>
                        <Text style={{ width: '50%' }}>Уведомления: {this.state.item.notification ? ' Включены' : ' Выключены'}</Text>
                        <Switch value={this.state.item.notification} disabled={!this.state.isEditable}
                            onValueChange={() => { this.toggleNotif() }} style={{ width: '50%', alignItems: 'flex-end', flexDirection: 'row', position: 'relative' }}
                        />
                    </View>
                    <View style={{...styles.switch_done, backgroundColor: this.state.textInput.backgroundColor}}>
                        <Text style={{ width: '50%' }}>Выполнено: {this.state.item.complete ? ' Да' : ' Нет'}</Text>
                        <Switch 
                            // value={this.state.switch.done} 
                            value={this.state.item.complete}
                            disabled={!this.state.isEditable}
                            onValueChange={() => { this.toggleDone() }} style={{ width: '50%', alignItems: 'flex-end', flexDirection: 'row', position: 'relative' }}
                        />
                    </View>
                    <View style={{...styles.switch_done, backgroundColor: this.state.textInput.backgroundColor}}>
                        <Text style={{ width: '50%' }}>Важность: {this.state.item.weight}</Text>
                        {/* {this.state.slider.weight} */}
                        <Slider minimumValue={1} maximumValue={5} onValueChange={(value) => this.sliderWeight(value)}
                            value={this.state.item.weight} style={{width: '50%'}} step={1} 
                            disabled={!this.state.isEditable}></Slider>
                    </View>

                    <TextInput placeholder='Заголовок'
                        editable={this.state.isEditable}
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
                        onChangeText={title => this.setState({
                            item: {
                                ...this.state.item,
                                title: title,

                            }
                        })} 
                        style={{...styles.input, backgroundColor: this.state.textInput.backgroundColor}}
                    >
                        <Text>{this.props.navigation.state.params.dataItem.title}</Text>
                    </TextInput>

                    <View style={styles.col2}>
                        <TextInput onFocus={this.showDateTimeStartPicker}
                        style={{...styles.input, ...styles.col2_items, backgroundColor: this.state.textInput.backgroundColor,}}
                        placeholder={'Дата начала'}
                        placeholderTextColor="#666666"
                        //value={this.state.date.start.date}
                        value={this.state.item.dateStart}
                        editable={this.state.isEditable}
                        />
                        <TextInput onFocus={this.showDateTimeEndPicker}
                        style={{...styles.input, ...styles.col2_items, backgroundColor: this.state.textInput.backgroundColor,}}
                        placeholder={'Дата окончания'}
                        placeholderTextColor="#666666"
                        //value={this.state.date.end.date}
                        value={this.state.item.dateEnd}
                        editable={this.state.isEditable}
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
                            isVisible={this.state.date.end.focus}
                            onConfirm={this.handleDateEndPicked}
                            onCancel={this.hideDateTimeEndPicker}>
                            </DateTimePicker> : null
                        }
                    </View>

                    <View style={{marginLeft: '3%'}}>       
                        <TextInput 
                            value={this.state.text}
                            // value={this.state.item.text}
                            style={{ height: 150,  width: '97%', borderColor: 'black', borderWidth: 1, 
                                borderRadius: 10, textAlignVertical: 'top',
                                padding: 10,
                                marginTop: 10,
                                backgroundColor: this.state.textInput.backgroundColor,
                                
                            }}
                            placeholder='Текст' 
                            onChangeText={text => this.setState({
                                item: {
                                    ...this.state.item,
                                    text: text,
                                    
                                },

                            })} 
                            placeholderTextColor="#666666"
                            editable={this.state.isEditable}
                            multiline={true}
                            onFocus={() => this.setState({
                                keyboardShow: true,
                                marginTop: -300,
                                style: true
                            })}
                            onBlur={() => this.setState({
                                style: false,
                                keyboardShow: false,
                                marginTop: 0,
                            })}
                        >
                            <Text>{this.props.navigation.state.params.dataItem.text}</Text>
                        </TextInput>
                    </View>
                </View>
                </ScrollView>
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
        
    },
    col2: {
       // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        //marginBottom: 75,
    
    },
    col2_items: {
        width: '45%',
        // paddingTop: 10,
        // paddingBottom: 30,
        height: 50
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