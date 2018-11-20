import React, { Component } from 'react';
import { View, Text, Button,ScrollView ,Image} from 'react-native';
import {RkCard,RkStyleSheet} from 'react-native-ui-kitten';
import { PlanView } from '../components/planView';
import firebase from 'react-native-firebase';

export class Feed extends Component {

  static navigationOptions = {
    title: 'Feed', //Cactus?? kinda misleading 
  };

  
  
  constructor(props) {
    super(props);
    this.ref=firebase.firestore().collection('updates')
    console.log('called')

    this.currentUser=firebase.auth().currentUser.uid
    this.state={
      datas:null
    }
    //AIM: 
    //get goal update data from firebase ...
    //put the data into   varibale datats    so datas = [{...},{...},{...}]
    //give the each element inside the datas to PlanView class in this way:
    
    // {datas.map((item) => (
    //   <View style={styles.root}>
    //     <PlanView data = {item} />
    //     {/* <View style={styles.separator}/> */}
    //   </View>
    // ))}


    //TRY:
    // this.ref=firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    // this.ref.get().then((doc)=>{if (doc.exists) 
    //           {var user=doc.data()
    //           //retrieve goals
    //           this.state = {
    //             name:user.name,
    //             aboutMe:user.aboutMe}
    //           }}).catch()   
    // this.state = {
    //     datas:Feed.datas,
    // };
  }

  componentDidMount(){
   this.retrieveData()
  }
  retrieveData(){
    this.ref.orderBy('timestamp','desc').get().then((snap1)=>{
      var updates=[]
      snap1.forEach((doc) => {
      update={id:doc.id, user_id:doc.data().uid,username:doc.data().name, status:doc.data().action,
        goal_name:doc.data().goal_name, likes:doc.data().likes, hasLiked:doc.data().likedUsers.includes(this.currentUser),
        tasks:doc.data().tasks}
      updates.push(update)      
      //retrieve tasks
        })
      return updates;
  
      }).then((updates)=>{
        this.setState({datas:updates})
      }
      
       )
       .catch((error)=>{console.log(error)})  
  }
  
  render() {
    const datas=this.state.datas
    return (
      <ScrollView>

        {datas!==null && datas.map((item) => (
          <View style={styles.root}>
            <PlanView data = {item} currentUserId={this.currentUser}/>
            {/* <View style={styles.separator}/> */}
          </View>
        ))}

      </ScrollView>
    )
  }
};
const datas = [
  {
    id:1,
    username:'yixuanyxyxx emmm what if my name super long what will gonna happen ? i just curious',
    status: 2, //1:creat 2:update 3:complish 
    goal_name:'new goal1',
    tasks:[{id:1,task:'do smth 1',checked:true},{id:2,task:'do smth 2',checked:false}],
    likes: 18,
    comments:[{id:1,content:'comment 1 goodbye everybody i have got to go goodbye everybody i have got to go ',username:'user1'},{id:2,content:'love u ',username:'user2'}],
    commentText :'',
    commentLinePlaceholder : 'Encourage your friend !'
    // comments: 26,
  // checked:false 
  },
  {
    id:1,
    username:'icelandofmonster',
    status: 1, //1:creat 2:update 3:complish 
    goal_name:'new goal',
    tasks:[{id:1,task:'do smth 1',checked:false},{id:2,task:'do smth 2',checked:false}],
    likes: 18,
    comments:[
      {id:1,content:'comment 1',username:'user1'},
      {id:2,content:'Mama, just killed a man; Put a gun against his head; Pulled my trigger, now he\'s dead;Mama, life had just begun;But now I\'ve gone and thrown it all away; Mama, ooh, didn\'t mean to make you cry; If I\'m not back again this time tomorrow; Carry on, carry on as if nothing really matters',username:'user2'},
      {id:3,content:'goodbye everybody i have got to go',username:'user3'}],
    commentText :'',
    commentLinePlaceholder : 'Encourage your friend !'
    // comments: 26,
    // checked:false 
}];




export default Feed;


const styles = RkStyleSheet.create(theme => ({
	
  
  root: {
    paddingHorizontal: 10,
    flex:1,
    paddingVertical: 10,
    backgroundColor: theme.colors.screen.base,
  },
  container:{
    flex:1,
  },
  header: {
    
	paddingHorizontal: 10,
	
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
    flex: 1,
    width: 400,
    height: 1,
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