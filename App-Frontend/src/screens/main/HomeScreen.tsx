import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const cards = [
        {
            id: 'disease',
            title: t('home.detectDisease'),
            description: t('home.diseaseDesc'),
            icon: '🌿',
            color: '#C8E6C9',
            textColor: '#1B5E20',
            onPress: () => navigation.navigate('Scan'),
        },
        {
            id: 'labs',
            title: t('home.labs'),
            description: t('home.labsDesc'),
            icon: '🔬',
            color: '#B3E5FC',
            textColor: '#01579B',
            onPress: () => navigation.navigate('Labs'),
        },
        {
            id: 'news',
            title: t('home.news'),
            description: t('home.newsDesc'),
            icon: '📰',
            color: '#E1BEE7',
            textColor: '#4A148C',
            onPress: () => navigation.navigate('News'),
        },
        {
            id: 'schemes',
            title: t('home.schemes'),
            description: t('home.schemesDesc'),
            icon: '🏛️',
            color: '#BBDEFB',
            textColor: '#0D47A1',
            onPress: () => navigation.navigate('Schemes'),
        },
    ];

    return (
        <ScreenWrapper>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.welcome}>{t('home.welcome')}!</Text>
                    <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
                </View>

                {/* Greeting */}
                <Text style={styles.greeting}>{t('home.greeting')}</Text>
                <Text style={styles.overview}>{t('home.overview')}</Text>

                {/* Grid Cards */}
                <View style={styles.gridContainer}>
                    {cards.map((card) => (
                        <TouchableOpacity
                            key={card.id}
                            style={[styles.gridCard, { backgroundColor: card.color }]}
                            onPress={card.onPress}
                        >
                            <Text style={styles.gridIcon}>{card.icon}</Text>
                            <Text style={[styles.gridTitle, { color: card.textColor }]}>
                                {card.title}
                            </Text>
                            <Text style={styles.gridDesc}>{card.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Farming Assistant Section */}
                <View style={styles.assistantContainer}>
                    <Text style={styles.assistantTag}>{t('home.assistantTag')}</Text>
                    <Text style={styles.assistantTitle}>{t('home.assistant')}</Text>
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() => navigation.navigate('Chat')}
                    >
                        <Text style={styles.chatIcon}>💬</Text>
                        <Text style={styles.chatButtonText}>{t('home.openChatbot')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 30,
    },
    welcome: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4CAF50',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
        marginHorizontal: 20,
        marginBottom: 8,
    },
    overview: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 20,
        marginBottom: 24,
        lineHeight: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        marginBottom: 30,
        justifyContent: 'space-between',
    },
    gridCard: {
        width: '48%',
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    gridIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    gridTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    gridDesc: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    assistantContainer: {
        marginHorizontal: 20,
        marginBottom: 40,
        backgroundColor: '#81C784',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    assistantTag: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    assistantTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    chatButton: {
        backgroundColor: '#1B5E20',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    chatIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    chatButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});