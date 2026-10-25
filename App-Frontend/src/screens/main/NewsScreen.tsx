import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Linking,
} from "react-native";
import { useTranslation } from "react-i18next";

import SkeletonLoader from "../../components/common/SkeletonLoader";
import { getNews } from "../../services/api/newsService";
import { useLanguage } from "../../context/LanguageContext";
import ScreenWrapper from "../../components/common/ScreenWrapper";

export default function NewsScreen() {
    const [place, setPlace] = useState("");
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();
    const { language } = useLanguage();

    const fetchNews = async () => {
        try {
            setLoading(true);
            const data = await getNews(place, language);
            setNews(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <Text style={styles.header}>{t('news.header')}</Text>
                    <Text style={styles.subheader}>{t('news.subheader')}</Text>

                    {/* Search */}
                    <View style={styles.searchRow}>
                        <TextInput
                            placeholder={t('news.placeholder')}
                            value={place}
                            onChangeText={setPlace}
                            style={styles.input}
                        />

                        <TouchableOpacity style={styles.searchBtn} onPress={fetchNews}>
                            <Text style={{ color: "#fff" }}>🔍</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Skeleton Loader */}
                    {loading && <SkeletonLoader count={4} cardHeight={130} />}

                    {/* News Cards */}
                    {news.map((item, index) => (
                        <View key={index} style={styles.card}>

                            {/* Top Row */}
                            <View style={styles.topRow}>
                                <Text style={styles.source}>{item.source}</Text>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>{item.title}</Text>

                            {/* Content Row */}
                            <View style={styles.contentRow}>
                                <Text style={styles.snippet}>{item.snippet}</Text>

                                {item.image_url && (
                                    <Image
                                        source={{ uri: item.image_url }}
                                        style={styles.image}
                                    />
                                )}
                            </View>

                            {/* Read More */}
                            <TouchableOpacity
                                onPress={() => Linking.openURL(item.link)}
                            >
                                <Text style={styles.readMore}>{t('news.readMore')} ↗</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f7f9",
    },

    header: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 8,
        color: "#1c2b36",
    },
    subheader: {
        fontSize: 15,
        color: "#566674",
        marginBottom: 20,
        lineHeight: 22,
    },

    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    input: {
        flex: 1,
        backgroundColor: "#cfe3ef",
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 45,
    },

    searchBtn: {
        backgroundColor: "#1b7f3a",
        marginLeft: 10,
        padding: 12,
        borderRadius: 50,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    source: {
        backgroundColor: "#e0f2e9",
        color: "#1b7f3a",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        fontSize: 12,
    },

    date: {
        fontSize: 12,
        color: "#888",
    },

    title: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
        color: "#1c2b36",
    },

    contentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    snippet: {
        flex: 1,
        fontSize: 13,
        color: "#555",
        marginRight: 10,
    },

    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },

    readMore: {
        marginTop: 10,
        color: "#1b7f3a",
        fontWeight: "600",
    },
});