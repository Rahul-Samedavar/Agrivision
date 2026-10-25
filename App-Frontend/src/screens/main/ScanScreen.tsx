import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { detectDisease } from '../../services/api/diseaseService';
import { useLanguage } from '../../context/LanguageContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';

export default function ScanScreen() {
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation<any>();
    const { language } = useLanguage();
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            await ImagePicker.requestCameraPermissionsAsync();
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        })();
    }, []);

    // 🔥 MAIN FUNCTION - Handle Detection
    const handleDetection = async (base64: string, uri: string) => {
        try {
            setLoading(true);
            const response = await detectDisease(base64, language);

            navigation.navigate('Result', {
                image: uri,
                result: response,
            });

        } catch (error) {
            console.error('Detection error:', error);
            Alert.alert(t("scan.error"), t("scan.detectionFailed"));
        } finally {
            setLoading(false);
        }
    };

    // 📸 Capture image from camera
    const takePicture = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setSelectedImage(asset);
        }
    };

    // 🖼️ Pick from gallery
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setSelectedImage(asset);
        }
    };

    // 🔍 Detect Disease
    const onDetectPress = () => {
        if (!selectedImage) {
            Alert.alert(t("scan.noImage"), t("scan.selectImageFirst"));
            return;
        }

        if (selectedImage.base64) {
            handleDetection(selectedImage.base64, selectedImage.uri);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <Text style={styles.header}>🔬 {t("scan.title")}</Text>
                    <Text style={styles.subtitle}>{t("scan.subtitle")}</Text>

                    {/* Image Preview */}
                    <View style={styles.previewCard}>
                        {selectedImage ? (
                            <Image
                                source={{ uri: selectedImage.uri }}
                                style={styles.previewImage}
                            />
                        ) : (
                            <View style={styles.emptyPreview}>
                                <Text style={styles.emptyIcon}>🖼️</Text>
                                <Text style={styles.emptyTitle}>{t("scan.noImageSelected")}</Text>
                                <Text style={styles.emptySubtitle}>{t("scan.imagePreviewHint")}</Text>
                            </View>
                        )}
                    </View>

                    {/* Action Cards */}
                    <View style={styles.actionRow}>
                        {/* Camera Card */}
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={takePicture}
                            disabled={loading}
                        >
                            <View style={[styles.actionIcon, styles.cameraIcon]}>
                                <Text style={styles.actionIconText}>📷</Text>
                            </View>
                            <Text style={styles.actionTitle}>{t("scan.clickPhoto")}</Text>
                            <Text style={styles.actionSubtitle}>{t("scan.useCamera")}</Text>
                        </TouchableOpacity>

                        {/* Gallery Card */}
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={pickImage}
                            disabled={loading}
                        >
                            <View style={[styles.actionIcon, styles.galleryIcon]}>
                                <Text style={styles.actionIconText}>📁</Text>
                            </View>
                            <Text style={styles.actionTitle}>{t("scan.chooseGallery")}</Text>
                            <Text style={styles.actionSubtitle}>{t("scan.uploadFile")}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tips Section */}
                    <View style={styles.tipsCard}>
                        <Text style={styles.tipsIcon}>ℹ️</Text>
                        <View style={styles.tipsContent}>
                            <Text style={styles.tipsTitle}>{t("scan.accurateDetection")}</Text>
                            <Text style={styles.tipText}>• {t("scan.tip1")}</Text>
                            <Text style={styles.tipText}>• {t("scan.tip2")}</Text>
                            <Text style={styles.tipText}>• {t("scan.tip3")}</Text>
                        </View>
                    </View>

                    {/* Detect Button */}
                    <TouchableOpacity
                        style={[styles.detectButton, !selectedImage && styles.detectButtonDisabled]}
                        onPress={onDetectPress}
                        disabled={loading || !selectedImage}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.detectButtonText}>🔍 {t("scan.detectDisease")}</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7f9',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 30,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1c2b36',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        lineHeight: 20,
    },
    previewCard: {
        backgroundColor: '#e8f4f8',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    emptyPreview: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1c2b36',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#999',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cameraIcon: {
        backgroundColor: '#a5d6a7',
    },
    galleryIcon: {
        backgroundColor: '#81d4fa',
    },
    actionIconText: {
        fontSize: 28,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1c2b36',
        marginBottom: 4,
        textAlign: 'center',
    },
    actionSubtitle: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    tipsCard: {
        backgroundColor: '#eff5fb',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    tipsIcon: {
        fontSize: 20,
        marginRight: 12,
        marginTop: 2,
    },
    tipsContent: {
        flex: 1,
    },
    tipsTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1c2b36',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        marginBottom: 4,
    },
    detectButton: {
        backgroundColor: '#2e7d32',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    detectButtonDisabled: {
        backgroundColor: '#ccc',
    },
    detectButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});