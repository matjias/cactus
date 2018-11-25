import React from 'react';
import {
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
//import { GradientButton } from '../components/';
import { scaleVertical } from '../utils/scale';
import validation from '../components/validation'
import validate from '../components/validation_wrapper'
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase';
import {ButtonGroup} from 'react-native-elements'
import { Avatar } from '../components/avatar';

export class SignUp extends React.Component {
  static navigationOptions = {
    title: 'Feedback'.toUpperCase(),
  };
  
  componentDidMount(){
  //init profileUrl list
 
  
  }

  constructor(props){
    super(props)
    uid=firebase.auth().currentUser.uid
    this.state = {
      like:'',
      use:'',
      dontLike: '',
      dontUse:'',
      suggest: '',
      problems:'',
      other:'',
    }
  }


  

  onSaveButtonPressed = () => {
    //add to db
    
    db=firebase.firestore().collection('feedback').doc(this.uid)
    db.set({
        like:this.state.like,
        use:this.state.use,
        dontLike: this.state.dontLike,
        dontUse:this.state.dontUse,
        suggest: this.state.suggest,
        problems:this.state.problems,
        other:this.state.other,
    })
  this.props.navigation.goBack()
  };

 
  render(){
    const intro ="Thank you for using the Cactus app. We would like to know more about your experience! Please answer the following questions."
    const like="What do you like about the app?"
    const use="Why would you use it?"
    const dontLike="What you do not like about the app?"
    const dontUse="Why you would not use it?"
    const problems="Did you have any problems with the Cactus app?"
    const suggest="Any suggestions for improvement?"
    const other= "Anything else you wish to tell us?"
    return (
    <ScrollView keyboardShouldPersistTaps='handled' style={styles.root}>
      <View style={styles.content}>
      

         <RkText style={{marginBottom:15}} rkType={"primary2"}>{intro}</RkText>
         <RkText rkType={"primary2"}>{like}</RkText>
          <RkTextInput rkType='bordered'
          label={<RkText>{this.state.like.length}/200</RkText>}
          labelStyle={{alignSelf:'flex-start',flexWrap:'wrap', fontSize:11,marginLeft:2,marginTop:2}} 
          inputStyle={{fontSize:16,marginLeft:3}} style={{ marginBottom:15}} 
          multiline={true} numberOfLines={3} maxLength={200}
          onChangeText={(text)=>this.setState({like:text})}/>
           <RkText rkType={"primary2"}>{use}</RkText>
          <RkTextInput rkType='bordered'
          label={<RkText>{this.state.use.length}/200</RkText>}
          labelStyle={{alignSelf:'flex-start',flexWrap:'wrap', fontSize:11,marginLeft:2,marginTop:2}} 
          inputStyle={{fontSize:16,marginLeft:3}} style={{ marginBottom:15}} 
          multiline={true} numberOfLines={3} maxLength={200}
          onChangeText={(text)=>this.setState({use:text})}/>
           <RkText rkType={"primary2"}>{dontLike}</RkText>
          <RkTextInput rkType='bordered'
          label={<RkText>{this.state.dontLike.length}/200</RkText>}
          labelStyle={{alignSelf:'flex-start',flexWrap:'wrap', fontSize:11,marginLeft:2,marginTop:2}} 
          inputStyle={{fontSize:16,marginLeft:3}} style={{marginBottom:15}} 
          multiline={true} numberOfLines={3} maxLength={200}
          onChangeText={(text)=>this.setState({dontLike:text})}/>

           <RkText rkType={"primary2"}>{dontUse}</RkText>
          <RkTextInput rkType='bordered'
          label={<RkText>{this.state.dontUse.length}/200</RkText>}
          labelStyle={{alignSelf:'flex-start',flexWrap:'wrap', fontSize:11,marginLeft:2,marginTop:2}} 
          inputStyle={{fontSize:16,marginLeft:3}} style={{ marginBottom:15}} 
          multiline={true} numberOfLines={3} maxLength={200}
          onChangeText={(text)=>this.setState({dontUse:text})}/>

           <RkText rkType={"primary2"}>{problems}</RkText>
          <RkTextInput rkType='bordered'
          label={<RkText>{this.state.problems.length}/200</RkText>}
          labelStyle={{alignSelf:'flex-start',flexWrap:'wrap', fontSize:11,marginLeft:2,marginTop:2}} 
          inputStyle={{fontSize:16,marginLeft:3}} style={{ marginBottom:15}} 
           multiline={true} numberOfLines={3} maxLength={200}
          onChangeText={(text)=>this.setState({problems:text})}/>

           <RkText rkType={"primary2"}>{suggest}</RkText>
          <RkTextInput rkType='bordered'
          label={<RkText>{this.state.suggest.length}/200</RkText>}
          labelStyle={{alignSelf:'flex-start',flexWrap:'wrap', fontSize:11,marginLeft:2,marginTop:2}} 
          inputStyle={{fontSize:16,marginLeft:3}} style={{ marginBottom:15}} 
           multiline={true} numberOfLines={3} maxLength={200}
          onChangeText={(text)=>this.setState({suggest:text})}/>
          
          <RkText rkType={"primary2"}>{other}</RkText>
          <RkTextInput rkType='bordered'
          label={<RkText>{this.state.other.length}/200</RkText>}
          labelStyle={{alignSelf:'flex-start',flexWrap:'wrap', fontSize:11,marginLeft:2,marginTop:2}} 
          inputStyle={{fontSize:16,marginLeft:3}} style={{ marginBottom:15}} 
           multiline={true} numberOfLines={3} maxLength={200}
          onChangeText={(text)=>this.setState({other:text})}/>

          <RkButton style={styles.save} rkType='success' onPress={()=>this.onSaveButtonPressed()}>SUBMIT</RkButton>
        </View>
       
   
      </ScrollView>
    )
  }
}

export default SignUp;

const styles = RkStyleSheet.create(theme => ({
  a_container: {
    backgroundColor: theme.colors.screen.base,

    flex: 1,
    justifyContent: 'center'
  },
  a_horizontal: {
    backgroundColor: theme.colors.screen.base,

    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  root: {
    backgroundColor: theme.colors.screen.base,
    flex: 1,
  },
  imageStyle:{
    margin:2,
    width:80,height:80,borderRadius:40
  },
  selected:{
    margin:2,
    width:80,height:80,borderRadius:40,
    borderWidth:3,
    borderColor: theme.colors.border.accent
  },
  header: {
    
	paddingHorizontal: 10,
	
  },
  input:{
    fontSize:16,
    padding:5,
    placeholderTextColor:'696969'
  },
  row:{
    paddingHorizontal:40,
    flexDirection: 'row',
    marginTop:7,
  },
  image: {
    marginBottom: 10,
    height: scaleVertical(77),
    resizeMode: 'contain',
  },
  error:{
    marginLeft:40,
    color:'red',fontSize:11,
  },

  content: {
      padding:15    
  },
  save: {
    alignSelf:'center'
  },
  
  footer: {
    margin:20,
    alignSelf:'center'
  },
  textRow: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
}));
