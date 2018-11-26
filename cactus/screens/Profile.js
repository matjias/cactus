import React, { Component } from 'react';
import { View, FlatList, Alert, ScrollView} from 'react-native';
import { Avatar } from '../components/avatar';
import { Goal } from '../components/goal';
import PopupMenu from '../components/popup';
import firebase from 'react-native-firebase';
import { CheckBox } from 'react-native-elements';


import {
  RkText,
  RkButton, RkStyleSheet,RkPicker,
} from 'react-native-ui-kitten';
import Ionicons from 'react-native-vector-icons/AntDesign';



export class Profile extends Component {
  static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
    return {
      title: 'my profile'.toUpperCase(),
        //headerTitleStyle :{color:'#fff'},
        //headerStyle: {backgroundColor:'#3c3c3c'},
		//headerRight: <Icon style={{ marginLeft:15,color:'green' }} name={'check'} size={25} onPress={() => params.handleSave()} />
		  headerRight: <View style={{justifyContent: 'center',marginRight:10}}>
      <PopupMenu actions={['Edit profile','Give us your feedback','Sign out']} onPress={(e,index)=>params.onPopupEvent(e,index)} />
    </View>
    };
	};
  


  constructor(props) {
    super(props);
    this.profileURLs=[
      {id:0,url:require('../data/img/avatars/Image1.jpg')},
      {id:1,url:require('../data/img/avatars/Image2.jpg')},
      {id:2,url:require('../data/img/avatars/Image3.jpg')},
      {id:3,url:require('../data/img/avatars/image_default.jpg')}
    ]
    this.state={
      navigation:this.props.navigation,
      aboutMe:null,
      name:null,//this.user.name
      progress:null,
      profileURL:3,
      goals:[],
      isLoading:false
    }
    this.userId=firebase.auth().currentUser.uid
    this.retrieveProfileInfo=this.retrieveProfileInfo.bind(this)
    this.lastVisible=null,
    this.ref=firebase.firestore().collection('users').doc(this.userId)
   
    this.onPopupEvent=this.onPopupEvent.bind(this)

    this.log_ref = firebase.firestore().collection('updates')
                
  }
  retrieveProfileInfo(){
 //retrieve profile info
    this.ref.get().then((doc)=>{if (doc.exists) 
    {var user=doc.data()
    this.setState({name:user.name,aboutMe:user.aboutMe,progress:user.progress,profileURL:user.profileURL  ==null ? 3:user.profileURL})
    }}).catch()
  }
  refreshFunction(){
    this.retrieveData(10)
  }

 
  getExtraData(batchLimit){
    this.setState({isLoading:true})
    db=this.ref.collection('goals').where('delete','==',false).orderBy('timestamp_updated','desc').startAfter(this.lastVisible).limit(batchLimit);
    db.get().then((snap1)=>{
      this.lastVisible = snap1.docs[snap1.docs.length-1];

      number_of_goals=snap1.docs.length
      if (number_of_goals==0){
        this.setState({isLoading:false})
      }
      goals=[]
      snap1.forEach((goal) => {
        _goal={id:goal.id,timestamp:goal.data().timestamp_updated, name:goal.data().name,delete:goal.data().delete,tasks:[]}
        goals.push(_goal)
      })
      return goals}).then((goals)=>{
        res=[]
       
        goals.forEach((goal)=>{
        this.ref.collection('goals').doc(goal.id).collection('tasks').where('delete','==',false).get().then((snap2)=>{
          tasks=[]
          snap2.forEach((task)=>{
              _task={id:task.id,task:task.data().task,checked:task.data().checked,delete:task.data().delete}
              tasks.push(_task)
            })
          goal['tasks']=tasks
          res.push(goal)

          if (res.length==number_of_goals){
            res.sort((a,b)=>a.timestamp > b.timestamp ? -1 : b.timestamp > a.timestamp ? 1 : 0)
            this.setState({isLoading:false, goals:this.state.goals.concat(res)})
        }}).catch((err)=>{console.log(err)})
      })
    }).catch((err)=>{console.log(err)})
  }

 
   retrieveData(batchLimit){
    this.setState({isLoading:true})
    this.lastVisible=null
    db=this.ref.collection('goals').where('delete','==',false).orderBy('timestamp_updated','desc').limit(batchLimit)
    db.get().then((snap1)=>{
      this.lastVisible = snap1.docs[snap1.docs.length-1];
      number_of_goals=snap1.docs.length
      if (number_of_goals==0){
        this.setState({isLoading:false,goals:0})
      }
      goals=[]
      snap1.forEach((goal) => {
        _goal={id:goal.id, timestamp:goal.data().timestamp_updated,name:goal.data().name,delete:goal.data().delete,tasks:[]}
        goals.push(_goal)
      })
      return goals}).then((goals)=>{
        res=[]
        goals.forEach((goal)=>{
        this.ref.collection('goals').doc(goal.id).collection('tasks').where('delete','==',false).get().then((snap2)=>{
          tasks=[]
          snap2.forEach((task)=>{
              _task={id:task.id,task:task.data().task,checked:task.data().checked,delete:task.data().delete}
              tasks.push(_task)
            })
          goal['tasks']=tasks
          res.push(goal)

          if (res.length==number_of_goals){
            res.sort((a,b)=>a.timestamp> b.timestamp ? -1 : b.timestamp > a.timestamp ? 1 : 0)
            this.setState({isLoading:false, goals:res})
        }
      }).catch((err)=>{console.log(err)})
      })
    }).catch((err)=>{console.log(err)})
         
      
   
    
  }
  compare(a, b) {
    if (a>b) {
      return -1;
    }
    if (a<b) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

  onFocus(){
    db = firebase.firestore().collection('activity_log');
    db.add(
      {
        user_id:firebase.auth().currentUser.uid,
        action:'profile',
        timestamp:Date.now()
      }
    ).catch()
	}
 
  componentWillUnmount(){
    this.didFocusSubscription.remove()
    db = firebase.firestore().collection('activity_log');
    db.add(
      {
        user_id:firebase.auth().currentUser.uid,
        action:'app closed',
        timestamp:Date.now()
      }
    ).catch()
  }
   componentDidMount() {
   this.didFocusSubscription = this.props.navigation.addListener(
		  'didFocus',
		  payload => {
		    this.onFocus();
		  });
    //var loading=true;
    this.props.navigation.setParams({ onPopupEvent:  this.onPopupEvent });
    this.retrieveData(10)
    this.retrieveProfileInfo()
    //loading=false;
	}
  
  onPopupEvent (eventName, index) {
    if (eventName !== 'itemSelected') return
    if (index === 0){
      this.props.navigation.navigate('EditProfile',{refresh:()=>this.retrieveProfileInfo()})
    }
    else if(index==1){
      this.props.navigation.navigate('Feedback',{ currentUserId:this.userId,
                                                  currentUserURL:this.state.profileURL,
                                              currentUserName:this.state.name,})

    }
    else if (index === 2) {
      //this.state.navigation.navigate('EditProfile')
      firebase.auth().signOut().catch((error) => {
        const { code, message } = error;
        console.log(code,message)})
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

   saveChanges(goal_id,task_id){
    timestamp=Date.now()
    this.ref.collection('goals').doc(goal_id).collection('tasks')
    .doc(task_id).update({ checked: true, timestamp_completed:timestamp}).catch((error)=>console.log(error))
    this.ref.update({progress:this.state.progress}).catch((error)=>console.log(error))
  }

  onGoalDelete(goal_id){
    this.ref.collection('goals').doc(goal_id).update({delete:true}).then(()=>{
      _goals=[...this.state.goals]
      index=this.findObjectByKey(_goals,'id',goal_id)
      _goals.splice(index,1)
      this.setState({goals:_goals})
    }
    ).catch((error)=>{console.log(error)})

  }
  
  onGoalPopupEvent (eventName, index,goal) {
    if (eventName !== 'itemSelected') return
    if (index === 0) {
      this.props.navigation.navigate('AddTask',{goal:{id:goal.id,name:goal.name},
                                              tasks:goal.tasks, 
                                              task_ids: goal.tasks.map(a => a.id),action:'update',
                                              uName:this.state.name,
                                              profileURL:this.state.profileURL,
                                              refresh:()=>this.refreshFunction()
                                            });
    }
    else {
      Alert.alert(
        'Delete',
        'Are you sure you want to delete this goal and all related tasks?',
        [
          {text: 'Cancel'},
          {text: 'Yes, remove it', onPress:()=>this.onGoalDelete(goal.id)},
        ],
        { cancelable: false })
      }
    }

  logUpdates(goal,_task){
    timestamp=Date.now()

    this.log_ref.add({
      uid:this.userId,
      name:this.state.name,
      profileURL:this.state.profileURL,
      action:3, //1=set new goal, 2=set new task(s),3 completed task 
      goal_name:goal.name,
      comments_number:0,
      likes:0,
      timestamp:timestamp,
      likedUsers:[],
      tasks:[_task]

      }).catch((error)=>{console.log(error)})
  }
  onTaskChecked(e,item, goal_id){
    const _goals = [...this.state.goals] 
    goal_index=this.findObjectByKey(_goals,'id',goal_id)
    _tasks=[..._goals[goal_index].tasks]
    task_index=this.findObjectByKey(_tasks,'id',item.id)
    _tasks[task_index].checked =true;
    _goals[goal_index].tasks=_tasks
    _progress=this.state.progress
    _progress=_progress+1
    //save to changes to db
    this.logUpdates(_goals[goal_index],_tasks[task_index])
    this.setState({goals:_goals, progress:_progress},()=>this.saveChanges(goal_id,item.id));
    
    };
    getPrevId(arr){
      _arr=[];
      
      for(var i=0;i<arr.length;i++){
        _arr.push(arr[i].id);
      }
      return Math.max(..._arr)
    }
    
    addNewGoal(){
      //find max id from goals add 1
      id=1
      if (this.state.goals.length>0){
      
        last_id=this.getPrevId(this.state.goals)
        id=last_id+1
      }
      this.props.navigation.navigate('AddTask', {goal:{id:1,name:''},
                                                tasks:[{id:1, task:'',checked:false, delete:false}],
                                                uName:this.state.name,
                                                profileURL:this.state.profileURL,
                                                refresh: ()=>this.refreshFunction()})
    }
  onNotificationsPress(){

  this.props.navigation.navigate('Notifications',{currentUserId:this.userId,
                                                currentUserName:this.state.name,
                                                })
  }


renderGoal(goal){

  return(
      <View style={{padding:5}}>
      <View style={{flexDirection:'row'}}>
        <RkText rkType='primary' style={{flex:1}}>{goal.name}</RkText>
        <View style={{justifyContent: 'center', marginRight:5}}>
          <PopupMenu actions={['Edit', 'Delete']} onPress={(e,index)=>this.onGoalPopupEvent(e,index,goal)} />
        </View>
      </View>
      <View>
        {goal.tasks.length>0 && goal.tasks.map((item) => (
        <CheckBox checked={item.checked} title={item.task} 
        checkedIcon='check'
        containerStyle={{backgroundColor:'transparent',borderWidth: 0,flex:1}} 
        onIconPress={(e) => this.onTaskChecked(e,item,goal.id)}/>))}
      </View>  
      </View>

  )


}


  render() {
    const name =this.state.name
    const aboutMe=this.state.aboutMe
    const goals=this.state.goals
    const selectIndex=this.state.profileURL 
    return(
      <View  style={styles.root}>
	  <View style={[styles.userInfo, styles.bordered]}>
	  
		   <View style={[styles.header,styles.section]}>
			<Avatar img={this.profileURLs[selectIndex].url} rkType='medium' />
		   </View>
		   <View style={styles.section, {flex: 1,paddingTop:10}}>
		   <RkText rkType='header3'>{name}</RkText>
		   <RkText rkType='secondary1'>{aboutMe}</RkText>
		   </View>
		  
	  </View>
	  
      <View style={styles.buttons}>
        <RkButton style={styles.button}     contentStyle={{color: 'green', marginVertical:10,fontSize:16}} rkType='clear link' 
        onPress={() => this.addNewGoal()} >NEW GOAL</RkButton>
         <View style={styles.separator} />
        <RkButton style={styles.button}     contentStyle={{color: 'green', marginVertical:10, fontSize:16}} rkType='clear link' 
        onPress={() => this.onNotificationsPress()} >NOTIFICATIONS</RkButton>
      </View>
	  
	  <View style={styles.goalContainer}>


    <FlatList
     keyExtractor={item=>item.id}
     data={this.state.goals}
     renderItem={({item}) =>this.renderGoal(item)}
     refreshing={this.state.isLoading}
     //modify to load more instead of refresh
     onRefresh={()=>this.retrieveData(10)}
     onEndReachedThreshold={0.5}
     onEndReached={()=>this.getExtraData(10)}
    
    />
      
		
	  </View>
    </View>
	
    )
    }
};

export default Profile;
const styles = RkStyleSheet.create(theme => ({
  
  goalContainer:{
    marginLeft:10,
    flex:1
  },
  
  root: {
    backgroundColor: theme.colors.screen.base,
    flex:1
    
  },
  header: {
    
	paddingHorizontal: 10,
	
  },
  userInfo: {
    flexDirection: 'row',
  },
  bordered: {
    borderBottomWidth: 1,
    //borderTopWidth: 1,

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
    paddingVertical: 5,
    borderBottomWidth:1,
    borderColor: theme.colors.border.base,

  },
  button: {
 
    flex: 1,
    alignSelf: 'center',
	
  },
}));