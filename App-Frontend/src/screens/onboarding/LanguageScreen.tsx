import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../context/LanguageContext";
import i18n from "../../i18n";

type Language = "en" | "hi" | "mr" | "kn";

function LanguageButton({ label, active, onPress }: any) {
    return (
        <TouchableOpacity
            style={[
                styles.langBtn,
                active && styles.langBtnActive,
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.langText,
                    active && styles.langTextActive,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default function LanguageScreen() {
    const navigation = useNavigation<any>();
    const { setLanguage } = useLanguage();

    const [selected, setSelected] = useState<Language>("en");

    const handleSelect = (lang: Language) => {
        setSelected(lang);
        i18n.changeLanguage(lang); // 🔥 instant UI update
    };

    const handleContinue = () => {
        setLanguage(selected);
        navigation.replace("Home");
    };

    return (
        <View style={styles.container}>

            {/* Badge */}
            <View style={styles.badge}>
                <Text style={styles.badgeText}>AGRIVISION</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>
                {i18n.t("language.title")}
            </Text>

            <Text style={styles.subtitle}>
                {i18n.t("language.subtitle")}
            </Text>

            {/* Language Grid */}
            <View style={styles.grid}>
                <LanguageButton
                    label="English"
                    active={selected === "en"}
                    onPress={() => handleSelect("en")}
                />

                <LanguageButton
                    label="Hindi"
                    active={selected === "hi"}
                    onPress={() => handleSelect("hi")}
                />

                <LanguageButton
                    label="Marathi"
                    active={selected === "mr"}
                    onPress={() => handleSelect("mr")}
                />

                <LanguageButton
                    label="Kannada"
                    active={selected === "kn"}
                    onPress={() => handleSelect("kn")}
                />
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>
                    {i18n.t("language.continue")}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eef3f6",
        padding: 24,
        justifyContent: "center",
    },

    badge: {
        alignSelf: "center",
        backgroundColor: "#cde7d0",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 16,
    },

    badgeText: {
        color: "#1b7f3a",
        fontWeight: "600",
        fontSize: 12,
    },

    title: {
        fontSize: 32,
        fontWeight: "800",
        textAlign: "center",
        color: "#1c2b36",
    },

    subtitle: {
        textAlign: "center",
        marginTop: 8,
        color: "#5f6c72",
        marginBottom: 30,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    langBtn: {
        width: "48%",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#b5c9d6",
        marginBottom: 12,
        alignItems: "center",
        backgroundColor: "#f4f8fb",
    },

    langBtnActive: {
        backgroundColor: "#bde3b9",
        borderColor: "#1b7f3a",
    },

    langText: {
        fontWeight: "600",
        color: "#1c2b36",
    },

    langTextActive: {
        color: "#1b7f3a",
    },

    button: {
        marginTop: 30,
        backgroundColor: "#1b7f3a",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});