import React, { Component } from 'react';
import { Avatar } from '../components/avatar';

import { View, Text, FlatList,TouchableOpacity ,Image} from 'react-native';
import {RkStyleSheet, RkText} from 'react-native-ui-kitten';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Notifications extends Component {
    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
    return {
      title: 'Notifications', //Cactus?? kinda misleading 
    };
    };
    onFocus(){
        db = firebase.firestore().collection('activity_log');
        db.add(
          {
            user_id:firebase.auth().currentUser.uid,
            action:'Notifications',
            timestamp:Date.now()
          }
        ).catch()
        }
     
    componentWillUnmount(){
        this.didFocusSubscription.remove()
    }
    
    
        
        
    componentDidMount(){
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
              this.onFocus();
        });
          this.currentUserId=this.props.navigation.getParam('currentUserId',null)
          this.currentUserName=this.props.navigation.getParam('currentUserName',null)
          this.ref=firebase.firestore().collection('notifications').doc(this.currentUserId).collection('docs')          
          this.retrieveData(10)
         }
       constructor(props) {
        
         super(props);
         this.profileURLs=[
            {id:0,url:require('../data/img/avatars/Image1.jpg')},
            {id:1,url:require('../data/img/avatars/Image2.jpg')},
            {id:2,url:require('../data/img/avatars/Image3.jpg')},
            {id:2,url:require('../data/img/avatars/image_default.jpg')},

          ]
         this.ref=null
         this.currentUserId=''
         this.currentUserName=''
         this.lastVisible=null
         this.state={
           isLoading:false,
           datas:[],
         }
         //AIM: 
         //get goal update data from firebase ...
         //put the data into   varibale datats    so datas = [{...},{...},{...}]
         //give the each element inside the datas to PlanView class in this way:
         
       }
       getExtraData(batchLimit){
        this.setState({isLoading:true})
        db=this.ref.orderBy('timestamp','desc').startAfter(this.lastVisible).limit(batchLimit);
        db.get().then((snap1)=>{
            this.lastVisible = snap1.docs[snap1.docs.length-1];
            var notifications=[]
            snap1.forEach((doc)=>{
                ntf={id:doc.id,sender_id:doc.data().sender_id,sender_name:doc.data().sender_name,profileURL:doc.data().profileURL  ==null ? 3:doc.data().profileURL,
                    update_id:doc.data().updateId, update_status:doc.data().update_status,action:doc.data().action}
                notifications.push(ntf)
            })
    
            datas=[...this.state.datas]
              this.setState({isLoading:false, datas:datas.concat(notifications)})

        }).catch((error)=>{console.log(error)})  
       }
       retrieveData(batchLimit){
        this.setState({isLoading:true})
       
        this.lastVisible=null
        db=this.ref.orderBy('timestamp','desc').limit(batchLimit)
    
        db.get().then((snap1)=>{
            this.lastVisible = snap1.docs[snap1.docs.length-1];
            var notifications=[]
            snap1.forEach((doc)=>{
                ntf={id:doc.id,sender_id:doc.data().sender_id,sender_name:doc.data().sender_name,profileURL:doc.data().profileURL ==null ? 3:doc.data().profileURL,
                    update_id:doc.data().updateId, update_status:doc.data().update_status,action:doc.data().action}
                notifications.push(ntf)
            })
    
            datas=[...this.state.datas]
    
      
            this.setState({isLoading:false, datas:notifications})
         
        })
            .catch((error)=>{console.log(error)})  
        }



    onAvatarPressed(userId){
      if (userId==null){
        return null;
      }
        this.props.navigation.navigate('ProfileGuest',{userId:userId})
    
    }
    onItemPressed(updateId){
      if (updateId==null){
        return null;
      }
        this.props.navigation.navigate('Update',{updateId:updateId})
    
    }
    renderNotification(item){
    var action =item.action
    var update_status=item.update_status


    if(update_status ==1){
        update_status= 'your new goal !';
    }else if(update_status== 2){
        update_status= 'your new plan !';
    }else if (update_status== 3){
        update_status= 'your completed task !';
    }
    else{
        update_status= 'new message!'
    }

    if (action==0){
        action='liked '
    }
    else if(action==1){
        action='commented on '
    }
    else{
      action= ': '
    }

    

    return(
    <View style={styles.container}>
    <TouchableOpacity onPress={()=>{this.onAvatarPressed(item.sender_id)}}>
       <Avatar
        img={this.profileURLs[item.profileURL].url}
        rkType='small'
   
      /> 
      </TouchableOpacity>
      <View style={styles.content}>
      <TouchableOpacity onPress={()=>{this.onItemPressed(item.update_id)}}>
        <View style={styles.mainContent}>
          <View style={styles.text}>
            <RkText>
              <RkText rkType='header6' style={{fontWeight:'bold'}}>{item.sender_name}</RkText>
              <RkText rkType='primary2'> {action} {update_status}</RkText>
            </RkText>
          </View>
        </View>
        </TouchableOpacity>
      </View>
    </View>)
     
    }
    onCommentEdit(text){
        this.setState({comment_text:text})
    }
  

    render() {
        //const datas=this.state.datas
        //if (this.datas==null) return null;
        return (
        <View style={styles.root}>
          <FlatList
          keyExtractor={item=>item.id}
          data={this.state.datas}
          renderItem={({item}) =>this.renderNotification(item)}
          refreshing={this.state.isLoading}
          //modify to load more instead of refresh
          onRefresh={()=>this.retrieveData(10)}
          onEndReachedThreshold={0.5}
          onEndReached={()=>this.getExtraData(10)}
          
        />
        </View>
        )
      }
    

}
const styles = RkStyleSheet.create(theme => ({
    root: {
      backgroundColor: theme.colors.screen.base,
      flex:1
    },
    container: {
      padding: 16,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: theme.colors.border.base,
      alignItems: 'flex-start',
    },
    text: {
      marginBottom: 5,
    },
    content: {
      flex: 1,
      marginHorizontal: 16,
    },
    mainContent: {
      
    },
  }));
  