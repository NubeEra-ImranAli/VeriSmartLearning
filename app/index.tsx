import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { grades } from "@/constants/data";

const gradeIcons: Record<number, keyof typeof Ionicons.glyphMap> = {
  1: "flash",
  2: "bulb",
  3: "hardware-chip",
  4: "rocket",
};

function GradeButton({ grade, index }: { grade: typeof grades[0]; index: number }) {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({ pathname: "/grade/[id]", params: { id: grade.id.toString() } });
  };

  return (
    <Animated.View
      entering={Platform.OS !== "web" ? FadeInDown.delay(200 + index * 100).springify() : undefined}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.gradeButton,
          { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
        ]}
      >
        <LinearGradient
          colors={[grade.color, grade.colorDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradeGradient}
        >
          <View style={styles.gradeIconContainer}>
            <Ionicons
              name={gradeIcons[grade.id] || "school"}
              size={32}
              color="rgba(255,255,255,0.9)"
            />
          </View>
          <View style={styles.gradeTextContainer}>
            <Text style={styles.gradeLabel}>{grade.label}</Text>
            <Text style={styles.gradeSubLabel}>
              {grade.projects.length} Projects
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="rgba(255,255,255,0.7)"
          />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Animated.View
        style={styles.header}
        entering={Platform.OS !== "web" ? FadeInUp.delay(100).springify() : undefined}
      >
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={["#00D4AA", "#00A388"]}
            style={styles.logoBadge}
          >
            <Ionicons name="school" size={28} color="#fff" />
          </LinearGradient>
        </View>
        <Text style={styles.companyName}>VeriTon</Text>
        <Text style={styles.deviceName}>VeriSmart</Text>
        <Text style={styles.tagline}>Interactive Learning Platform</Text>
      </Animated.View>

      <View style={[styles.gradesContainer, { paddingBottom: bottomPadding + 20 }]}>
        <Animated.Text
          style={styles.sectionTitle}
          entering={Platform.OS !== "web" ? FadeInDown.delay(150).springify() : undefined}
        >
          Select Grade
        </Animated.Text>
        {grades.map((grade, index) => (
          <GradeButton key={grade.id} grade={grade} index={index} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  companyName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: Colors.accent,
    letterSpacing: 2,
  },
  deviceName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: Colors.text,
    marginTop: 2,
  },
  tagline: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  gradesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  gradeButton: {
    marginBottom: 14,
    borderRadius: 18,
    overflow: "hidden",
  },
  gradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  gradeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  gradeTextContainer: {
    flex: 1,
  },
  gradeLabel: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#fff",
  },
  gradeSubLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
});
