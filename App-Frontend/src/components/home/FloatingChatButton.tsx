import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

type Props = {
    onPress: () => void;
};

export default function FloatingChatButton({ onPress }: Props) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.text}>💬</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#2E7D32',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    text: {
        fontSize: 24,
        color: '#fff',
    },
});