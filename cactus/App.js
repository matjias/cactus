/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Keyboard } from 'react-native';
import {RkButton} from 'react-native-ui-kitten';
import Profile from './screens/Profile';
import MyCactus from './screens/MyCactus';
import Feed from './screens/Feed';
import EditProfile from './screens/EditProfile';
import AddTask from './screens/AddTask';
import SignUp from './screens/signUp';
import Login from './screens/login';
import Notifications from './screens/Notifications';
import Comments from './screens/Comments';
import ProfileGuest from './screens/Profile_guest';
import Update from './screens/Update';
import Feedback from './screens/Feedback';
import About from './screens/About';



import firebase from 'react-native-firebase';




import Ionicons from 'react-native-vector-icons/AntDesign';
import { createStackNavigator,createBottomTabNavigator} from 'react-navigation';
import { bootstrap } from './config/bootstrap';

bootstrap();
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


const AuthStack=createStackNavigator({
  Login:Login,
  SignUp:SignUp,
})
const ProfileStack = createStackNavigator({
 
  Profile: Profile,
  EditProfile:EditProfile,
  AddTask: AddTask,
  Notifications: Notifications,
  ProfileGuest:ProfileGuest,
  Update,
  Comments:Comments,
  Feedback:Feedback,
  //About:About

  
});

ProfileStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};


const FeedStack = createStackNavigator({
  Feed: Feed,
  Comments:Comments,
  ProfileGuest:ProfileGuest,

  
});

FeedStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};


const TabNav= createBottomTabNavigator(
  {
    Profile: ProfileStack,
    Feed: FeedStack,
	  Cactus: MyCactus,

  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Profile') {
          iconName = `user`;
        } else if (routeName === 'Feed') {
          iconName = `home`;
        }
		else if (routeName === 'Cactus') {
          iconName = `star`;
        }


        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
  
);

type Props = {};
export default class App extends Component<Props> {
constructor() {
  super();
  this.state = {
    loading: true,
  };
}
 /**
   * When the App component mounts, we listen for any authentication
   * state changes in Firebase.
   * Once subscribed, the 'user' parameter will either be null 
   * (logged out) or an Object (logged in)
   */
componentDidMount() {
  console.log('called mount')
  this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
    this.setState({
      loading: false,
      user,
    });
  });
}
/**
   * Don't forget to stop listening for authentication state changes
   * when the component unmounts.
   */
componentWillUnmount() {
  this.authSubscription();
}
  
render() {
    // The application is initialising
    if (this.state.loading) return null;
    // The user is an Object, so they're logged in
    if (this.state.user!=null) return <TabNav/>;
    return <AuthStack/>;
    // The user is null, so they're logged out
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
