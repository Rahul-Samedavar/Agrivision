import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
    Linking,
} from "react-native";

import LeafletMap from "../../components/maps/LeafletMap";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import { getSoilLabs } from "../../services/api/soilService";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import ScreenWrapper from "../../components/common/ScreenWrapper";

export default function SoilLabsScreen() {
    const [place, setPlace] = useState("");
    const [labs, setLabs] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedLab, setSelectedLab] = useState<any>(null);

    const { language } = useLanguage();
    const { t } = useTranslation();

    const fetchLabs = async () => {
        if (!place.trim()) {
            Alert.alert(t("soilLabs.errorTitle"), t("soilLabs.enterLocation"));
            return;
        }

        try {
            setLoading(true);
            const data = await getSoilLabs(place, language);
            console.log("Received labs data:", data);
            setLabs(data);
        } catch (err) {
            console.error("Error fetching labs:", err);
            Alert.alert(t("soilLabs.errorTitle"), t("soilLabs.fetchFail"));
        } finally {
            setLoading(false);
        }
    };

    const markers = [
        ...(labs?.government || []),
        ...(labs?.private || []),
    ].filter((item) => typeof item.lat === "number" && typeof item.lon === "number");

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.header}>{`🌾 ${t("soilLabs.title")}`}</Text>

                    <Text style={styles.subtitle}>{t("soilLabs.subtitle")}</Text>

                    <Text style={styles.description}>
                        {t("soilLabs.description")}
                    </Text>

                    {/* Search */}
                    <View style={styles.searchRow}>
                        <TextInput
                            placeholder={t("soilLabs.placeholder")}
                            value={place}
                            onChangeText={setPlace}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            style={styles.searchBtn}
                            onPress={fetchLabs}
                            disabled={loading}
                        >
                            <Text style={{ color: "#fff", fontSize: 18 }}>🔍</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Skeleton Loader */}
                    {loading && <SkeletonLoader count={4} cardHeight={110} />}

                    {/* Map */}
                    {!loading && markers.length > 0 && (
                        <View style={styles.mapContainer}>
                            <LeafletMap markers={markers} />
                        </View>
                    )}

                    {/* Government Labs */}
                    {labs?.government?.length > 0 && (
                        <>
                            <Text style={styles.section}>{`🏛️ ${t("soilLabs.government")}`}</Text>

                            {labs.government.map((item: any, i: number) => (
                                <TouchableOpacity
                                    key={`gov-${i}`}
                                    style={styles.card}
                                    onPress={() => setSelectedLab(item)}
                                >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{t("soilLabs.verifiedGov")}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.address}>{`${t("soilLabs.address")} ${item.address}`}</Text>

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.phone}>{`${t("soilLabs.phone")} ${item.phoneNumber}`}</Text>
                                        <Text style={styles.rating}>{`${t("soilLabs.rating")} ${item.rating} (${item.ratingCount})`}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    {/* Private Labs */}
                    {labs?.private?.length > 0 && (
                        <>
                            <Text style={styles.section}>{`🏢 ${t("soilLabs.private")}`}</Text>

                            {labs.private.map((item: any, i: number) => (
                                <TouchableOpacity
                                    key={`pvt-${i}`}
                                    style={styles.card}
                                    onPress={() => setSelectedLab(item)}
                                >
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.address}>{`${t("soilLabs.address")} ${item.address}`}</Text>

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.phone}>{`${t("soilLabs.phone")} ${item.phoneNumber}`}</Text>
                                        <Text style={styles.rating}>{`${t("soilLabs.rating")} ${item.rating} (${item.ratingCount})`}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    {!loading && labs && labs.government?.length === 0 && labs.private?.length === 0 && (
                        <Text style={styles.noResults}>{t("soilLabs.noResults")}</Text>
                    )}
                </ScrollView>

                {/* Bottom Sheet Modal */}
                {selectedLab && (
                    <Modal visible={!!selectedLab} transparent animationType="slide">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={styles.modalClose}
                                    onPress={() => setSelectedLab(null)}
                                >
                                    <Text style={styles.modalCloseText}>✕</Text>
                                </TouchableOpacity>

                                <Text style={styles.modalTitle}>{selectedLab?.title}</Text>

                                {selectedLab?.lat && selectedLab?.lon ? (
                                    <View style={styles.modalMapContainer}>
                                        <LeafletMap markers={[selectedLab]} style={styles.modalMap} />
                                    </View>
                                ) : null}

                                <Text style={styles.modalLabel}>{t("soilLabs.locationLabel")}</Text>
                                <Text style={styles.modalText}>{selectedLab?.address}</Text>

                                <Text style={styles.modalLabel}>{t("soilLabs.contactLabel")}</Text>
                                <Text style={styles.modalText}>{selectedLab?.phoneNumber}</Text>

                                <Text style={styles.modalLabel}>{t("soilLabs.rating")}</Text>
                                <Text style={styles.modalText}>{`${selectedLab?.rating} (${selectedLab?.ratingCount})`}</Text>

                                {selectedLab?.website ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const url = selectedLab.website.startsWith("http")
                                                ? selectedLab.website
                                                : `https://${selectedLab.website}`;
                                            Linking.openURL(url);
                                        }}
                                        style={styles.websiteBtn}
                                    >
                                        <Text style={styles.websiteBtnText}>{t("soilLabs.visitWebsite")}</Text>
                                    </TouchableOpacity>
                                ) : null}

                                <TouchableOpacity
                                    onPress={() => setSelectedLab(null)}
                                    style={styles.closeBtn}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "600" }}>{t("soilLabs.close")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 5,
        color: "#1a1a1a",
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4CAF50",
        marginHorizontal: 20,
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginHorizontal: 20,
        marginBottom: 20,
        lineHeight: 20,
    },
    searchRow: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#e8f5e9",
        fontSize: 14,
        color: "#333",
    },
    searchBtn: {
        backgroundColor: "#4CAF50",
        width: 45,
        height: 45,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    mapContainer: {
        height: 250,
        marginHorizontal: 20,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    section: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a7c1a",
        marginHorizontal: 20,
        marginTop: 25,
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 10,
        padding: 15,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1a1a1a",
        flex: 1,
    },
    badge: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 10,
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    address: {
        fontSize: 13,
        color: "#666",
        marginBottom: 12,
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    phone: {
        fontSize: 12,
        color: "#4CAF50",
        fontWeight: "600",
    },
    rating: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    noResults: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginVertical: 30,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
    },
    modalClose: {
        alignSelf: "flex-end",
        padding: 5,
        marginBottom: 10,
    },
    modalCloseText: {
        fontSize: 24,
        color: "#999",
        fontWeight: "600",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 15,
    },
    modalMapContainer: {
        height: 180,
        borderRadius: 15,
        overflow: "hidden",
        marginBottom: 16,
        backgroundColor: "#f0f0f0",
    },
    modalMap: {
        flex: 1,
    },
    modalLabel: {
        fontSize: 12,
        color: "#999",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginTop: 10,
    },
    modalText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
        lineHeight: 20,
    },
    websiteBtn: {
        backgroundColor: "#1B5E20",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    websiteBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    closeBtn: {
        backgroundColor: "#4CAF50",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
});
