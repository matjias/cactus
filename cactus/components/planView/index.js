import React, { Component } from 'react';
import { 
    View,  
    Alert,
    Keyboard,
    Text, 
    Button,
    ScrollView,
    Image
} from 'react-native';
import {
    RkCard,
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
    
    static data = 
    // static datas = [
        {
        username:'yixuan',
        status: 2, //1:creat 2:update 3:complish 
        tasks:[{id:1,task:'do smth 1',checked:true},{id:2,task:'do smth 2',checked:false}],
        likes: 18,
        comments:[{id:1,content:'comment 1',username:'user1'},{id:2,content:'comment 2',username:'user2'},{id:3,content:'comment 3',username:'user3'}],
        commentText :'',
        commentLinePlaceholder : 'Encourage your friend !'
        // comments: 26,
	    // checked:false 
    };
    // ,  {
    //     username:'yixuan',
    //     status: 2, //1:creat 2:update 3:complish 
    //     //tasks:{1:{task:'do smth 1',checked:false},2:{task:'do smth 2',checked:false}},
    //     tasks:[{id:1,task:'do smth 1',checked:true},{id:2,task:'do smth 2',checked:false}],
    //     likes: 18,
    //     comments:[{id:1,content:'comment 1',username:'user1'},{id:2,content:'comment 2',username:'user2'},{id:3,content:'comment 3',username:'user3'}],
    //     commentText :'',
    //     // comments: 26,
	//     // checked:false 
    // }
    // ];

    componentDidMount () {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        console.log(this.state.hasLiked)
    }

    componentWillUnmount () {
        this.keyboardDidHideListener.remove();
    }
  
    constructor(props) {
        super(props);
        this.ref= firebase.firestore().collection('updates')
        this.state = {
            likes: this.props.data.likes || PlanView.data.likes,
            comments: this.props.data.comments || PlanView.data.comments,
            username: this.props.data.username || PlanView.data.username,
            status: this.props.data.status || PlanView.data.status,
            tasks: this.props.data.tasks ||PlanView.data.tasks,
            goal_name: this.props.data.goal_name, 
            hasLiked:this.props.data.hasLiked || false,
            updateId:this.props.data.id,
            updateUserId:this.props.data.user_id,
            edit_task_id:-1,
            currentUserId:this.props.currentUserId,
        };
    }

    onLikeButtonPressed = () => {
        if (this.state.hasLiked==true){
            return null
        }
        else{
        _likes=this.state.likes+1
        //!!!!! no good here
        // const defaultCount = PlanView.data.likes;
        this.setState({
            //????
            likes: _likes,
            hasLiked:true
            // this.state.likes === defaultCount ?
            //  : defaultCount,

        });
        this.ref.doc(this.state.updateId).update({likes:_likes,likedUsers:firebase.firestore.FieldValue.arrayUnion(this.state.currentUserId)})
    }
    };


//   onCommentButtonPressed = () => {
//     const defaultCount = PlanView.data.comments;
//     this.setState({
//       comments: this.state.comments === defaultCount ? this.state.comments + 1 : defaultCount,
//     });
//   };
  
    findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return null;
    };

 

    onTaskEdit(text){
        // PlanView.data.commentLinePlaceholder  = text;
        PlanView.data.commentText = text;
    // const _tasks = [...this.state.tasks];
    // index=this.findObjectByKey(_tasks,'id',id);
    // _tasks[index].task =text ;
  
    // this.setState({edit_task_id: id, tasks:_tasks});
    };

    onEditDone(){
        // PlanView.data.commentLinePlaceholder = 'Encourage your friend!';
        const _comments = [...this.state.comments];
        index = _comments.length;
        var newElement = {id:index, content:'',username:'' }
        newElement.content = PlanView.data.commentText;
        newElement.username = 'you';
        _comments.push(newElement);

        // document.getElementById('commentLine').value = '';
        this.setState({
            commentLinePlaceholder:'say more to Encourage your friend!!',
            comments:_comments});
        //   const _comments = [...this.state.comments];
        //   index = length(_comments);
        //   _comments[index].id = index;
        //   _comments[index].content = text;
        //   _comments[index].username = 'you';
        //   _comments[index] = {id:{index}}

        //     const _edit_id=-1
        //     this.setState({edit_task_id:_edit_id}); 
    }

    _keyboardDidHide= (event) =>{
        this.onEditDone()
    }

    onTaskDelete(id){
        const _edit_id = -1;
        const _tasks = [...this.state.tasks];
        index=this.findObjectByKey(_tasks,'id',id);
        _tasks.splice(index, 1);
        this.setState({edit_task_id:_edit_id, tasks:_tasks});
    };

    onPopupEvent (eventName, index,id) {
        if (eventName !== 'itemSelected') 
            return
        const _edit_id=id
        if (index === 0) {
            this.setState({edit_task_id:_edit_id});
        }
        else {
            Alert.alert(
                'Delete',
                'Are you sure you want to delete this task?',
            [
                {text: 'Cancel'},
                {text: 'Yes, remove it', onPress:()=>this.onTaskDelete(id)},
            ],
            { cancelable: false })
        }
    }

    render() {
        const {
            container, section, icon, label,task,
        } = this.defineStyles();

        const likes = this.state.likes + (this.props.showLabel ? ' Likes' : '');
        // const comments = this.state.comments + (this.props.showLabel ? ' Comments' : '');
        const comments = this.state.comments;
        const tasks=this.state.tasks
        const goal_name=this.state.goal_name

        const username=this.state.username

        if(this.state.status ==1){
            status= 'just set a new goal !';
        }else if(this.state.status == 2){
            status= 'just created new plan !';
        }else{
            status= 'just completed a task !';
        }

        
        const edit_task_id=this.state.edit_task_id

        return (
            <View style={container}>
                <View>
                    <RkText rkType='primary'>{username}</RkText>
                </View>
                <View>
                    <RkText rkType='primary hintColor'>{status}</RkText>
                </View>
                <View>
                    <RkText rkType='primary'>{goal_name}</RkText>
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
    
               

                <View style={{paddingLeft: 10}}>
                    <RkButton rkType='clear' onPress={this.onLikeButtonPressed}>
                        <RkText rkType='primary' style={icon}><Ionicons name={'heart'}/></RkText>
                        <RkText rkType='primary' style={label}>{' '+likes}</RkText>
                    </RkButton>
                </View>

                <View>
                    {comments.map((item) => (
                    // <View  style={{flex:1, flexDirection:'row', paddingVertical: 10,paddingHorizontal: 10}}>
                    <View>
                        <RkText rkType='primary primary2'>{item.username+':'}</RkText>
                        {/* <RkText style={{flexDirection:'row'}} > : </RkText> */}
                        <RkText  >{item.content}</RkText>
                    </View>
                    ))}
   
                    <View>
                        <RkTextInput 
                        label={<Ionicons name={'thumbs-up'}/>} 
                        rkType='rounded' 
                        id = 'commentLine'
                        multiline = {false} 
                        // placeholder = 'Encourage your friend !'
                        placeholder = {PlanView.data.commentLinePlaceholder }
                        // value = {PlanView.data.commentLinePlaceholder }
                        onChangeText={(text) => this.onTaskEdit(text)}/> 
                        {/* <RkButton rkType='clear' onPress={this.onEditDone}>
                            <RkText rkType='awesome primary' style={icon}><Ionicons name={'heart'}/></RkText>
                            <RkText rkType='primary primary4' style={label}>{likes}</RkText>
                        </RkButton> */}
                    </View>
       
                </View>
	        </View>
    );
}
}

