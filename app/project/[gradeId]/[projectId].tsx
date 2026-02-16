import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { grades, STOP_COMMAND } from "@/constants/data";

function PulsingDot({ color, isActive }: { color: string; isActive: boolean }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 600, easing: Easing.ease }),
          withTiming(1, { duration: 600, easing: Easing.ease })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isActive ? 1 : 0.3,
  }));

  return (
    <Animated.View
      style={[
        styles.statusDot,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

export default function ProjectScreen() {
  const { gradeId, projectId } = useLocalSearchParams<{
    gradeId: string;
    projectId: string;
  }>();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const [isExecuting, setIsExecuting] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const gId = parseInt(gradeId || "1", 10);
  const pId = parseInt(projectId || "1", 10);
  const grade = grades.find((g) => g.id === gId);
  const project = grade?.projects.find((p) => p.id === pId);

  const sendBluetoothCommand = useCallback(
    (command: string) => {
      setLastCommand(command);
      const message =
        command === STOP_COMMAND
          ? `STOP command sent: ${command}`
          : `Execute command sent: ${command}`;

      if (Platform.OS === "web") {
        console.log(`[BT Command] ${message}`);
      } else {
        Alert.alert(
          command === STOP_COMMAND ? "Stopped" : "Executing",
          `Bluetooth command: ${command}`,
          [{ text: "OK" }]
        );
      }
    },
    []
  );

  const handleToggle = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    if (isExecuting) {
      sendBluetoothCommand(STOP_COMMAND);
      setIsExecuting(false);
    } else {
      if (project) {
        sendBluetoothCommand(project.command);
        setIsExecuting(true);
      }
    }
  }, [isExecuting, project, sendBluetoothCommand]);

  if (!grade || !project) {
    return (
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Animated.View
        entering={
          Platform.OS !== "web" ? FadeInUp.delay(50).springify() : undefined
        }
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => {
              if (isExecuting) {
                sendBluetoothCommand(STOP_COMMAND);
                setIsExecuting(false);
              }
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              router.back();
            }}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={26} color={Colors.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerGrade}>{grade.label}</Text>
            <View style={styles.headerDivider} />
            <Text style={styles.headerProject}>Project {project.id}</Text>
          </View>
          <View style={styles.backButton} />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding + 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={
            Platform.OS !== "web"
              ? FadeInDown.delay(100).springify()
              : undefined
          }
        >
          <LinearGradient
            colors={[grade.color + "20", grade.colorDark + "10"]}
            style={styles.titleCard}
          >
            <View
              style={[
                styles.titleIconBg,
                { backgroundColor: grade.color + "30" },
              ]}
            >
              <Ionicons
                name={
                  (grade.icon as keyof typeof Ionicons.glyphMap) || "school"
                }
                size={28}
                color={grade.color}
              />
            </View>
            <Text style={styles.projectTitle}>{project.name}</Text>
            <View style={styles.commandBadge}>
              <Ionicons
                name="bluetooth"
                size={14}
                color={Colors.accent}
              />
              <Text style={styles.commandText}>
                Command: {project.command}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          entering={
            Platform.OS !== "web"
              ? FadeInDown.delay(200).springify()
              : undefined
          }
        >
          <Text style={styles.sectionLabel}>Procedure</Text>
          <View style={styles.procedureCard}>
            {project.procedure.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <View key={i} style={styles.spacer} />;

              const isStep = /^\d+\./.test(trimmed);
              const isHeader =
                trimmed.startsWith("Components:") ||
                trimmed.startsWith("Steps:");

              return (
                <View
                  key={i}
                  style={[
                    styles.procedureLine,
                    isStep && styles.stepLine,
                  ]}
                >
                  {isStep && (
                    <View
                      style={[
                        styles.stepDot,
                        { backgroundColor: grade.color },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      isHeader
                        ? styles.procedureHeader
                        : isStep
                        ? styles.stepText
                        : styles.procedureText,
                    ]}
                  >
                    {trimmed}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {lastCommand && (
          <Animated.View
            entering={
              Platform.OS !== "web"
                ? FadeInDown.delay(50).springify()
                : undefined
            }
          >
            <View style={styles.logCard}>
              <Ionicons
                name="terminal"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.logText}>
                Last command: {lastCommand}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <Animated.View
        entering={
          Platform.OS !== "web"
            ? FadeInDown.delay(300).springify()
            : undefined
        }
        style={[styles.bottomBar, { paddingBottom: bottomPadding + 16 }]}
      >
        <View style={styles.statusRow}>
          <PulsingDot
            color={isExecuting ? Colors.execute : Colors.textMuted}
            isActive={isExecuting}
          />
          <Text
            style={[
              styles.statusText,
              { color: isExecuting ? Colors.execute : Colors.textSecondary },
            ]}
          >
            {isExecuting ? "Running" : "Ready"}
          </Text>
        </View>

        <Pressable
          onPress={handleToggle}
          style={({ pressed }) => [
            styles.toggleButton,
            {
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <LinearGradient
            colors={
              isExecuting
                ? [Colors.stop, "#CC2233"]
                : [Colors.execute, "#00A388"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.toggleGradient}
          >
            <Ionicons
              name={isExecuting ? "stop" : "play"}
              size={26}
              color="#fff"
            />
            <Text style={styles.toggleText}>
              {isExecuting ? "Stop" : "Execute"}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerGrade: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  headerProject: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  titleCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  titleIconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  projectTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 12,
  },
  commandBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  commandText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: Colors.accent,
  },
  sectionLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  procedureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  procedureLine: {
    marginBottom: 6,
  },
  stepLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 4,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
  procedureText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  procedureHeader: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 4,
  },
  stepText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    flex: 1,
  },
  spacer: {
    height: 8,
  },
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    justifyContent: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
  },
  toggleButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  toggleGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
  },
  toggleText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#fff",
  },
  errorText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});
