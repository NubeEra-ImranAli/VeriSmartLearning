import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { grades, Project } from "@/constants/data";

function ProjectCard({
  project,
  gradeId,
  gradeColor,
  index,
}: {
  project: Project;
  gradeId: number;
  gradeColor: string;
  index: number;
}) {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/project/[gradeId]/[projectId]",
      params: {
        gradeId: gradeId.toString(),
        projectId: project.id.toString(),
      },
    });
  };

  return (
    <Animated.View
      entering={
        Platform.OS !== "web"
          ? FadeInDown.delay(100 + index * 80).springify()
          : undefined
      }
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.projectCard,
          {
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={[styles.projectNumber, { backgroundColor: gradeColor + "25" }]}>
          <Text style={[styles.projectNumberText, { color: gradeColor }]}>
            {project.id}
          </Text>
        </View>
        <View style={styles.projectInfo}>
          <Text style={styles.projectName} numberOfLines={2}>
            {project.name}
          </Text>
          <Text style={styles.projectCommand}>
            Command: {project.command}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.textMuted}
        />
      </Pressable>
    </Animated.View>
  );
}

export default function GradeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const gradeId = parseInt(id || "1", 10);
  const grade = grades.find((g) => g.id === gradeId);

  if (!grade) {
    return (
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <Text style={styles.errorText}>Grade not found</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Project; index: number }) => (
    <ProjectCard
      project={item}
      gradeId={gradeId}
      gradeColor={grade.color}
      index={index}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Animated.View
        entering={
          Platform.OS !== "web" ? FadeInLeft.delay(50).springify() : undefined
        }
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => {
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
            <LinearGradient
              colors={[grade.color, grade.colorDark]}
              style={styles.headerBadge}
            >
              <Ionicons
                name={
                  (grade.icon as keyof typeof Ionicons.glyphMap) || "school"
                }
                size={18}
                color="#fff"
              />
            </LinearGradient>
            <Text style={styles.headerTitle}>{grade.label}</Text>
          </View>
          <View style={styles.backButton} />
        </View>
      </Animated.View>

      <Text style={styles.subtitle}>
        {grade.projects.length} Projects Available
      </Text>

      <FlatList
        data={grade.projects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPadding + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={grade.projects.length > 0}
      />
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
    gap: 10,
  },
  headerBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  projectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  projectNumber: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  projectNumberText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },
  projectInfo: {
    flex: 1,
    marginRight: 8,
  },
  projectName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  projectCommand: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  errorText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});
