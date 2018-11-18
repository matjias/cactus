import SignUp from '../screens/signUp';
import Login from '../screens/login';
import { createStackNavigator} from 'react-navigation';
import React from 'react';

export default authNav= createStackNavigator({
    Login:Login,
    SignUp:SignUp,
  })


  