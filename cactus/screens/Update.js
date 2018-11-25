import React, { Component } from 'react';
import { View, Text, FlatList,ScrollView ,Image} from 'react-native';
import {RkCard,RkStyleSheet} from 'react-native-ui-kitten';
import { PlanView } from '../components/planView';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

export class Update extends Component {

  static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
    return {
      title: '', //Cactus?? kinda misleading 
    };
	};
  


    onFocus(){
        db = firebase.firestore().collection('activity_log');
        db.add(
          {
            user_id:firebase.auth().currentUser.uid,
            action:'Update',
            timestamp:Date.now(),
            updateId:this.updateId
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
   // this.props.navigation.setParams({ handleRefresh:  this.retrieveData});
   this.updateId=this.props.navigation.getParam('updateId',null)
   this.currentUserId=firebase.auth().currentUser.uid
   firebase.firestore().collection('users').doc(this.currentUserId).
    get().then((doc)=>{
      this.currentUserName= doc.data().name
      this.currentUserURL= doc.data().profileURL

    }).then(()=>{
      
      this.retrieveData(10)}).catch((error)=>{console.log(error)})
    
    }
  constructor(props) {
    super(props);
    this.ref=firebase.firestore().collection('updates')
    //this.retrieveData=this.retrieveData.bind(this);
    this.currentUserId=''
    this.currentUserName=''
    this.currentUserURL=''
    this.updateId=''
    this.state={
      isLoading:false,
      datas:[],
    }
    //AIM: 
    //get goal update data from firebase ...
    //put the data into   varibale datats    so datas = [{...},{...},{...}]
    //give the each element inside the datas to PlanView class in this way:
    
  }

 
 
  retrieveData(batchLimit){
    this.setState({isLoading:true})
    db=this.ref.doc(this.updateId)
    
    db.get().then((doc)=>{
       // Get the last visible document
      var updates=[]
      update={id:doc.id, user_id:doc.data().uid,username:doc.data().name, status:doc.data().action,profileURL:doc.data().profileURL || 3,
        goal_name:doc.data().goal_name, comments_number:doc.data().comments_number,likes:doc.data().likes,
        hasLiked:doc.data().likedUsers.includes(this.currentUserId),
        tasks:doc.data().tasks}
      updates.push(update)      
      //retrieve tasks
        
      return updates;
  
      }).then((updates)=>{
        
        //this.setState({datas:updates})
        datas=[...this.state.datas]
        
      //if refresh rerender with new data
      this.setState({isLoading:false, datas:updates})
        
       
      }).catch((error)=>{console.log(error)})  
  }
  
  update_comments(id){
    index=this.findObjectByKey(this.state.datas,'id',id)
    datas=[...this.state.datas]
    datas[index].comments_number+=1

    this.setState({datas:datas})
  }
  update_likes(id){
    index=this.findObjectByKey(this.state.datas,'id',id)
    datas=[...this.state.datas]
    datas[index].likes+=1
    datas[index].hasLiked=true

    this.setState({datas:datas})
  }
  render() {
    //const datas=this.state.datas
    //if (this.datas==null) return null;
    return (
      <FlatList
      style={styles.root}
      keyExtractor={item=>item.id}
      data={this.state.datas}
      renderItem={({item}) =><PlanView data = {item} currentUserName={this.currentUserName} 
                              currentUserId={this.currentUserId}
                              currentUserURL={this.currentUserURL}
                              navigation = {this.props.navigation}
                              update_likes={()=>{this.update_likes(item.id)}} 
                              update_comments={()=>{this.update_comments(item.id)}} />}
      refreshing={this.state.isLoading}
      onRefresh={()=>this.retrieveData(10)}
    />
    )
  }
};



export default Update;


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