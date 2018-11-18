import React from 'react';
import { View, Alert,Keyboard } from 'react-native';
import {
  RkText,
  RkTextInput,
  RkButton,
  RkComponent,
} from 'react-native-ui-kitten';
import { CheckBox } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/AntDesign';
import PopupMenu from '../popup';


export class Goal extends RkComponent {
  componentName = 'Goal';
  typeMapping = {
    container: {},
    section: {},
    icon: {},
    label: {},
	task:{},
  };
  static data = {
	goal:'test goal',
  //tasks:{1:{task:'do smth 1',checked:false},2:{task:'do smth 2',checked:false}},
  tasks:[{id:1,task:'do smth 1',checked:false},{id:2,task:'do smth 2',checked:false}],
    likes: 18,
    comments: 26,
	checked:false
    
  };

  componentDidMount () {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidHideListener.remove();
  }
  
  constructor(props) {
    super(props);
    this.state = {
    likes: this.props.likes || Goal.data.likes,
    comments: this.props.comments || Goal.data.comments,
	  goal: this.props.goal || Goal.data.goal,
    tasks: this.props.tasks ||Goal.data.tasks,
    edit_task_id:-1,
    };
    console.log(this.state.goal)
  }
  onAddNewTaskPress= () => {
    const _tasks = Object.assign({},this.state.tasks);
	max_key=Math.max(...Object.keys(_tasks))
	_tasks[max_key+1]={task:'new_task',checked:false}
	this.setState({tasks:_tasks});
  };
  onLikeButtonPressed = () => {
    const defaultCount = Goal.data.likes;
    this.setState({
      likes: this.state.likes === defaultCount ? this.state.likes + 1 : defaultCount,
    });
  };

  onCommentButtonPressed = () => {
    const defaultCount = Goal.data.comments;
    this.setState({
      comments: this.state.comments === defaultCount ? this.state.comments + 1 : defaultCount,
    });
  };
  
  findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }
    return null;
  };

 
  onTaskChecked(e,item){
    const _tasks = [...this.state.tasks] //Object.assign({},this.state.tasks);
    index=this.findObjectByKey(_tasks,'id',item.id)
      _tasks[index].checked =!this.state.tasks[index].checked ;
      this.setState({tasks:_tasks});
      
    };

  onTaskPress(e,item){
    _edit_id = this.state.edit_task_id;
    _edit_id=item.id;
    this.setState({edit_task_id:_edit_id});
    };

  onTaskEdit(text,id){
    
    const _tasks = [...this.state.tasks];
    index=this.findObjectByKey(_tasks,'id',id);
    _tasks[index].task =text ;
  
    this.setState({edit_task_id: id, tasks:_tasks});
    };

  onEditDone(){
    const _edit_id=-1
    this.setState({edit_task_id:_edit_id});
    
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
    if (eventName !== 'itemSelected') return
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
    const comments = this.state.comments + (this.props.showLabel ? ' Comments' : '');
    const tasks=this.state.tasks
    const goal=this.state.goal
    const edit_task_id=this.state.edit_task_id

    return (
    <View>
    <View>
    <RkText rkType='primary'>{goal}</RkText>
    </View>
    
    {tasks.map((item) => (
      item.id==edit_task_id?
      (<View>
        <RkTextInput multiline = {true}
        onChangeText={(text) => this.onTaskEdit(text,edit_task_id)} value={item.task}
         />
      
      </View>)
      :
      (<View style={{flexDirection:'row'}}>
        <CheckBox checked={item.checked} title={item.task} containerStyle={{backgroundColor:'transparent',borderWidth: 0,flex:1}} 
        onIconPress={(e) => this.onTaskChecked(e,item)}/>
        <View style={{justifyContent: 'center',}}>
          <PopupMenu actions={['Edit', 'delete']} onPress={(e,index)=>this.onPopupEvent(e,index,item.id)} />
        </View>
      </View>)
    ))
    }
   
    
    
    
	
      <View style={container}>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.onLikeButtonPressed}>
            <RkText rkType='awesome primary' style={icon}><Ionicons name={'heart'}/></RkText>
            <RkText rkType='primary primary4' style={label}>{likes}</RkText>
          </RkButton>
        </View>
        <View style={section}>
          <RkButton rkType='clear' onPress={this.onCommentButtonPressed}>
            <RkText rkType='awesome hintColor' style={icon}> <Ionicons name={'comment'}/></RkText>
            <RkText rkType='primary4 hintColor' style={label}>{comments}</RkText>
          </RkButton>
        </View>
		<View><RkButton rkType='primary' onPress={this.onAddNewTaskPress}>+</RkButton></View>
       
      </View>
	 </View>
    );
  }
}
