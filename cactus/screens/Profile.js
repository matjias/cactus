import React, { Component } from 'react';
import { View, Text, Button, ScrollView} from 'react-native';
import { Avatar } from '../components/avatar';
import { Goal } from '../components/goal';
import PopupMenu from '../components/popup';
import firebase from 'react-native-firebase';
import { CheckBox } from 'react-native-elements';


import { data } from '../data/';
import {
  RkText,
  RkButton, RkStyleSheet,RkPicker,
} from 'react-native-ui-kitten';
import Ionicons from 'react-native-vector-icons/AntDesign';



export class Profile extends Component {
  static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
    return {
      title: 'User Profile'.toUpperCase(),
        //headerTitleStyle :{color:'#fff'},
        //headerStyle: {backgroundColor:'#3c3c3c'},
		//headerRight: <Icon style={{ marginLeft:15,color:'green' }} name={'check'} size={25} onPress={() => params.handleSave()} />
		  headerRight: <View style={{justifyContent: 'center',}}>
      <PopupMenu actions={['Edit profile', 'Sign out']} onPress={(e,index)=>params.onPopupEvent(e,index)} />
    </View>
    };
	};
  


  constructor(props) {
    super(props);
    this.state={
      navigation:this.props.navigation,
      aboutMe:null,
      name:null,//this.user.name
      goals:[]
    }

    this.ref=firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
   
    this.onPopupEvent=this.onPopupEvent.bind(this)

    //retrieve profile info
    this.ref.get().then((doc)=>{if (doc.exists) 
              {var user=doc.data()
              //retrieve goals
              this.setState({name:user.name,aboutMe:user.aboutMe})
              }}).catch()

    this.ref.collection('goals').get().then((snap1)=>{
              var goals=[]
              snap1.forEach((goal) => {
              _goal={id:goal.data().id, name:goal.data().name}
              goals.push(_goal)      
              console.log(goals)
              //retrieve tasks
                })
              return goals;
          
              }).then((goals)=>{
                var new_goals=[];
                goals.forEach((goal)=>{
                this.ref.collection('goals').doc(goal.id).collection('tasks').get()
                //retrieve tasks
                .then((snap2)=>{
                  var tasks=[]
                  snap2.forEach((task)=>{
                    _task={id:task.data().id,task:task.data().task,checked:task.data().checked}
                    tasks.push(_task)
                  })
                  return tasks
                }
                ).then((tasks)=>{goal['tasks']=tasks; new_goals.push(goal);this.setState({goals:new_goals});console.log(new_goals)})})
              }
              
               )
               .catch((error)=>{console.log(error)})  
                
  }
 

   componentDidMount() {
    //var loading=true;
    this.props.navigation.setParams({ onPopupEvent:  this.onPopupEvent });
  
    //loading=false;
	}
  
  onPopupEvent (eventName, index) {
    if (eventName !== 'itemSelected') return
    if (index === 0) {
      this.state.navigation.navigate('EditProfile')
    }
    else {
      firebase.auth().signOut().catch((error) => {
        const { code, message } = error;
        console.log(code,message)
        
      });
    }
  }
  findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }
    return null;
  };

 
  onTaskChecked(e,item, goal_id){
    const _goals = [...this.state.goals] 
    goal_index=this.findObjectByKey(_goals,'id',goal_id)
    _tasks=[..._goals[goal_index].tasks]
    task_index=this.findObjectByKey(_tasks,'id',item.id)
    _tasks[task_index].checked ='true';
    _goals[goal_index].tasks=_tasks
    this.setState({goals:_goals});
    };
  render() {
    const name =this.state.name
    const aboutMe=this.state.aboutMe
    const goals=this.state.goals
    return (
	
     <ScrollView style={styles.root}>
	  <View style={[styles.userInfo, styles.bordered]}>
	  
		   <View style={[styles.header,styles.section]}>
			<Avatar img={require('../data/img/avatars/Image9.png')} rkType='big' />
		   </View>
		   <View style={styles.section, {flex: 1}}>
		   <RkText rkType='header3'>{name}</RkText>
		   <RkText rkType='secondary1'>{aboutMe}</RkText>
		   </View>
		  
	  </View>
	  
      <View style={styles.buttons}>
        <RkButton style={styles.button} rkType='clear link' onPress={() => this.props.navigation.navigate('AddTask')} >NEW GOAL</RkButton>
        <View style={styles.separator} />
        <RkButton style={styles.button} rkType='clear link'>NOTIFICATIONS</RkButton>
      </View>
	  
	  <View style={styles.goalContainer}>
      {goals.length>0 && goals.map((goal)=>(


      <View style={{padding:5}}>
        <RkText rkType='primary'>{goal.name}</RkText>
      <View>
        {goal.tasks.length>0 && goal.tasks.map((item) => (
        <CheckBox checked={item.checked=='true'} title={item.task} 
        checkedIcon='check'
        containerStyle={{backgroundColor:'transparent',borderWidth: 0,flex:1}} 
        onIconPress={(e) => this.onTaskChecked(e,item,goal.id)}/>))}
      </View>  
      </View>
      ))}
		
	  </View>
	 
    </ScrollView>
	
    )
  }
};

export default Profile;
const styles = RkStyleSheet.create(theme => ({
  
  goalContainer:{
    margin:10
  },
  
  root: {
    backgroundColor: theme.colors.screen.base,
    
  },
  header: {
    
	paddingHorizontal: 10,
	
  },
  userInfo: {
    flexDirection: 'row',
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