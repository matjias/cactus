import React, { Component } from 'react';
import { View, Text, Button, ScrollView, ProgressBarAndroid, Image, AppRegistry } from 'react-native';
//import { CactusStats } from '../components/cacStats.js';

import { data } from '../data/';
import {
  RkText,
  RkButton, RkStyleSheet,RkPicker,
  RkTheme,
} from 'react-native-ui-kitten';

import Ionicons from 'react-native-vector-icons/AntDesign';

/*npm install react-native-progress --save*/
import * as Progress from 'react-native-progress';

/*npm install --save react-native-input-prompt*/
import Prompt from 'react-native-input-prompt';

import firebase from 'react-native-firebase';

import { withNavigationFocus, createStackNavigator,createBottomTabNavigator } from 'react-navigation';

RkTheme.setType('RkText','cactusName',{
 fontSize: 25,
 fontWeight: 'bold',
 fontFamily: 'Times New Roman', /* No working */
 color: '#555',
});

/* Variables */
var completedGoals = 0;

var initialName = ''


/* Objects for the Cactus Screen */
class CactusName extends Component {

	constructor(props) {
	  super(props);
	  this.ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
	  this.state = {
	  	message: '',
	  	promptVisible: false,
	  	name: initialName
	  };	  
	  this.ref.get().then( doc => { if(doc.exists){
	  		this.setState({name: doc.data().cactusName})
	  	}
	  }).catch();
	}

	onSubmit(text){
		this.ref.update({cactusName: text
	  					}).catch((error)=>console.log(error))
		this.setState({
			text: "Name change to: " + text,
			name: text,
			promptVisible: !this.state.promptVisible
		})
	}

	render() {
		return (
			<View style = {{flexDirection: 'row'}}>
				<View style = {{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
					<RkText rkType='cactusName'>
						{this.state.name}
					</RkText>
				</View>
				<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
					<Ionicons name={'edit'} size={20} onPress={() => this.setState({ promptVisible: true })}/>
				</View>
				<Prompt
				    visible={this.state.promptVisible}
				    title="What's the name of this cute cactus?"
				    placeholder = "Type Name"
				    onCancel={() =>
				        this.setState({
				            text: "User Cancelled!",
				            promptVisible: !this.state.promptVisible
				        })
				    }
				    onSubmit={text => this.onSubmit(text)}
				/>
			</View>
		)
	}
}

class Cactus extends Component {

	constructor(props) {
	  super(props);
	  this.ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
	  this.state = {
	  	progress: completedGoals,
	  };
	  this.ref.get().then( doc => { if(doc.exists){
	  		this.setState({progress: doc.data().progress})
	  	}
	  }).catch();
	}

	componentWillReceiveProps(nextProps){
		this.setState({progess: nextProps.value});
	}

	render() {
		if ( completedGoals < 10 ){
			return (
				<View>
					<Image 
						source = {require('../data/img/cactus/youngcactus.png')} 
						style = {styles.image}
					/>
				</View>
			)

		} else if ( completedGoals < 25 ){
			return (
				<View>
					<Image 
						source = {require('../data/img/cactus/teencactus.png')} 
						style = {styles.image}
					/>
				</View>
			)
		} else {
			return (
				<View>
					<Image 
						source = {require('../data/img/cactus/adultcactus.png')} 
						style = {styles.image}
					/>
				</View>
			)
		}		
	}
}

/* Oblador Progress Bar*/ 
class ProgressBar extends Component {

	constructor(props) {
	  super(props);
	  this.ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
	  this.state = {
	  	progress: completedGoals,
	  	flag: false,
	  };

	  this.ref.get().then( doc => { if(doc.exists){
	  		this.setState({progress: doc.data().progress})
	  	}
	  }).catch();
	}

	componentWillReceiveProps(nextProps){
		this.setState({progess: nextProps.value});
	}

	render() {
		if ( completedGoals < 10 ){
			return (
				<View style = {styles.bar}>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>{completedGoals}/10</Text></View>
					<View style={{ flex: 0.6, transform: [{ rotate: '-90deg' }], justifyContent: 'center', alignItems: 'center' }}>					
						<Progress.Bar 
							progress = {(completedGoals)/(10)} 
							width = {200}
							height = {15}
							color = '#fece00'
						 />					 
					</View>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>0</Text></View>
				</View>
			)
		} else if ( completedGoals < 25 ){
			return (
				<View style = {styles.bar}>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>{completedGoals}/25</Text></View>
					<View style={{ flex: 0.6, transform: [{ rotate: '-90deg' }], justifyContent: 'center', alignItems: 'center' }}>					
						<Progress.Bar 
							progress = {(completedGoals)/(25)} 
							width = {200}
							height = {15}
							color = '#ddc293'
						 />					 
					</View>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>10</Text></View>
				</View>
			)
		} else {
			return (
				<View style = {styles.bar}>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>{completedGoals}/100</Text></View>
					<View style={{ flex: 0.6, transform: [{ rotate: '-90deg' }], justifyContent: 'center', alignItems: 'center' }}>					
						<Progress.Bar 
							progress = {(completedGoals)/(100)} 
							width = {200}
							height = {15}
							color = '#019ade'
						 />					 
					</View>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>25</Text></View>
				</View>
			)
		}		
	}
}

class CactusStats extends Component {

	constructor(props) {
    super(props);
    this.state={
      navigation:this.props.navigation,
      aboutMe:null,
      name:null,//this.user.name
      goals:[],
      taskCounter:0,
      tasksCompleted:0,
      comp:[]
    }

    this.ref=firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
   
    this.state.taskCounter++;

    //retrieve profile info
    this.ref.get().then((doc)=>{if (doc.exists) 
      {var user=doc.data()
      //retrieve goals
      this.setState({name:user.name,aboutMe:user.aboutMe})
      }}).catch()

    this.ref.collection('goals').get().then((snap1)=>{
              var goals = []
              snap1.forEach((goal) => {
              _goal={id:goal.data().id, name:goal.data().name}
              goals.push(_goal)      
              console.log(goals)
              //retrieve tasks
                })
              return goals;
          
              }).then((goals)=>{
                var new_goals = [];
                goals.forEach((goal) => {
                this.ref.collection('goals').doc(goal.id).collection('tasks').get()
                //retrieve tasks
                .then((snap2)=>{
                  var tasks=[]
                  snap2.forEach((task)=>{
                    _task={id:task.data().id,task:task.data().task,checked:task.data().checked}
                    if(_task.checked != "false"){
                      this.state.tasksCompleted++;
                    } 
                    tasks.push(_task)
                  })
                  this.state.taskCounter = tasks.length;
                  return tasks
                }
                ).then((tasks)=>{goal['tasks']=tasks; new_goals.push(goal);this.setState({goals:new_goals});console.log(new_goals)})})
              }
              
               )
               .catch((error)=>{console.log(error)})  
                
  }

	render() {
	    const goals=this.state.goals
	    
	    return (

	        <View style = {styles.section, styles.stats}>
	          <View style={styles.statRow}>
	            <View style={{flex: 1}}>
	              <Text>Languages:</Text>
	            </View>
	            <View style={{flex: 1}}>
	              <Text style={{textAlign: 'right'}}>
	                {goals.length>0 && goals.map((goal)=>(goal.name + ", "))}
	              </Text>
	            </View>
	          </View>
	          <View style={styles.statRow}>
	            
	            <View style={{flex: 1}}>
	              <Text>Total Goals:</Text>
	            </View>
	            <View style={{flex: 1}}>
	              <Text style={{textAlign: 'right'}}>{goals.length}</Text>
	            </View>
	            
	          </View>

	          <View style={styles.statRow}>
            
	            <View style={{flex: 1}}>
	              <Text>Completed Tasks:</Text>
	            </View>
	            <View style={{flex: 1}}>
	              <Text style={{textAlign: 'right'}}>{this.state.tasksCompleted + "/" + this.state.taskCounter}</Text>
	            </View>
	            
	          </View>
	          <View style={styles.statRow}>
	            
	            <View style={{flex: 1}}>
	              <Text>Participation:</Text>
	            </View>
	            <View style={{flex: 1}}>
	              <Text style={{textAlign: 'right'}}>{this.state.comp}</Text>
	            </View>
	          </View>
	         </View>
	    )
  	}
}
/* End of Objects for the Cactus Screen */


/* Main Screen */
export class MyCactus extends Component {

	constructor(props) {
		super(props);
		this.ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
		this.state = {
			isFocused: false,
		};
	}

	onFocus(){
		this.setState({isFocused: true})
		ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
		ref.get().then( doc => { if(doc.exists){
	  		completedGoals = doc.data().progress
	  	}
	  }).catch();
	}

	noFocus(){
		this.setState({isFocused: false})	
		ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
		ref.get().then( doc => { if(doc.exists){
	  		completedGoals = doc.data().progress
	  	}
	  }).catch();
	}


	render() {
		console.log(completedGoals, 'from parent')
		const didBlurSubscription = this.props.navigation.addListener(
		  'didBlur',
		  payload => {
		    this.noFocus()
		  }
		);

		const didFocusSubscription = this.props.navigation.addListener(
		  'didFocus',
		  payload => {
		    this.onFocus();
		  }
		);

	    return (
	      <View style={{flex: 1, flexDirection: 'column'}}>

	      {/* Here goes the name of the cactus */}
	      	<View style={styles.section, styles.cactusName}>
	      		<CactusName />
	      	</View>

	      {/* This is the body: Cactus and progress bas */}
	      	<View style = {styles.section, {height: 350, flexDirection: 'row'}}>

	      		{/* The cute Cactus goes here */}
	      		<View style = {styles.cuteCactus}>
	      			<Cactus value = {completedGoals}/>
	      		</View>

	      		{/* The awesome progress bar goes here */}
	      		<View style = {styles.progressBar}>
	      			<ProgressBar value = {completedGoals}/>
	      		</View>
	      	</View>

	      {/* Here goes the statistics section*/}
	        	<CactusStats />
	      	
	      </View>
	    )
	  }
};


export default MyCactus;
/* End of Main Screen */


/* Style Sheet for the page */
const styles = RkStyleSheet.create(theme => ({
	
  statRow: {
  	marginLeft: 10,
  	marginRight: 10,
  	flex: 1, 
  	flexDirection: 'row',
  },
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  header: {    
	paddingHorizontal: 10,	
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 15,
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
    flexDirection: 'row',
    flex: 0,
    width: 1,
    height: 42,
  },
  buttons: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  button: {
    flex: 1,
    alignSelf: 'center',	
  },
  cactusName: {
  	height: 50, 
  	justifyContent: 'center', 
  	alignItems: 'center',  
  	flexDirection: 'row',	
  },
  progressBar: {
  	flex: 0.2, 
  	justifyContent: 'space-around', 
  	alignItems: 'center',
  	flexDirection: 'column',  		
  },
  bar: {
  	justifyContent: 'center', 
  	alignItems: 'center',
  	flexDirection: 'column',
  },
  cuteCactus: {
  	flex: 0.8, 
  	justifyContent: 'center', 
  	alignItems: 'center', 
  },
  stats: {
  	flex: 1, 
  	flexDirection: 'column',
  	alignSelf:'stretch',
  	justifyContent: 'center', 
  	alignItems: 'center', 
  },
  image: {
  	flex: 1,
  	resizeMode: 'contain',
  },

}));

