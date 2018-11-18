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

export class SignUp extends React.Component {
  static navigationOptions = {
    title: 'Sign up'.toUpperCase(),
  };
  
  

  constructor(props){
    super(props)
    this.state = {
      name:'',
      nameError:null,
      email: '',
      emailError: null,
      password: '',
      passwordError: null,
      confirm_password: '',
      confirmError: null,
      aboutMe:'',
      signUp:false,
    }
  }

  _validate(fieldName,value){
    err= validate(fieldName,value)
    return err;
  }

  createUser(email,password, name,aboutMe){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((credentials) => {
      firebase.firestore().collection('users').doc(credentials.user.uid).set({
        email:email,
        name: name,
        aboutMe:aboutMe,
        
    })})
    .catch((error) => {
      this.setState({signUp:false});
      const { code, message } = error;
      console.log(code,message)
      
    });
}

  onSignUpButtonPressed = () => {
    //add to db
    if  (this.state.emailError!=null || this.state.passwordError!=null || this.state.nameError!=null){
      return null;
    }
    else if (this.state.name==''){
      return this.setState({nameError:this._validate('name',this.state.email)})
    }
    else if (this.state.email==''){
      return this.setState({emailError:this._validate('email',this.state.email)})
    }
    else if (this.state.password==''){
      return this.setState({passwordError:this._validate('password',this.state.password)});
    }
  this.setState({signUp:true})
  return this.createUser(this.state.email,this.state.password,this.state.name,this.state.aboutMe)
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Login');
  };

  render(){
    const emailError=this.state.emailError
    const nameError=this.state.nameError
    const passwordError=this.state.passwordError
    const signUp=this.state.signUp
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

          <View style={styles.row}>
          
          <RkTextInput rkType='bordered'  
          label={<Icon name={'asterisk'}  style={{color:'red'}}/>}
          labelStyle={{fontSize:6,marginLeft:5}}
          inputStyle={styles.input} style={{flex:1,marginVertical:0}}  placeholder='Email' onChangeText={(txt)=>this.setState({email:txt})}  
          onBlur={()=>this.setState({emailError:this._validate('email',this.state.email)})}/>
          </View>
          {emailError !== null ? <RkText style={styles.error}>{emailError}</RkText> : null}

          <View style={styles.row}>
          
          <RkTextInput rkType='bordered'  
          label={<Icon name={'asterisk'} style={{color:'red'}}/>}
          labelStyle={{fontSize:6,marginLeft:5}}
          inputStyle={styles.input} style={{flex:1,marginVertical:0}} placeholder='Password' secureTextEntry onChangeText={(txt)=>(this.setState({password:txt}))}
          onBlur={()=>this.setState({passwordError:this._validate('password',this.state.password)})}/>
          </View>
          {passwordError !== null ? <RkText style={styles.error}>{passwordError}</RkText> : null}

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
          

          <RkButton style={styles.save} rkType='success' onPress={()=>this.onSignUpButtonPressed()}>SIGN UP</RkButton>
        </View>
        <View style={styles.footer}>
          <View style={styles.textRow}>
            <RkText rkType='primary3'>Already have an account? </RkText>
            <RkButton rkType='clear' onPress={this.onSignInButtonPressed}>
              <RkText rkType='header6' style={{fontWeight:'bold'}}>Sign in now</RkText>
            </RkButton>
          </View>
        </View>
      </View>
      </ScrollView>
    )
  }
}

export default SignUp;

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
