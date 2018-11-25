import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import validate from '../components/validation_wrapper'
import { scaleVertical } from '../utils/scale';
import firebase from 'react-native-firebase';

export class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      email: '',
      emailError: null,
      password: '',
      passwordError: null,
      isLoading:false,
      loginError:null,
    }
  }
  
  static navigationOptions = {
    title: 'Login'.toUpperCase(),
  };
  _validate(fieldName,value){
    err= validate(fieldName,value)
    return err;
  }
  onLoginButtonPressed = () => {

    if  (this._validate('email',this.state.email)!=null ||this._validate('password',this.state.password)!=null){

      return this.setState({emailError:this._validate('email',this.state.email),passwordError:this._validate('password',this.state.password) })

    }
    else if (this.state.email==''){
      return this.setState({emailError:this._validate('email',this.state.email)})
    }
    else if (this.state.password==''){
      return this.setState({passwordError:this._validate('password',this.state.password)});
    }
    this.setState({isLoading:true,loginError:null})

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the 
      // `onAuthStateChanged` listener we set up in App.js earlier
    })
    .catch((error) => {
      var { code, message } = error;
      console.log(code,message)
      if (code=='auth/unknown')       
      {message='Please check you Internet connection'   }
     else if(code=='auth/user-not-found')
     {
       message="Incorrect email or password"
     }
      this.setState({isLoading:false, loginError:message})


      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
    });  };

  onSignUpButtonPressed = () => {
    this.props.navigation.navigate('SignUp');
  };

  
render(){
    const emailError=this.state.emailError
    const passwordError=this.state.passwordError
    const login=this.state.login
    const isLoading=this.state.isLoading
    const loginError=this.state.loginError

  if (isLoading){
      return (
        <View style={[styles.a_container, styles.a_horizontal]}>
         
          <ActivityIndicator size="large" color="#00ff00" />
        </View>)
      }
  return (
    <RkAvoidKeyboard
      style={styles.screen}
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => Keyboard.dismiss()}>
     
      <View style={styles.content}>
        <View>
          <RkTextInput rkType='bordered' keyboardType='email-address' placeholder='Email' onChangeText={(text)=>this.setState({email:text})}
          autoCapitalize='none'
          style={{marginVertical:0,}}
          inputStyle={styles.input}
           onBlur={()=>this.setState({emailError:this._validate('email',this.state.email)})}/>
          {emailError !== null ? <RkText style={styles.error}>{emailError}</RkText> : null}

          <RkTextInput rkType='bordered' placeholder='Password' secureTextEntry   inputStyle={styles.input}
          autoCapitalize='none'
          style={{marginBottom:0,}}
          onBlur={()=>this.setState({passwordError:this._validate('password',this.state.password)})}
          onChangeText={(text)=>this.setState({password:text})}/>
          {passwordError !== null ? <RkText style={styles.error}>{passwordError}</RkText> : null}

          <RkButton style={styles.save} rkType='success' onPress={()=>this.onLoginButtonPressed()}>LOGIN</RkButton>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.textRow}>
            <RkText rkType='primary3'>Don’t have an account? </RkText>
            <RkButton rkType='clear' onPress={this.onSignUpButtonPressed}>
              <RkText rkType='header6' style={{fontWeight:'bold'}}>Sign up now</RkText>
            </RkButton>
          </View>
          {loginError !== null ? <RkText style={{alignSelf:'center',color:'red',fontSize:11,}}>{loginError}</RkText> : null}
        </View>
      </View>
    </RkAvoidKeyboard>
  );
}
}
export default Login;
const styles = RkStyleSheet.create(theme => ({
  a_container: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: theme.colors.screen.base,

  },
  a_horizontal: {
    backgroundColor: theme.colors.screen.base,

    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  screen: {
    padding: scaleVertical(16),
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.screen.base,
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
    height: scaleVertical(77),
    resizeMode: 'contain',
  },
  header: {
    paddingBottom: scaleVertical(10),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  error:{
    color:'red',fontSize:11,
  },

  content: {
    justifyContent: 'space-between',
  },
  save: {
    marginVertical: 20,
    alignSelf:'center'
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    borderColor: theme.colors.border.solid,
  },
  footer: {
    alignSelf:'center'
  },
}));
