/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {RkButton} from 'react-native-ui-kitten';
import Profile from './screens/Profile';
import MyCactus from './screens/MyCactus';
import Feed from './screens/Feed';
import EditProfile from './screens/EditProfile';
import AddTask from './screens/AddTask';



import Ionicons from 'react-native-vector-icons/AntDesign';
import { createStackNavigator,createBottomTabNavigator } from 'react-navigation';
import { data } from './data';
import { bootstrap } from './config/bootstrap';

bootstrap();
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const ProfileStack = createStackNavigator({
  Profile: Profile,
  EditProfile:EditProfile,
  AddTask: AddTask,
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
  
});



export default createBottomTabNavigator(
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
export class App extends Component<Props> {
  render() {
    return (
	  <View>
        <Text>This is the main screen with menu</Text>
		<createBottomTabNavigator/>
      </View>
      
    );
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
