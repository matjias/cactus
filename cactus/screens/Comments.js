import React, { Component } from 'react';
import { 
    View,  
    Alert,
    Keyboard,
    Text, 
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    
} from 'react-native';
import {
    RkStyleSheet,
    RkText,
    RkTextInput,
    RkButton,
    RkComponent
} from 'react-native-ui-kitten';
import { Avatar } from '../components/avatar';

import Ionicons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from 'react-native-firebase';

export default class Comments extends Component {
    static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
    return {
      title: 'Comments', //Cactus?? kinda misleading 
    };
    };


    onFocus(){
        db = firebase.firestore().collection('activity_log');
        db.add(
          {
            user_id:firebase.auth().currentUser.uid,
            action:'comments',
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
          this.currentUserURL=this.props.navigation.getParam('currentUserURL',null)

          this.updateUserId=this.props.navigation.getParam('updateUserId',null)
          this.updateStatus=this.props.navigation.getParam('update_status',null)
          this.updateId=this.props.navigation.getParam('updateId',null)
          this.ref=firebase.firestore().collection('comments').doc(this.updateId).collection('upd_comments')
          this.ref_notifications=firebase.firestore().collection('notifications').doc(this.updateUserId).collection('docs')   
          
          this.retrieveData(10)
         }
       constructor(props) {
        
         super(props);
         this.profileURLs=[
            {id:0,url:require('../data/img/avatars/Image1.jpg')},
            {id:1,url:require('../data/img/avatars/Image2.jpg')},
            {id:2,url:require('../data/img/avatars/Image3.jpg')},
            {id:3,url:require('../data/img/avatars/image_default.jpg')},

          ]
         this.ref=null
         this.ref_notifications=null
         this.currentUserId=''
         this.currentUserName=''
         this.currentUserURL=''
         this.updateUserId=''
         this.updateId='',
         this.updateStatus='',
         this.lastVisible=null

         //this.retrieveData=this.retrieveData.bind(this);
         this.state={
           isLoading:false,
           datas:[],
           comment_text:''
         }
         //AIM: 
         //get goal update data from firebase ...
         //put the data into   varibale datats    so datas = [{...},{...},{...}]
         //give the each element inside the datas to PlanView class in this way:
         
       }

    getExtraData(batchLimit){
        console.log('extra')
        this.setState({isLoading:true})
        db=this.ref.orderBy('timestamp','desc').startAfter(this.lastVisible).limit(batchLimit);
        db.get().then((snap1)=>{
            this.lastVisible = snap1.docs[snap1.docs.length-1];
            var comments=[]
            snap1.forEach((doc)=>{
                comment={id:doc.id,userId:doc.data().userId,username:doc.data().username,
                    profileURL:doc.data().profileURL  ==null ? 3:doc.data().profileURL,content:doc.data().content}
                comments.push(comment)
            })
    
            datas=[...this.state.datas]
    
          
              this.setState({isLoading:false, datas:datas.concat(comments)})
    
            
        }).catch((error)=>{console.log(error); this.setState({isLoading:false})})  

    }

    retrieveData(batchLimit){
    this.setState({isLoading:true})

    this.lastVisible=null
    db=this.ref.orderBy('timestamp','desc').limit(batchLimit)      

    db.get().then((snap1)=>{
        this.lastVisible = snap1.docs[snap1.docs.length-1];
        var comments=[]
        snap1.forEach((doc)=>{
            comment={id:doc.id,userId:doc.data().userId,username:doc.data().username,
                
            profileURL:doc.data().profileURL ==null ? 3:doc.data().profileURL,content:doc.data().content}
            comments.push(comment)
            console.log(comment)
        })
        this.scrollList.scrollToOffset(0)
        this.setState({isLoading:false, datas:comments})

    
    }).catch((error)=>{console.log(error); this.setState({isLoading:false})})  
    }


   
    onCommentEdit(text){
        this.setState({comment_text:text})
    }
    sendComment(){
        Keyboard.dismiss()
        content=this.state.comment_text.trim()
        this.setState({comment_text:''},)
        this.textInput.inputRef.setNativeProps({text: ''})
        
        if (content=='') return null
        this.ref.add({
            userId:this.currentUserId,
            username:this.currentUserName,
            profileURL:this.currentUserURL,

            content:content,
            timestamp:Date.now(),
            delete:false
        }).then(()=>{
            this.retrieveData(10)
            this.props.navigation.state.params.update_comment_number()
        })
        //update notifications
        sender_id=this.currentUserId
        receiver_id=this.updateUserId
        console.log(sender_id,receiver_id)
        if (sender_id==receiver_id) return null
        this.ref_notifications.add({
            sender_id:this.currentUserId,
            sender_name:this.currentUserName,
            profileURL:this.currentUserURL,
            updateId:this.updateId,
            update_status:this.updateStatus, //1 new goal, 2 new plan 3 task completed ,
            action:1, //1 comment , 0 like
            timestamp:Date.now() 
        })


    }
onAvatarPressed(userId){
    this.props.navigation.navigate('ProfileGuest',{userId:userId})

}
renderSeparator = () => (
    <View style={styles.separator} />
  );
    render() {
        
        //const datas=this.state.datas
        //if (this.datas==null) return null;
        return (
        <View style={styles.root}>
        <View style={{flex:1}}>
          <FlatList
          ref={ref => this.scrollList = ref}
          keyExtractor={item=>item.id}
          data={this.state.datas}
         
          renderItem={({item}) =>  <View style={styles.container}>
                                    <TouchableOpacity onPress={() => this.onAvatarPressed(item.userId)}>
                                     <Avatar img={this.profileURLs[item.profileURL].url} rkType='small' />
                                    </TouchableOpacity>
                                    <View style={styles.content}>
                                        <View style={styles.contentHeader}>
                                        <RkText rkType='header5' style={{fontWeight:'bold'}}>{item.username}</RkText>
                                        </View>
                                        <RkText rkType='primary3 mediumLine'>{item.content}</RkText>
                                    </View>
                                    </View>}
          refreshing={this.state.isLoading}
          //modify to load more instead of refresh
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={()=>{this.retrieveData(20)}}
          onEndReachedThreshold={0.5}
          onEndReached={()=>this.getExtraData(20)}
          
        />
        
        </View>
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
        <RkTextInput 
        ref={ref=>this.textInput=ref}
          style={{flex:1}}
          //label={<Ionicons name={'thumbs-up'}/>} 
          rkType='rounded' 
          inputStyle={{fontSize:16,
                        padding:5,}}
          placeholder ='Encourage your friend!'
          onChangeText={(text) => this.onCommentEdit(text)}
          
        />
        <TouchableOpacity  style={{flexWrap:'wrap',justifyContent:'center'}} onPress={()=>{this.sendComment()}}>
        <Icon size={27} name={'send'}/>
        </TouchableOpacity>
        </View>
        </View>
        )
      }
    

}
const styles = RkStyleSheet.create(theme => ({ 
    root: {
      backgroundColor: theme.colors.screen.base,
      padding:15,
      flex:1,
      flexDirection:'column',
      justifyContent:'space-between'
    },
    container: {
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      content: {
        marginLeft: 16,
        flex: 1,
      },
      contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
      },
      separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.border.base,
      },
}))