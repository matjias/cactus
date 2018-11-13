import React, { Component } from 'react';
import { View, Text, Button, ScrollView} from 'react-native';
import { Avatar } from '../components/avatar';
import { Goal } from '../components/goal';


import { data } from '../data/';
import {
  RkText,
  RkButton, RkStyleSheet,RkPicker,
} from 'react-native-ui-kitten';
import Ionicons from 'react-native-vector-icons/AntDesign';



export class Profile extends Component {
	 
	
	static navigationOptions = {
    title: 'User Profile'.toUpperCase(),
  };
  
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
	
     <ScrollView style={styles.root}>
	  <View style={[styles.userInfo, styles.bordered]}>
	  
		   <View style={[styles.header,styles.section]}>
			<Avatar img={require('../data/img/avatars/Image9.png')} rkType='big' />
		   </View>
		   <View style={styles.section, {flex: 1}}>
		   <RkText rkType='header3'>{`Mathias Sixten`}</RkText>
		   <RkText rkType='secondary1'>{`About me...`}</RkText>
		   </View>
		   <View style={styles.section}>
		   
		   <Ionicons name={'edit'} size={30} onPress={() => this.props.navigation.navigate('EditProfile')}/>
		   
		  
		   </View> 
		  
	  </View>
	  
      <View style={styles.buttons}>
        <RkButton style={styles.button} rkType='clear link' onPress={() => this.props.navigation.navigate('AddTask')} >NEW GOAL</RkButton>
        <View style={styles.separator} />
        <RkButton style={styles.button} rkType='clear link'>MESSAGE</RkButton>
      </View>
	  
	  <View>
		<Goal/>
	  </View>
	 
    </ScrollView>
	
    )
  }
};

export default Profile;
const styles = RkStyleSheet.create(theme => ({
	
  
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  header: {
    
	paddingHorizontal: 10,
	
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base,
  },
  
  section: {
    flexWrap: "wrap",
    padding:10,
	
  },
  space: {
    marginBottom: 3,
  },
  separator: {
    backgroundColor: theme.colors.border.base,
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 0,
    width: 1,
    height: 42,
  },
  buttons: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  button: {
    flex: 1,
    alignSelf: 'center',
	
  },
}));