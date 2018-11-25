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
    title: 'Sign up'.toUpperCase(),
  };
  
  componentDidMount(){
  //init profileUrl list
 
  
  }

  constructor(props){
    super(props)
    this.profileURLs=[
      {id:0,url:require('../data/img/avatars/Image1.jpg')},
      {id:1,url:require('../data/img/avatars/Image2.jpg')},
      {id:2,url:require('../data/img/avatars/Image3.jpg')},
    ]
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
      selectIndex:0,
      isLoading:false,
      
      profileURL:'../data/img/avatars/Image3.jpg',
    }
  }

  _validate(fieldName,value){
    err= validate(fieldName,value)
    return err;
  }

  createUser(email,password, name,aboutMe){
    this.setState({isLoading:true,error:null})
    timestamp=Date.now()
    selectIndex=this.state.selectIndex
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((credentials) => {
      firebase.firestore().collection('users').doc(credentials.user.uid).set({
        email:email,
        name: name,
        aboutMe:aboutMe,
        cactusName:'Hello bebe',
        progress:0,
        profileURL:this.profileURLs[selectIndex].id,
        timestamp:timestamp,
        error:null
        
    })})
    .catch((error) => {
      var { code, message } = error;
      if (code=='auth/unknown') 
      {message='Please check you Internet connection'}
      else{
        message='Something went wrong, please try again later'
      }
      
      this.setState({isLoading:false,error:message})
      
    });
}

  onSignUpButtonPressed = () => {
    //add to db
    if  (this._validate('name',this.state.name)!=null || this._validate('email',this.state.email)!=null 
    || this._validate('password',this.state.password)!=null){
      return  this.setState({nameError:this._validate('name',this.state.name),
              emailError:this._validate('email',this.state.email),
              passwordError:this._validate('password',this.state.password)
            })
    }
    else if (this.state.name==''){
      return this.setState({nameError:this._validate('name',this.state.name)})
    }
    else if (this.state.email==''){
      return this.setState({emailError:this._validate('email',this.state.email)})
    }
    else if (this.state.password==''){
      return this.setState({passwordError:this._validate('password',this.state.password)});
    }
  
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
    const selectIndex=this.state.selectIndex
    const isLoading=this.state.isLoading
    const error=this.state.error


    if (isLoading){
    return (
      <View style={[styles.a_container, styles.a_horizontal]}>
       
        <ActivityIndicator size="large" color="#00ff00" />
      </View>)
    }
    return (
    <ScrollView keyboardShouldPersistTaps='handled' style={styles.root}>
      <View style={styles.content}>
      
        <View>
          <View style={{flexDirection:'row',alignSelf:'center',flexWrap:'wrap',padding:5}}>
          {
            this.profileURLs.map((item)=>(
              <TouchableOpacity onPress={()=>this.setState({selectIndex:item.id})}><Image source={item.url} 
              style={item.id==selectIndex ? styles.selected : styles.imageStyle} />
              </TouchableOpacity>

            ))

          }
          </View>

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
          keyboardType='email-address' autoCapitalize='none' 
          label={<Icon name={'asterisk'}  style={{color:'red'}}/>}
          labelStyle={{fontSize:6,marginLeft:5}}
          inputStyle={styles.input} style={{flex:1,marginVertical:0}}  placeholder='Email' onChangeText={(txt)=>this.setState({email:txt})}  
          onBlur={()=>this.setState({emailError:this._validate('email',this.state.email)})}/>
          </View>
          {emailError !== null ? <RkText style={styles.error}>{emailError}</RkText> : null}

          <View style={styles.row}>
          
          <RkTextInput rkType='bordered'  
          autoCapitalize='none'
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
          {error !== null ? <RkText style={{alignSelf:'center',color:'red',fontSize:11,}}>{error}</RkText> : null}

        </View>
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
    paddingVertical:20,
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
