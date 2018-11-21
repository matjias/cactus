import React from 'react';
import {
  View,
  ScrollView,
  Keyboard,
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

export class EditProfile extends React.Component {
  static navigationOptions = {
    title: 'Edit profile'.toUpperCase(),
  };
  
  

  constructor(props){
    super(props)
    this.curUser=firebase.auth().currentUser
    this.state = {
      name:'',
      nameError:null,
      password: '',
      passwordError: null,
      aboutMe:'',
    }
  }

  _validate(fieldName,value){
    err= validate(fieldName,value)
    return err;
  }

  updateUser(name,aboutMe){
    
    timestamp=Date.now()
    firebase.firestore().collection('users').doc(this.curUser.uid).update({
        name: name,
        aboutMe:aboutMe,        
    }).then(()=>{
      this.props.navigation.state.params.refresh();
      console.log('saved')
      this.props.navigation.goBack()})
    .catch((error) => {
      this.setState({signUp:false});
      const { code, message } = error;
      console.log(code,message)
      
    });
}
  onEditButtonPressed = () => {
    //add to db
    if  (this.state.passwordError!=null || this.state.nameError!=null){
      return null;
    }
    else if (this.state.name==''){
      return this.setState({nameError:this._validate('name',this.state.email)})
    }
  return this.updateUser(this.state.name,this.state.aboutMe)
  };

  render(){
    const nameError=this.state.nameError
    const passwordError=this.state.passwordError
    const about=this.state.aboutMe

    return (
    <ScrollView keyboardShouldPersistTaps='handled' style={styles.root}>
      <View style={styles.content}>
        <View>
          <View style={styles.row}>
          <RkTextInput  
          label={<Icon name={'asterisk'} style={{color:'red'}}/>}
          labelStyle={{fontSize:6,marginLeft:5}}
          inputStyle={styles.input} style={{flex:1,marginVertical:0}}rkType='bordered' placeholder='Name' onChangeText={(txt)=>this.setState({name:txt})}
          onBlur={()=>this.setState({nameError:this._validate('name',this.state.name)})}/>
          </View>
          {nameError !== null ? <RkText style={styles.error}>{nameError}</RkText> : null}
        

         {/*  <View style={styles.row}>
          
          
          <RkTextInput rkType='bordered'  
          label={<Icon name={'asterisk'} style={{color:'red'}}/>}
          labelStyle={{fontSize:6,marginLeft:5}}
          inputStyle={styles.input} style={{flex:1}} placeholder='Confirm Password' secureTextEntry onChangeText={(txt)=>(this.setState({confirm_password:txt}))}
          onBlur={()=>this.setState({confirmError:this._validate('confirm_password',{'confirm':this.state.confirm_password,'password':this.state.password})})} />
          </View>
          {confirmError !== null ? <RkText style={styles.error}>{confirmError}</RkText> : null} */}

          
          <RkTextInput rkType='bordered'
          label={<RkText>{about.length}/70</RkText>}
          labelStyle={{alignSelf:'flex-start',flexWrap:'wrap', fontSize:11,marginLeft:2,marginTop:2}} 
          inputStyle={{fontSize:16,marginLeft:3}} style={{marginHorizontal:40, marginBottom:20}} 
          placeholder='About me' multiline={true} numberOfLines={3} maxLength={70}
          onChangeText={(text)=>this.setState({aboutMe:text})}/>

          <RkButton style={styles.save} rkType='success' onPress={()=>this.onEditButtonPressed()}>SAVE</RkButton>
        </View>
      </View>
      </ScrollView>
    )
  }
}

export default EditProfile;

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
    flex: 1,
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
    paddingVertical:20,
    justifyContent:'center'
  },
  save: {
    alignSelf:'center'
  },
  
  footer: {
    margin:20,
    justifyContent:'flex-end'
  },
  textRow: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
}));
