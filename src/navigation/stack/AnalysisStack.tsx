import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AnalysisScreen from '../../screens/analysis/AnalysisScreen';
import ConsumptionAnalysisScreen from '../../screens/analysis/ConsumptionAnalysisScreen';

const Stack = createNativeStackNavigator();

const AnalysisStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalysisMain" component={AnalysisScreen} />
      <Stack.Screen
        name="ConsumptionAnalysis"
        component={ConsumptionAnalysisScreen}
      />
    </Stack.Navigator>
  );
};

export default AnalysisStack;
