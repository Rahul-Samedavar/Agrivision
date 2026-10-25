import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { Linking } from 'react-native';

const schemes = [
    {
        id: '1',
        title: 'PM-KISAN',
        description: 'Provides income support of INR 6000 per year to eligible farmer families.',
        category: 'Finance',
        url: 'https://pmkisan.gov.in/',
    },
    {
        id: '2',
        title: 'PMKSY',
        description: 'Promotes efficient irrigation and better water management for farms.',
        category: 'Irrigation',
        url: 'https://pmksy.gov.in/',
    },
    {
        id: '3',
        title: 'Soil Health Card',
        description: 'Provides soil nutrient status and recommendations to farmers.',
        category: 'Soil',
        url: 'https://soilhealth.dac.gov.in/',
    },
    {
        id: '4',
        title: 'PMFBY',
        description: 'Crop insurance scheme protecting farmers from losses.',
        category: 'Insurance',
        url: 'https://pmfby.gov.in/',
    },
];

export default function SchemesScreen() {
    const openLink = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log("Can't open URL:", url);
            }
        } catch (err) {
            console.error('Error opening link:', err);
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.category}>{item.category.toUpperCase()}</Text>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.footer}>
                <Text style={styles.portal}>OFFICIAL PORTAL</Text>

                <TouchableOpacity onPress={() => openLink(item.url)}>
                    <Text style={styles.apply}>Apply Now →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.header}>🏛️ Government Schemes</Text>

                <FlatList
                    data={schemes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
    },

    card: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },

    category: {
        alignSelf: 'flex-end',
        backgroundColor: '#D6F5D6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        marginBottom: 8,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
    },

    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 16,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
    },

    portal: {
        fontSize: 12,
        color: '#999',
    },

    apply: {
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: '600',
    },
});