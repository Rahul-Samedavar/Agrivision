import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LanguageScreen from '../screens/onboarding/LanguageScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ScanScreen from '../screens/main/ScanScreen';
import ResultScreen from '../screens/main/ResultScreen';
import SoilLabsScreen from '../screens/main/SoilLabsScreen';

// NEW Screens
import NewsScreen from '../screens/main/NewsScreen';
import SchemesScreen from '../screens/main/SchemesScreen';
import ChatScreen from '../screens/main/ChatScreen';

// Components
import FloatingChatButton from '../components/home/FloatingChatButton';
import ChatModal from '../components/chat/ChatModal';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const [chatVisible, setChatVisible] = useState(false);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Language"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Language" component={LanguageScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Scan" component={ScanScreen} />
                <Stack.Screen name="Result" component={ResultScreen} />
                <Stack.Screen name="Labs" component={SoilLabsScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />

                {/* NEW ROUTES */}
                <Stack.Screen name="News" component={NewsScreen} />
                <Stack.Screen name="Schemes" component={SchemesScreen} />
            </Stack.Navigator>

            {/* Global Chat Components */}
            <FloatingChatButton onPress={() => setChatVisible(true)} />
            <ChatModal
                visible={chatVisible}
                onClose={() => setChatVisible(false)}
            />
        </NavigationContainer>
    );
}