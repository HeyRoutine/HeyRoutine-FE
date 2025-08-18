import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AnalysisScreen from '../../screens/analysis/AnalysisScreen';
import ConsumptionAnalysisScreen from '../../screens/analysis/ConsumptionAnalysisScreen';
import FinancialProductScreen from '../../screens/analysis/FinancialProductScreen';
import LoadingScreen from '../../screens/common/LoadingScreen';

const Stack = createNativeStackNavigator();

const AnalysisStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalysisMain" component={AnalysisScreen} />
      <Stack.Screen
        name="ConsumptionAnalysis"
        component={ConsumptionAnalysisScreen}
      />
      <Stack.Screen
        name="FinancialProduct"
        component={FinancialProductScreen}
      />
      <Stack.Screen name="Loading" component={LoadingScreen} />
    </Stack.Navigator>
  );
};

export default AnalysisStack;
