import React, { Component } from 'react';
import { ScrollView,View, Keyboard, FlatList,Alert,Button, TouchableOpacity } from 'react-native';
import {
  RkText,
  RkButton,
  RkComponent,
  RkTextInput,RkStyleSheet,
} from 'react-native-ui-kitten';
import firebase from 'react-native-firebase';

import Icon from 'react-native-vector-icons/AntDesign';
import { FormValidationMessage } from 'react-native-elements';

export class AddTask extends Component {
	static data = {
		goal:{id:1, name:'' ,delete:false},
		  tasks:[{id:1, task:'',checked:false, delete:false}],
		suggestions:[
						{key: 'Learning Korean'},
						{key: 'Learning English'},
						{key: 'Learning Spanish'},
						{key: 'Learning Python'},
						{key: 'Learning Java'},
					],
		
		
	  };
	
	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
    return {
        //title: '[ Admin ]',
        //headerTitleStyle :{color:'#fff'},
        //headerStyle: {backgroundColor:'#3c3c3c'},
		//headerRight: <Icon style={{ marginLeft:15,color:'green' }} name={'check'} size={25} onPress={() => params.handleSave()} />
		headerRight: <TouchableOpacity style={{ marginRight:20}} onPress={() => params.handleSave()}>
					<RkText style={{color:'green',}}>SAVE</RkText>
					</TouchableOpacity>
    };
	};


	onFocus(){
        db = firebase.firestore().collection('activity_log');
        db.add(
          {
            user_id:firebase.auth().currentUser.uid,
            action:'add goal',
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
		this.props.navigation.setParams({ handleSave:  this.saveChanges });
		goal=this.props.navigation.getParam('goal',AddTask.data.goal)
		tasks=this.props.navigation.getParam('tasks',AddTask.data.tasks)
		action=this.props.navigation.getParam('action',this.state.action)
		task_ids=this.props.navigation.getParam('task_ids',this.state.task_ids)
		username=this.props.navigation.getParam('uName','undefined')
		this.profileURL=this.props.navigation.getParam('profileURL','undefined')

		console.log('called mount')
		this.setState({goal:goal,tasks:tasks,action:action,task_ids:task_ids,username:username})
		}
		
	constructor(props) {
		super(props);
		this.userId=firebase.auth().currentUser.uid,
		this.profileURL=''
		this.ref = firebase.firestore().collection('users').doc(this.userId).collection('goals');
		this.log_ref = firebase.firestore().collection('updates')
		
		this.saveChanges=this.saveChanges.bind(this);
		this.validateInput=this.validateInput.bind(this);
    	this.state = {
		navigation:null,
	  	goal: AddTask.data.goal,
	  	tasks: AddTask.data.tasks,
		enableScrollViewScroll: true,
		suggestions: AddTask.data.suggestions,
		query_result:AddTask.data.suggestions,
		action:'Add',
		task_ids:[],
		username:null,
		//if suggestions visible
		isVisible:false,


	  
		}
	};

	
	validateInput(){
		//validate goal
		if (this.state.goal.name==''){
			Alert.alert(
				'Goal',
				'Please specify your goal',
				[
				  {text: 'OK'},
				],
				{ cancelable: false })
			  
		return false;	  	
		}
		return true;
	}

	updateFeedWithTasks(new_tasks,goal, timestamp){
		if (new_tasks.length>0){
			this.log_ref.add({
				uid:this.userId,
				name:this.state.username,
				profileURL:this.profileURL,
				action:2, //1=set new goal, 2=set new task(s),3 completed task 
				goal_name:goal,
				timestamp:timestamp,
				comments_number:0,
				likes:0,
				likedUsers:[],
				tasks:new_tasks
				})
				.catch((error)=>{console.log(error)})
		}
	}

	saveChanges() {
		res=this.validateInput()
		if (res==false){
			return null;
		}

		goal_id=this.state.goal.id;
		var goal=this.state.goal.name.trim()
		var new_tasks=[]
		console.log(goal_id,goal)

		var timestamp=Date.now()
		tasks=this.state.tasks
		console.log(timestamp,tasks.length)
		//return null
		//add goal to collection goals
		if (this.state.action=='update'){
			//update
		this.ref.doc(goal_id).update({
			//id:goal_id,
			name:goal,
			delete:false,
			timestamp_updated:timestamp
			//add update
		}).catch()

		for (i=0; i<tasks.length;i++){
			
			t=tasks[i]
			task_id=t.id
			task_name=t.task.trim()
			_delete=t.delete
			if (task_name==''){
				continue;
			}
			isChecked=t.checked
			//add 
			if (this.state.task_ids.includes(task_id)){
				this.ref.doc(goal_id).collection('tasks').doc(task_id).update({
					task:task_name,
					checked:isChecked,
					delete:_delete
				}).catch()
			}
		  	else {
				this.ref.doc(goal_id).collection('tasks').add({
					task:task_name,
					checked:isChecked,
					delete:_delete,
					timestamp:Date.now(),
					timestamp_completed:0
				}).catch()
				new_tasks.push(t)
			  }
			}

			if(new_tasks.length>0) 
					//if new tasks added update feed log

				{
					this.updateFeedWithTasks(new_tasks,goal,Date.now())
				}

		}
		else{
			//add new goal
			this.ref.add({
				
				name:goal,
				delete:false,
				timestamp_created:timestamp,
				timestamp_updated:timestamp
			}).then((docRef)=>{
				for (i=0; i<tasks.length;i++){
			
					t=tasks[i]
					task_name=t.task.trim()
					_delete=t.delete
					if (task_name==''){
						continue;
					}
					isChecked=t.checked
					//add 
				  this.ref.doc(docRef.id).collection('tasks').add({
						task:task_name,
						checked:isChecked,
						delete:_delete,
						timestamp:Date.now(),
						timestamp_completed:0

					}).catch((error)=>{console.log(error)})
					new_tasks.push(t)
				}
			}).then(()=>{
				//update feed with new tasks
				if(new_tasks.length>0) 
				{
					//if new tasks added update feed log

					this.updateFeedWithTasks(new_tasks,goal,Date.now())
				}
			}).catch()
			//add upldate goal only if no new tasks added
			if (new_tasks.length==0){
			this.log_ref.add({
				uid:this.userId,
				name:this.state.username,
				profileURL:this.profileURL,

				action:1, //1=set new goal, 2=set new task,3 completed task 
				goal_name:goal,
				timestamp:timestamp,
				likes:0,
				comments_number:0,
				likedUsers:[],
				tasks:[]
			}).catch()
		}
			

		}
		

		this.props.navigation.state.params.refresh();
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
			if (isNaN(arr[i].id) ){
				continue
			}
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
			_tasks.push({id:1,task:'',checked:false, delete:false})
			this.setState({tasks:_tasks})
		}
		else if (_tasks[prev_index].task!==''){
			//increment id
			console.log(prev_id)
			_tasks.push({id:prev_id+1,task:'',checked:false,delete:false})
			this.setState({tasks:_tasks})
			
		}
		
	};
	addGoal(text){
		new_goal=Object.assign({},this.state.goal)
		new_goal['name']=text
		new_goal['delete']=false
		suggestions=this.state.suggestions
		_res=[]
		isVisible=true
		//filter suggestions
		if (text==""){
			_res=[...this.state.suggestions]
		}
		else{
			for (i=0;i<suggestions.length;i++){
				if(suggestions[i].key.toLowerCase().indexOf(text.toLowerCase().trim())!==-1){
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
		console.log(index,this.state.action)
	
		if (this.state.action=='update' && this.state.task_ids.length!=0 && this.state.task_ids.includes(_tasks[index].id )){
		
			_tasks[index].delete=true
			
			
		}
		else{
		_tasks.splice(index,1)
		console.log('splice')
		}
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
		this.setState({isVisible:this.state.query_result.length!==0?show:false})
	}
	
  render() {
	const tasks=this.state.tasks
	const goal=this.state.goal
	const suggestions=this.state.suggestions
	//if suggestions visible
	const isVisible=this.state.isVisible
	const query_result=this.state.query_result
    return (
		<View  style={styles.root}  onStartShouldSetResponderCapture={() => {
			this.setState({ enableScrollViewScroll: true });
		}}> 
			<ScrollView style ={{flex:1,marginTop:10}}keyboardShouldPersistTaps='handled'
			
			ref={ref => this.scrollView = ref}
			
			scrollEnabled={this.state.enableScrollViewScroll}
			
			>
			<View style={styles.goal}>
				<RkText rkType='primary'>Your goal?</RkText>
				<RkText rkType='secondary3 hintColor'>your long-term learning goal</RkText>

				<RkTextInput placeholder='Add your goal here' onFocus={()=>this.showSuggestions(true)} 
				onBlur={()=>this.showSuggestions(false)} multiline={true} maxLength={140}
				onChangeText={(text)=>this.addGoal(text)} value={goal.name}/>
			
			</View>
			<View style={{paddingHorizontal:10,	}}
				onStartShouldSetResponderCapture={() => {
				this.setState({ enableScrollViewScroll: false });
				if (this.scrollView.contentOffset === 0
				&& this.state.enableScrollViewScroll === false) {
				this.setState({ enableScrollViewScroll: true });
				}
			  }}>
			{isVisible==true &&
				<FlatList
				keyboardShouldPersistTaps='handled'
				data={query_result}
				
				style={styles.suggestions}
				renderItem={({item}) => <TouchableOpacity style={styles.bordered} onPress={()=>this.setSuggestedValue(item.key)}>
											<RkText>{item.key}</RkText>
										</TouchableOpacity>}
				/>}
			</View>
			
			<View style={styles.tasks}>
				<RkText rkType='primary'>Add your task(s)?</RkText>
				<RkText rkType='secondary3 hintColor'>your daily task(s) to achieve the goal. You can add more tasks later in Edit page</RkText>

				
				{tasks.map((item) => (
					item.delete==false &&
					
					<View style={{flexDirection:'row'}}>
					<TouchableOpacity style={{justifyContent: 'center',}} onPress={()=>this.onItemDelete(item.id)} >
					<Icon name={'minuscircle'} size={25}  style={{color:'red'}}/>
					</TouchableOpacity>
					
					<RkTextInput style={{flex:1}}
					
					multiline = {true} placeholder='Add new task' maxLength={140}
					onChangeText={(text) => this.addTask(text,item.id)} value={item.task}
					autoFocus={tasks.length>1 ? item.task==='':false}
					/>
				
				</View>
					
				))}
			</View>
			<View style={{alignSelf: 'center', paddingBottom:20}}> 
				<TouchableOpacity onPress={()=>this.onAddNewTaskPress()}><Icon name={'pluscircleo'} size={30}/></TouchableOpacity>
			</View>
			
			
		</ScrollView>
	</View>
	
    )
  }
};

export default AddTask;

const styles = RkStyleSheet.create(theme => ({
	
  
  root: {
    backgroundColor: theme.colors.screen.base,
	height:'100%'
  },
   goal: {
		paddingHorizontal:10,
		marginBottom:15
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
		maxHeight: 109,
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