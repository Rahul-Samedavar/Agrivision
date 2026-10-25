import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

interface SkeletonLoaderProps {
    count?: number;
    cardHeight?: number;
}

export default function SkeletonLoader({ count = 4, cardHeight = 120 }: SkeletonLoaderProps) {
    const shimmerAnimated = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnimated, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false,
                }),
                Animated.timing(shimmerAnimated, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: false,
                }),
            ])
        );

        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
    }, [shimmerAnimated]);

    const opacity = shimmerAnimated.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.7, 0.3],
    });

    const screenWidth = Dimensions.get("window").width;

    return (
        <View>
            {Array.from({ length: count }).map((_, index) => (
                <Animated.View
                    key={index}
                    style={[styles.card, { height: cardHeight, opacity }]}
                >
                    {/* First line (title) */}
                    <View style={[styles.line, { width: "70%", height: 14, marginBottom: 8 }]} />

                    {/* Second line */}
                    <View style={[styles.line, { width: "100%", height: 12, marginBottom: 8 }]} />

                    {/* Third line */}
                    <View style={[styles.line, { width: "85%", height: 12, marginBottom: 8 }]} />

                    {/* Box on the right */}
                    <View style={styles.contentRow}>
                        <View style={{ flex: 1 }}>
                            {/* Fourth line */}
                            <View style={[styles.line, { width: "80%", height: 12 }]} />
                        </View>
                        <View style={[styles.box, { width: 70, height: 70 }]} />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
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
    line: {
        backgroundColor: "#d0e8f2",
        borderRadius: 4,
    },
    contentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    box: {
        backgroundColor: "#d0e8f2",
        borderRadius: 6,
        marginLeft: 12,
    },
});
