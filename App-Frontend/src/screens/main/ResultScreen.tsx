import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Markdown from 'react-native-markdown-display';

function parseAnalysis(analysis: string) {
    const lines = analysis.split('\n');
    const sections: Array<{ title: string; body: string[] }> = [];
    let currentSection: { title: string; body: string[] } | null = null;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        if (line.startsWith('## ')) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                title: line.replace(/^##\s*/, '').trim(),
                body: [],
            };
        } else if (currentSection) {
            currentSection.body.push(line);
        }
    }

    if (currentSection) {
        sections.push(currentSection);
    }

    return sections;
}

function normalizeUrl(url: string) {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
}

export default function ResultScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const result = route.params?.result;
    const analysis = result?.analysis || '';
    const products = result?.recommended_products || [];
    const imageUri = route.params?.image;
    const sections = parseAnalysis(analysis);

    return (
        <ScreenWrapper>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                )}

                {sections.length > 0 ? (
                    <View style={styles.analysisContainer}>
                        {sections.map((section, index) => (
                            <View key={index} style={styles.analysisCard}>
                                <View style={styles.analysisHeader}>
                                    <View style={styles.indexBadge}>
                                        <Text style={styles.indexText}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.analysisTitle}>{section.title}</Text>
                                </View>
                                <View style={styles.analysisBody}>
                                    <Markdown style={markdownStyles}>
                                        {section.body.join('\n')}
                                    </Markdown>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noData}>No analysis available</Text>
                )}

                {products.length > 0 && (
                    <View style={styles.recommendationsSection}>
                        <Text style={styles.sectionTitle}>Recommended Products</Text>
                        {products.map((item: any, index: number) => (
                            <View key={index} style={styles.productCard}>
                                {item.image_url ? (
                                    <Image source={{ uri: item.image_url }} style={styles.productImage} />
                                ) : null}
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>{item.price}</Text>
                                    <TouchableOpacity
                                        style={styles.buyButton}
                                        onPress={() => {
                                            const url = normalizeUrl(item.buy_link);
                                            if (url) {
                                                Linking.openURL(url);
                                            }
                                        }}
                                    >
                                        <Text style={styles.buyButtonText}>Buy Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.backButtonContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() =>
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            })
                        }
                    >
                        <Text style={styles.backButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        paddingBottom: 30,
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 18,
        marginBottom: 18,
    },
    analysisContainer: {
        marginBottom: 24,
    },
    analysisCard: {
        backgroundColor: '#ecf9ef',
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#d6f0d9',
    },
    analysisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    indexBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2e7d32',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    indexText: {
        color: '#fff',
        fontWeight: '700',
    },
    analysisTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a3b18',
        flexShrink: 1,
    },
    analysisBody: {
        paddingLeft: 42,
    },
    analysisText: {
        fontSize: 14,
        color: '#2d3f2c',
        lineHeight: 20,
        marginBottom: 6,
    },
    noData: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },
    recommendationsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1c3f20',
        marginBottom: 14,
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 14,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a2e23',
        marginBottom: 6,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2e7d32',
        marginBottom: 10,
    },
    buyButton: {
        backgroundColor: '#0d4d7a',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    backButtonContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#2e7d32',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});

const markdownStyles: any = {
    body: {
        color: '#2d3f2c',
        fontSize: 14,
        lineHeight: 22,
    },
    bullet_list: {
        marginLeft: 0,
        paddingLeft: 18,
    },
    ordered_list: {
        marginLeft: 0,
        paddingLeft: 18,
    },
    list_item_number: {
        color: '#2d3f2c',
    },
    strong: {
        fontWeight: 'bold',
    },
};