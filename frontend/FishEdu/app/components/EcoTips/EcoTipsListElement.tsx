
import { EcoTipsGetResponse } from "@/app/api/ecoTips"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { StyleSheet, Text, View } from "react-native"

type LocalProps = {
  ecoTip: EcoTipsGetResponse
  number: number
}

export default function EcoTipsListElement({
  ecoTip,
  number,
}: LocalProps) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.numberContainer}>
          <Text style={styles.number}>
            {number}
          </Text>
        </View>

        <Text style={styles.title}>
          {ecoTip.title}
        </Text>
      </View>

      <View style={styles.descriptionContainer}>
        {ecoTip.description?.split("\n").map((line, index) =>
          line.trim() ? (
            <Text
              key={index}
              style={styles.description}
            >
              {line}
            </Text>
          ) : (
            <View
              key={index}
              style={styles.paragraphGap}
            />
          )
        )}
      </View>
    </View>
  )
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      borderRadius: 20,
      padding: 18,
      gap: 14,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    numberContainer: {
      width: 38,
      height: 38,
      borderRadius: 13,
      backgroundColor: colors.background.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    number: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "800",
    },
    title: {
      flex: 1,
      color: colors.text.main,
      fontSize: 18,
      fontWeight: "700",
      lineHeight: 24,
    },
    descriptionContainer: {
      gap: 4,
    },
    description: {
      color: colors.text.muted,
      fontSize: 15,
      lineHeight: 23,
    },
    paragraphGap: {
      height: 8,
    },
  })
