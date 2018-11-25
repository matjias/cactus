import React, { Component } from 'react';
import { 
    View,  
    Alert,
    Keyboard,
    Text, 
    Button,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Avatar } from '../avatar';

import {
    RkStyleSheet,
    RkText,
    RkTextInput,
    RkButton,
    RkComponent
} from 'react-native-ui-kitten';
import Ionicons from 'react-native-vector-icons/AntDesign';
import PopupMenu from '../popup';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';



export class PlanView extends RkComponent {
    componentName = 'PlanView';
    
    typeMapping = {
      container: {},
      section: {},
      icon: {},
      label: {},
      task:{},
    };
    

    componentDidMount () {

    }

  
    constructor(props) {
        super(props);
        this.profileURLs=[
            {id:0,url:require('../../data/img/avatars/Image1.jpg')},
            {id:1,url:require('../../data/img/avatars/Image2.jpg')},
            {id:2,url:require('../../data/img/avatars/Image3.jpg')},
            {id:3,url:require('../../data/img/avatars/image_default.jpg')},

          ]
        this.currentUserId=this.props.currentUserId,
        this.currentUserName=this.props.currentUserName,
        this.currentUserURL=this.props.currentUserURL,

        this.ref= firebase.firestore().collection('updates')

        this.navigation=this.props.navigation
        this.onCommentButtonPressed=this.onCommentButtonPressed.bind(this)
        this.onLikeButtonPressed=this.onLikeButtonPressed.bind(this)
        this.updateId=this.props.data.id
        this.updateUserId=this.props.data.user_id
       
        this.ref_notifications=firebase.firestore().collection('notifications').doc(this.updateUserId).collection('docs')   


      
    }

    updateCommentNumber(){
        this.props.update_comments()
        temp=this.ref.doc(this.updateId)

        temp.get().then((doc)=>{
            comments_number=doc.data().comments_number 
            console.log(comments_number)
            temp.update({comments_number:comments_number+1,
        })
    }).catch()
}
    onLikeButtonPressed(){

        if (this.props.data.hasLiked==true){
            return null
        }
        else{
            this.props.update_likes()

        temp=this.ref.doc(this.updateId)

        temp.get().then((doc)=>{
            _likes=doc.data().likes
            temp.update({likes:_likes+1,
            likedUsers:firebase.firestore.FieldValue.arrayUnion(this.currentUserId)})
        }).catch((error)=>{console.log(error)})
        sender_id=this.currentUserId
        receiver_id=this.updateUserId
        if (sender_id==receiver_id) return null
        this.ref_notifications.add({
            sender_id:this.currentUserId,
            sender_name:this.currentUserName,
            profileURL:this.currentUserURL,
            updateId:this.updateId,
            update_status:this.props.data.status, //1 new goal, 2 new plan 3 task completed
            timestamp:Date.now(), 
            action:0 //1 comment , 0 like
        })
    
    
    }
    };


  onCommentButtonPressed () {
      this.navigation.navigate('Comments',{updateId:this.updateId,
                                                updateUserId:this.updateUserId,
                                                currentUserId:this.currentUserId,
                                                currentUserURL:this.currentUserURL,
                                            currentUserName:this.currentUserName,
                                        update_status:this.props.data.status,
                                    update_comment_number:()=>this.updateCommentNumber()})
    // const defaultCount = PlanView.data.comments;
    // this.setState({
    //   comments: this.state.comments === defaultCount ? this.state.comments + 1 : defaultCount,
    // });
  };
  

    onPostReport(){
        Alert.alert(
            'Dear ',
        'Thank you for reporting this post to us!',
        )
        db=firebase.firestore().collection('reports')
        db.add({
            user:this.currentUserId,
            reported_user:this.updateUserId,
            reported_update:this.updateId,
            action:'reported post',
            timestamp:Date.now()
        }).catch()
    }

    onPopupReport (eventName, index) {
        if (eventName !== 'itemSelected') return
        //const _edit_id=id
        if (index === 0) {
          Alert.alert('Dear','Are you sure you want to report this post?',
            [
                {text: 'Cancel'},
                {text: 'Yes, report', onPress:() => this.onPostReport()},
            ],
            {cancelable: false})
        }
    }
    onAvatarPressed(userId){
        this.navigation.navigate('ProfileGuest',{userId:userId})
    
    }
    render() {
        var likes = this.props.data.likes ;
        // const likes = this.state.likes + (this.props.showLabel ? ' Likes' : '');
        // const comments = this.state.comments + (this.props.showLabel ? ' Comments' : '');
        const comments_number = this.props.data.comments_number || 0;
        const tasks=this.props.data.tasks || []
        const goal_name=this.props.data.goal_name
        const selectIndex= this.props.data.profileURL
        const username=this.props.data.username

        if(this.props.data.status ==1){
            status= 'just set a new goal !';
        }else if(this.props.data.status == 2){
            status= 'just created new plan !';
        }else{
            status= 'just completed a task !';
        }

        if(likes>=1){
            likes = likes + ' likes';
        }else{
            likes = likes + ' like';
        }
        
        const hasLiked=this.props.data.hasLiked

        return (
            <View style={styles.root}>
                
                <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={()=>{this.onAvatarPressed(this.updateUserId)}}>
                <Avatar img={this.profileURLs[selectIndex].url} rkType='small' />
                </TouchableOpacity>
                <View style={{flex:1,marginLeft:5}}>
                <TouchableOpacity onPress={()=>{this.onAvatarPressed(this.updateUserId)}}>

                    <RkText rkType='header4'>{username}</RkText>
                    <RkText rkType='secondary2 hintColor'>{status}</RkText>
                </TouchableOpacity>
                </View>
              
                <View style={{justifyContent: 'center'}}>
                        <PopupMenu actions={['Report post']}  onPress={(e,index)=>this.onPopupReport(e,index)} />
                </View>
                </View>
                    <View >
                        <RkText rkType='primary3'>
                        <RkText rkType='primary3' style={{fontWeight:'bold'}}>Goal Name: </RkText>
                        {goal_name}</RkText>
                    </View>
                       		
                {tasks.length>0 && tasks.map((item) => (
                // <View  style={{flex:1, flexDirection:'row', paddingVertical: 10,paddingHorizontal: 10}}>
                <View>
                    <CheckBox checked={item.checked} 
                    checkedIcon='check'
                    activeOpacity={1}
                    title={item.task} containerStyle={{backgroundColor:'transparent',borderWidth: 0,flex:1}} />
                </View>
                ))}    
    
               

                <View style={{alignSelf:'center',flexDirection:'row',flexWrap:'wrap'}}>
                    <RkButton style={{margin:10}} rkType='clear' onPress={()=>{this.onLikeButtonPressed()}}>
                        <RkText rkType='primary6'> </RkText>
                        <RkText rkType='primary' ><Icon style={{fontSize:27}} name={hasLiked==true ? 'heart':'heart-o'}/></RkText>
                     
                        <RkText rkType='primary' >{'  '+likes}</RkText>
                    </RkButton>
                     <RkButton style={{margin:10}} rkType='clear' onPress={()=>{this.onCommentButtonPressed()}}>
                        <RkText rkType='primary6'> </RkText>
                        <RkText rkType='primary' ><Icon style={{fontSize:27}} name={'comment-o'}/></RkText>
                     
                        <RkText rkType='primary' >{'  '+comments_number}</RkText>
                    </RkButton>
                </View>
                


	        </View>
    );
}
}

const styles = RkStyleSheet.create(theme => ({ 
    root: {
      backgroundColor: theme.colors.screen.base,
      marginTop:15,
      marginBottom:15,
      marginLeft:15
    },
}))

// <View>
// <RkText >Comments: </RkText>
// {comments.map((item) => (
// // <View  style={{flex:1, flexDirection:'row', paddingVertical: 10,paddingHorizontal: 10}}>
// <View>
//     <RkText rkType='primary primary2'>{item.username+':'}</RkText>
//     <RkText  >{item.content}</RkText>
// </View>
// ))}

// <View>
//     <Ionicons style={{fontSize:27, flex:1, flexDirection:'row'}} name={'heart'}/>
//     <RkTextInput 
//     // style={{flex:1,flexDirection:'row'}}
//     // label={<Ionicons name={'thumbs-up'}/>} 
//     rkType='rounded' 
//     id = 'commentLine'
//     multiline = {false} 
//     // placeholder = 'Encourage your friend !'
//     placeholder = {PlanView.data.commentLinePlaceholder }
//     // value = {PlanView.data.commentLinePlaceholder }
//     onChangeText={(text) => this.onTaskEdit(text)}/> 
//     {/* <RkButton rkType='clear' onPress={this.onEditDone}>
//         <RkText rkType='awesome primary' style={icon}><Ionicons name={'heart'}/></RkText>
//         <RkText rkType='primary primary4' style={label}>{likes}</RkText>
//     </RkButton> */}
// </View>
// </View>