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



export class ProfileGuest extends Component {
  static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
    return {
      title: ''.toUpperCase(),
        //headerTitleStyle :{color:'#fff'},
        //headerStyle: {backgroundColor:'#3c3c3c'},
		//headerRight: <Icon style={{ marginLeft:15,color:'green' }} name={'check'} size={25} onPress={() => params.handleSave()} />
		  headerRight: <View style={{justifyContent: 'center',marginRight:10}}>
      <PopupMenu actions={['Report user']} onPress={(e,index)=>params.onPopupEvent(e,index)} />
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
    this.userId=''
    this.retrieveProfileInfo=this.retrieveProfileInfo.bind(this)
    this.lastVisible=null,
    this.ref=''//
   
    this.onPopupEvent=this.onPopupEvent.bind(this)                
  }
  retrieveProfileInfo(){
 //retrieve profile info
    this.ref.get().then((doc)=>{if (doc.exists) 
    {var user=doc.data()
    this.setState({name:user.name,aboutMe:user.aboutMe,progress:user.progress,profileURL:user.profileURL  ==null ? 3:user.profileURL})
    }}).catch()
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
        this.setState({isLoading:false})
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
        friend_id:this.userId,
        action:'friends profile',
        timestamp:Date.now()
      }
    ).catch()
    }
 
componentWillUnmount(){
    this.didFocusSubscription.remove()
  }


    
   componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.onFocus();
    });
    //var loading=true;
    this.props.navigation.setParams({ onPopupEvent:  this.onPopupEvent });
    this.userId=this.props.navigation.getParam('userId',null)
    this.ref=firebase.firestore().collection('users').doc(this.userId)
    this.retrieveData(10)
    this.retrieveProfileInfo()
    //loading=false;
    }
    
onPostReport(){
    Alert.alert('Dear',
        'Thank you for reporting this user to us!',
    )
    db=firebase.firestore().collection('reports')
    db.add({
        user:firebase.auth().currentUser.uid,
        reported_user:this.userId,
        action:'reported user',
        timestamp:Date.now()
    }).catch()
}
  
  onPopupEvent (eventName, index) {
    if (eventName !== 'itemSelected') return
    if (index === 0){
        //report user
        Alert.alert('Dear','Are you sure you want to report this user?',
        [
            {text: 'Cancel'},
            {text: 'Yes, report', onPress:() => this.onPostReport()},
        ],
        {cancelable: false})
    }
   
  
  }
 
renderGoal(goal){

  return(
      <View style={{padding:5}}>
        <RkText rkType='primary' style={{flex:1}}>{goal.name}</RkText>
      <View>
        {goal.tasks.length>0 && goal.tasks.map((item) => (
        <CheckBox checked={item.checked} title={item.task} 
        activeOpacity={1}
        checkedIcon='check'
        containerStyle={{backgroundColor:'transparent',borderWidth: 0,flex:1}} 
       />))}
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

export default ProfileGuest;
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