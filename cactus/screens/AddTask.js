import React, { Component } from 'react';
import { ScrollView,View, Keyboard, FlatList,ListItem,Button, TouchableOpacity } from 'react-native';
import {
  RkText,
  RkButton,
  RkComponent,
  RkTextInput,RkStyleSheet,
} from 'react-native-ui-kitten';
import firebase from 'react-native-firebase';

import Icon from 'react-native-vector-icons/AntDesign';

export class AddTask extends Component {
	static data = {
	goal:{id:1, name:''},
  tasks:[{id:1, task:'',checked:false}],
	suggestions:['Learning Korean','Learning English','Learning Spanish','Learning Python','Learning Java'],
	
    
  };
	
	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
    return {
        //title: '[ Admin ]',
        //headerTitleStyle :{color:'#fff'},
        //headerStyle: {backgroundColor:'#3c3c3c'},
        headerRight: <Icon style={{ marginLeft:15,color:'green' }} name={'check'} size={25} onPress={() => params.handleSave()} />
    };
	};

	componentDidMount() {
		this.props.navigation.setParams({ handleSave:  this._saveDetails });
		}
		
	constructor(props) {
		super(props);
		this.ref = firebase.firestore().collection('goals');
		this._saveDetails=this._saveDetails.bind(this);
    this.state = {
		navigation:this.props.navigation,
	  goal: AddTask.data.goal,
	  tasks: AddTask.data.tasks,
	  
		suggestions: AddTask.data.suggestions,
		query_result:AddTask.data.suggestions,
		//if suggestions visible
		isVisible:false,


	  
		}
	};
	
	_saveDetails() {
		goal_id=this.state.goal.id.toString();
		goal=this.state.goal.name
		//add goal do to collection goals
		this.ref.doc(goal_id).set({
			id:goal_id,
			name:goal
		});
		//add tasks
		tasks=this.state.tasks
		for (i=0; i<tasks.length;i++){
			t=tasks[i]
			task_id=t.id.toString()
			task_name=t.task
			isChecked=t.checked.toString()
			console.log(task_id,task_name,isChecked)
			//add
		  this.ref.doc(goal_id).collection('tasks').doc(task_id).set({
				id:task_id,
				task:task_name,
				checked:isChecked
			});
		}
		
		console.log('saved')
		this.props.navigation.goBack()
	}
	findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }
    return null;
	};
	
	getPrevId(arr){
		_arr=[];
		
		for(var i=0;i<arr.length;i++){
			_arr.push(arr[i].id);
		}
		console.log(_arr)
		return Math.max(..._arr)
	}
	
	onAddNewTaskPress= () => {
		const _tasks = [...this.state.tasks]
		prev_id=this.getPrevId(_tasks)
		//check if prev line is filled
		prev_index=this.findObjectByKey(_tasks,'id',prev_id)
		console.log(prev_index)
		if (prev_index == null){
			//if first task
			_tasks.push({id:1,task:'',checked:false})
			this.setState({tasks:_tasks})
		}
		else if (_tasks[prev_index].task!==''){
			//increment id
			_tasks.push({id:prev_id+1,task:'',checked:false})
			this.setState({tasks:_tasks})
		}
		
	};
	addGoal(text){
		new_goal=Object.assign({},this.state.goal)
		new_goal['name']=text
		suggestions=this.state.suggestions
		_res=[]
		isVisible=true
		//filter suggestions
		if (text==""){
			_res=[...this.state.suggestions]
		}
		else{
			for (i=0;i<suggestions.length;i++){
				if(suggestions[i].toLowerCase().indexOf(text.toLowerCase())!==-1){
					_res.push(suggestions[i])
				}
			}
			
		}
		
		this.setState({goal:new_goal,query_result:_res,isVisible:_res.length !==0?isVisible:!isVisible})
	};
	addTask(text,key){
		const _tasks =[...this.state.tasks]
		idx=this.findObjectByKey(_tasks,'id',key)
		_tasks[idx].task=text
		
		this.setState({tasks:_tasks});
	};
	
	onItemDelete(id){
		const _tasks = [...this.state.tasks]
		index=this.findObjectByKey(_tasks,'id',id)
		console.log(index)
		_tasks.splice(index,1)
		console.log(_tasks)
		this.setState({tasks:_tasks});

	};

	setSuggestedValue(text){
		_goal=this.state.goal
		_goal.name=text
		//remove suggestions
		this.setState({goal:_goal,isVisible:false})
	}
	showSuggestions(show){
		_isVisible=show
		this.setState({isVisible:_isVisible})
	}
	
  render() {
	const tasks=this.state.tasks
	const goal=this.state.goal
	const suggestions=this.state.suggestions
	//if suggestions visible
	const isVisible=this.state.isVisible
	const query_result=this.state.query_result
    return (
			<ScrollView ref='main_scroll' style={styles.root} keyboardShouldPersistTaps='handled'
			ref={ref => this.scrollView = ref}
    	onContentSizeChange={(contentWidth, contentHeight)=>{        
        this.scrollView.scrollToEnd({animated: true});
    	}}>
			<View style={styles.goal}>
				<RkText rkType='primary'>Your goal?</RkText>
				<RkTextInput placeholder='Add your goal here' onFocus={()=>this.showSuggestions(true)} onBlur={()=>this.showSuggestions(false)} multiline = {true} 
				onChangeText={(text)=>this.addGoal(text)} value={goal.name}/>
			
			</View>
			<View style={{paddingHorizontal:10,}}>
					{isVisible==true &&
					<ScrollView style={styles.suggestions} keyboardShouldPersistTaps='handled'>
						{query_result.map((item)=>(
						<TouchableOpacity style={styles.bordered} onPress={()=>this.setSuggestedValue(item)}>
							<RkText>{item}</RkText>
						</TouchableOpacity>
						))}</ScrollView>
			}
			</View>
			<View style={styles.tasks}>
				<RkText rkType='primary'>Add your task(s)?</RkText>
			
				{tasks.map((item) => (
					<View style={{flexDirection:'row'}}>
					<TouchableOpacity style={{justifyContent: 'center',}} onPress={()=>this.onItemDelete(item.id)} >
					<Icon name={'minuscircle'} size={25}  style={{color:'red'}}/>
					</TouchableOpacity>
					
					<RkTextInput style={{flex:1}}
					multiline = {true} placeholder='Add new task' onChangeText={(text) => this.addTask(text,item.id)} value={item.task}/>
				</View>
				))}
			</View>
			<View style={{alignSelf: 'center', paddingBottom:20}}> 
				<TouchableOpacity onPress={this.onAddNewTaskPress}><Icon name={'pluscircleo'} size={30}/></TouchableOpacity>
			</View>
			
			
		</ScrollView>
		
	
    )
  }
};

export default AddTask;

const styles = RkStyleSheet.create(theme => ({
	
  
  root: {
    backgroundColor: theme.colors.screen.base,
	
  },
   goal: {
		paddingHorizontal:10,
		
  },
  tasks: {
    paddingHorizontal:10,
	},
	suggestions:{
		width:'100%',
		paddingHorizontal:15,
		backgroundColor:'white',
		position:'absolute',
		zIndex: 1,
		maxHeight:'50%',
		
		alignSelf:'center',
		borderWidth:1
	},
  bordered: {
		padding:5,
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base,
	},
  submitButton:{
	  
	  borderWidth:1,
       borderColor:'rgba(0,0,0,0.2)',
       alignItems:'center',
       justifyContent:'center',
       width:70,
                                       
       bottom: 10,                                                    
       right: 10,
       height:70,
       backgroundColor:'#fff',
       borderRadius:100,
  },
}));