import Profile from '../screens/Profile';
import MyCactus from '../screens/MyCactus';
import Feed from '../screens/Feed';
import EditProfile from '../screens/EditProfile';
import AddTask from '../screens/AddTask';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { createStackNavigator,createBottomTabNavigator} from 'react-navigation';
import React from 'react';
const ProfileStack = createStackNavigator({
 
    Profile: Profile,
    EditProfile:EditProfile,
    AddTask: AddTask,
    
  });
  
  ProfileStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = false;
    if (navigation.state.index > 1) {
      tabBarVisible = true;
    }
  
    return {
      tabBarVisible,
    };
  };
  
  
  const FeedStack = createStackNavigator({
    Feed: Feed,
    
  });
  
  
  
  export default tabNav= createBottomTabNavigator(
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