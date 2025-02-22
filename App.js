// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './screens/WelcomeScreen';
import CustomerRegistration from './screens/CustomerRegistration';
import AffiliateRegistration from './screens/AffiliateRegistration';
import AdminRegistration from './screens/AdminRegistration';
import LoginScreen from './screens/LoginScreen';//
import AdminHome from './screens/admin/AdminHome';//
import AffiliateHome from './screens/affiliate/AffiliateHome';
import CustomerHome from './screens/customer/CustomerHome';
import AddFacilityScreen from './screens/affiliate/AddFacilityScreen';
import EditFacilityScreen from './screens/affiliate/EditFacilityScreen';
import FacilityDetailsScreen from './screens/affiliate/FacilityDetailsScreen';
import EditCustomerProfile from './screens/customer/EditCustomerProfile';
import AffiliateDetailsScreen from './screens/AffiliateDetailsScreen';
import FacilityBookingScreen from './screens/FacilityBookingScreen';
import EditAdminProfile from './screens/admin/EditAdminProfile';
import PaymentDetailsScreen from './screens/affiliate/PaymentDetailsScreen';
import BookingHistoryScreen from './screens/customer/BookingHistoryScreen';//
import AdminPaymentDetailsScreen from './screens/admin/AdminPaymentDetailsScreen';//meron na
import AffiliateSubscriptionScreen from './screens/affiliate/AffiliateSubscriptionScreen';
import SubscriptionScreen from './screens/admin/SubscriptionScreen';
import SalesReportScreen from './screens/affiliate/SalesReportScreen';
import LogsScreen from './screens/affiliate/AffiliateLogsScreen';
import AdminLogsScreen from './screens/admin/AdminLogsScreen';//meron na
import FacilityReviewsScreen from './screens/affiliate/FacilityReviewsScreen';
import EditProfileScreen from './screens/affiliate/EditProfileScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdminRegistration"
          component={AdminRegistration}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CustomerRegistration"
          component={CustomerRegistration}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AffiliateRegistration"
          component={AffiliateRegistration}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdminHome"
          component={AdminHome}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditAdminProfile"
          component={EditAdminProfile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdminPaymentDetails"
          component={AdminPaymentDetailsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdminLogs"
          component={AdminLogsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AffiliateHome"
          component={AffiliateHome}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AddFacility"
          component={AddFacilityScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditFacility"
          component={EditFacilityScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SalesReport"
          component={SalesReportScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AffiliateSubscription"
          component={AffiliateSubscriptionScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AffiliateLogs"
          component={LogsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FacilityDetails"
          component={FacilityDetailsScreen}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="FacilityReviews"
          component={FacilityReviewsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CustomerHome"
          component={CustomerHome}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="EditCustomerProfile"
          component={EditCustomerProfile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PaymentDetails"
          component={PaymentDetailsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AffiliateDetails"
          component={AffiliateDetailsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FacilityBooking"
          component={FacilityBookingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="BookingHistory"
          component={BookingHistoryScreen}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
