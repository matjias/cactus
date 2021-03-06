import React, { Component } from 'react';
import { View, Text, Button, ScrollView, ProgressBarAndroid, Image, AppRegistry } from 'react-native';
//import { CactusStats } from '../components/cacStats.js';

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
		if ( completedGoals < 5 ){
			return (
				<View>
					<Image 
						source = {require('../data/img/cactus/youngcactus.png')} 
						style = {styles.image}
					/>
				</View>
			)

		} else if ( completedGoals < 15 ){
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
		if ( completedGoals < 5 ){
			return (
				<View style = {styles.bar}>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>{completedGoals}/5</Text></View>
					<View style={{ flex: 0.6, transform: [{ rotate: '-90deg' }], justifyContent: 'center', alignItems: 'center' }}>					
						<Progress.Bar 
							progress = {(completedGoals)/(5)} 
							width = {200}
							height = {15}
							color = '#fece00'
						 />					 
					</View>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>0</Text></View>
				</View>
			)
		} else if ( completedGoals < 15 ){
			return (
				<View style = {styles.bar}>
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>{completedGoals}/15</Text></View>
					<View style={{ flex: 0.6, transform: [{ rotate: '-90deg' }], justifyContent: 'center', alignItems: 'center' }}>					
						<Progress.Bar 
							progress = {(completedGoals)/(15)} 
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
					<View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}><Text>{completedGoals}/50</Text></View>
					<View style={{ flex: 0.6, transform: [{ rotate: '-90deg' }], justifyContent: 'center', alignItems: 'center' }}>					
						<Progress.Bar 
							progress = {(completedGoals)/(50)} 
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
     
			goals:[],
			total_tasks:0,
     	progress:0
    }

    this.ref=firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    //retrieve profile info
    this.ref.get().then((doc)=>{if (doc.exists) 
      {var user=doc.data()
      //retrieve goals
      this.setState({progress:user.progress})
			}}).catch()
			
			db=this.ref.collection('goals').where('delete','==',false)
			db.get().then((snap1)=>{
			
				number_of_goals=snap1.docs.length
				goals=[]
				snap1.forEach((goal) => {
					_goal={id:goal.id,name:goal.data().name}
					goals.push(_goal)
				})
				return goals}).then((goals)=>{
					total_tasks=0
					res=[]
					goals.forEach((goal)=>{
					this.ref.collection('goals').doc(goal.id).collection('tasks').where('delete','==',false).get().then((snap2)=>{
					
					total_tasks+=snap2.docs.length
					res.push(goal)
	
						if (res.length==number_of_goals){
							this.setState({goals:res,total_tasks:total_tasks})
					}
				}).catch((err)=>{console.log(err)})
				})
			}).catch((err)=>{console.log(err)})
  }

	render() {
	    const goals=this.state.goals
	    
	    return (

	        <View style = {styles.section, styles.stats}>
	          <View style={styles.statRow}>
	            <View style={{flex: 1,paddingVertical:20}}>
	              <RkText rkType='rounded'>My Goals:</RkText>
	            </View>
	            <View style={{flex: 1,paddingVertical:20}}>
	              <RkText style={{textAlign: 'right'}}>
	                {goals.length>0 && goals.map((goal)=>(goal.name + ", "))}
	              </RkText>
	            </View>
	          </View>
	          <View style={styles.statRow}>
	            
	            <View style={{flex: 1,paddingVertical:20}}>
	              <RkText rkType='rounded'>Total Goals:</RkText>
	            </View>
	            <View style={{flex: 1,paddingVertical:20}}>
	              <RkText style={{textAlign: 'right'}}>{goals.length}</RkText>
	            </View>
	            
	          </View>

	          <View style={styles.statRow}>
            
	            <View style={{flex: 1,paddingVertical:20}}>
	              <RkText rkType='rounded'>Completed Tasks:</RkText>
	            </View>
	            <View style={{flex: 1,paddingVertical:20}}>
	              <RkText style={{textAlign: 'right'}}>{this.state.progress + "/" + this.state.total_tasks}</RkText>
	            </View>
	            
	          </View>
	          {/* <View style={styles.statRow}>
	            
	            <View style={{flex: 1}}>
	              <RkText rkType='rounded'>Participation:</RkText>
	            </View>
	            <View style={{flex: 1}}>
	              <RkText style={{textAlign: 'right'}}>{this.state.comp}</RkText>
	            </View>
	          </View> */}
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
		db = firebase.firestore().collection('activity_log');
		db.add(
			{
				user_id:firebase.auth().currentUser.uid,
				action:'My cactus',
				timestamp:Date.now(),
			}
		).catch()
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
	      <ScrollView style={styles.root}>

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
	      	
	      </ScrollView>
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
		flex: 1, flexDirection: 'column',
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

