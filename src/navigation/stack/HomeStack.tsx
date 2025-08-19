import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/home/HomeScreen';
import CreateRoutineScreen from '../../screens/home/CreateRoutineScreen';
import PersonalRoutineDetailScreen from '../../screens/routine/PersonalRoutineDetailScreen';
import GroupBoardScreen from '../../screens/group/GroupBoardScreen';
import GroupRoutineDetailScreen from '../../screens/group/GroupRoutineDetailScreen';
import LoadingScreen from '../../screens/common/LoadingScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
      <Stack.Screen
        name="PersonalRoutineDetail"
        component={PersonalRoutineDetailScreen}
      />
      <Stack.Screen name="GroupBoard" component={GroupBoardScreen} />
      <Stack.Screen
        name="GroupRoutineDetail"
        component={GroupRoutineDetailScreen}
      />
      <Stack.Screen name="Loading" component={LoadingScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
