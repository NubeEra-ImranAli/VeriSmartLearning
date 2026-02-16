import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { grades } from "@/constants/data";
import { useBluetooth } from "@/lib/bluetooth-context";

const gradeIcons: Record<number, keyof typeof Ionicons.glyphMap> = {
  1: "flash",
  2: "bulb",
  3: "hardware-chip",
  4: "rocket",
};

function BluetoothBar() {
  const {
    device,
    isConnected,
    isScanning,
    isSupported,
    error,
    scanAndConnect,
    disconnect,
  } = useBluetooth();

  const handlePress = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!isSupported) {
      const msg =
        Platform.OS === "web"
          ? "Bluetooth is not supported in this browser. Please use Chrome on Android or Desktop."
          : "Bluetooth requires opening this app in Chrome browser on Android. Expo Go does not support native Bluetooth.";
      if (Platform.OS === "web") {
        alert(msg);
      } else {
        Alert.alert("Bluetooth Not Available", msg);
      }
      return;
    }

    if (isConnected) {
      await disconnect();
    } else {
      await scanAndConnect();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.btBar,
        isConnected && styles.btBarConnected,
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={styles.btLeft}>
        <View
          style={[
            styles.btIconBg,
            {
              backgroundColor: isConnected
                ? Colors.accent + "30"
                : Colors.textMuted + "30",
            },
          ]}
        >
          <Ionicons
            name="bluetooth"
            size={20}
            color={isConnected ? Colors.accent : Colors.textMuted}
          />
        </View>
        <View style={styles.btTextCol}>
          {isScanning ? (
            <Text style={styles.btLabel}>Scanning for devices...</Text>
          ) : isConnected && device ? (
            <>
              <Text style={[styles.btLabel, { color: Colors.accent }]}>
                {device.name}
              </Text>
              <Text style={styles.btSub}>Connected</Text>
            </>
          ) : (
            <>
              <Text style={styles.btLabel}>No Device Connected</Text>
              <Text style={styles.btSub}>Tap to scan & connect</Text>
            </>
          )}
          {error ? (
            <Text style={styles.btError} numberOfLines={1}>
              {error}
            </Text>
          ) : null}
        </View>
      </View>
      <View
        style={[
          styles.btAction,
          {
            backgroundColor: isConnected
              ? Colors.stop + "20"
              : Colors.accent + "20",
          },
        ]}
      >
        <Ionicons
          name={
            isScanning
              ? "search"
              : isConnected
              ? "close"
              : "search"
          }
          size={18}
          color={isConnected ? Colors.stop : Colors.accent}
        />
      </View>
    </Pressable>
  );
}

function GradeButton({
  grade,
  index,
}: {
  grade: (typeof grades)[0];
  index: number;
}) {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: "/grade/[id]",
      params: { id: grade.id.toString() },
    });
  };

  return (
    <Animated.View
      entering={
        Platform.OS !== "web"
          ? FadeInDown.delay(300 + index * 100).springify()
          : undefined
      }
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.gradeButton,
          {
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
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
        entering={
          Platform.OS !== "web" ? FadeInUp.delay(100).springify() : undefined
        }
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

      <Animated.View
        style={styles.btSection}
        entering={
          Platform.OS !== "web" ? FadeInDown.delay(200).springify() : undefined
        }
      >
        <BluetoothBar />
      </Animated.View>

      <View
        style={[styles.gradesContainer, { paddingBottom: bottomPadding + 20 }]}
      >
        <Animated.Text
          style={styles.sectionTitle}
          entering={
            Platform.OS !== "web"
              ? FadeInDown.delay(250).springify()
              : undefined
          }
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
    paddingTop: 20,
    paddingBottom: 12,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  companyName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    color: Colors.accent,
    letterSpacing: 2,
  },
  deviceName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: Colors.text,
    marginTop: 2,
  },
  tagline: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  btSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  btBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btBarConnected: {
    borderColor: Colors.accent + "40",
  },
  btLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  btIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btTextCol: {
    flex: 1,
  },
  btLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  btSub: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  btError: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: Colors.stop,
    marginTop: 2,
  },
  btAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  gradesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  gradeButton: {
    marginBottom: 12,
    borderRadius: 18,
    overflow: "hidden",
  },
  gradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  gradeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  gradeTextContainer: {
    flex: 1,
  },
  gradeLabel: {
    fontFamily: "Poppins_700Bold",
    fontSize: 19,
    color: "#fff",
  },
  gradeSubLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
});
