import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';

type Props = {
    children: React.ReactNode;
};

const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'mr', label: 'Marathi' },
    { code: 'kn', label: 'Kannada' },
];

export default function ScreenWrapper({ children }: Props) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    const handleLanguageSelect = (code: 'en' | 'hi' | 'mr' | 'kn') => {
        setLanguage(code);
        setSettingsOpen(false);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => setSettingsOpen(true)}
                >
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>

                {children}
            </View>

            <Modal visible={settingsOpen} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Change Language</Text>
                        <View style={styles.langGrid}>
                            {languageOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.code}
                                    style={[
                                        styles.langButton,
                                        language === option.code && styles.langButtonActive,
                                    ]}
                                    onPress={() => handleLanguageSelect(option.code as any)}
                                >
                                    <Text
                                        style={[
                                            styles.langLabel,
                                            language === option.code && styles.langLabelActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.modalClose}
                            onPress={() => setSettingsOpen(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    settingsButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#eef2f7',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    settingsIcon: {
        fontSize: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 18,
        color: '#1b2730',
    },
    langGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    langButton: {
        width: '48%',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#d6dde5',
        backgroundColor: '#f7fafc',
        marginBottom: 12,
        alignItems: 'center',
    },
    langButtonActive: {
        backgroundColor: '#d4f2d4',
        borderColor: '#2e7d32',
    },
    langLabel: {
        color: '#2f3f50',
        fontWeight: '600',
    },
    langLabelActive: {
        color: '#1b5e20',
    },
    modalClose: {
        marginTop: 12,
        alignSelf: 'center',
    },
    modalCloseText: {
        color: '#2e7d32',
        fontWeight: '700',
    },
});