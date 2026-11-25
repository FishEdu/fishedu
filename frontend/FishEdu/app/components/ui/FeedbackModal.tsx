
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";


export type FeedbackModalVariant =
  | "success"
  | "error"
  | "warning";

export type FeedbackModalDetail = {
  label: string;
  value: string | number;
};

type FeedbackModalProps = {
  visible: boolean;
  variant: FeedbackModalVariant;
  title: string;
  message: string;
  details?: FeedbackModalDetail[];
  confirmLabel: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
  onDismiss: () => void;
};


export default function FeedbackModal({
  visible,
  variant,
  title,
  message,
  details,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
  onDismiss,
}: FeedbackModalProps) {
  const { colors } = useTheme();

  const accentColor =
    variant === "success"
      ? colors.primary
      : colors.danger;

  const iconBackgroundColor =
    variant === "success"
      ? colors.background.primarySoft
      : colors.background.dangerSoft;

  const iconName =
    variant === "success"
      ? "checkmark-circle"
      : variant === "error"
        ? "alert-circle"
        : "warning";

  const styles = createStyles(
    colors,
    accentColor,
    iconBackgroundColor
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      onDismiss={onDismiss}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={iconName}
              size={34}
              color={accentColor}
            />
          </View>

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          {details && details.length > 0 && (
            <View style={styles.details}>
              {details.map((item, index) => (
                <View
                  key={`${item.label}-${index}`}
                  style={styles.detailRow}
                >
                  <Text style={styles.detailLabel}>
                    {item.label}
                  </Text>

                  <Text style={styles.detailValue}>
                    {String(item.value)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            {cancelLabel && (
              <Pressable
                style={[
                  styles.button,
                  styles.cancelButton,
                ]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>
                  {cancelLabel}
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.button,
                styles.confirmButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const createStyles = (
  colors: AppColors,
  accentColor: string,
  iconBackgroundColor: string
) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: "rgba(0, 0, 0, 0.48)",
    },

    backdrop: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    card: {
      width: "100%",
      maxWidth: 420,
      alignItems: "center",
      padding: 22,
      borderRadius: 24,
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.card,
    },

    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: iconBackgroundColor,
    },

    title: {
      marginTop: 16,
      fontSize: 20,
      fontWeight: "700",
      color: colors.text.main,
      textAlign: "center",
    },

    message: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: colors.text.muted,
      textAlign: "center",
    },

    details: {
      width: "100%",
      marginTop: 18,
      padding: 14,
      borderRadius: 14,
      backgroundColor: colors.background.app,
      gap: 12,
    },

    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },

    detailLabel: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: colors.text.muted,
    },

    detailValue: {
      flexShrink: 1,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "600",
      color: colors.text.main,
      textAlign: "right",
    },

    actions: {
      width: "100%",
      flexDirection: "row",
      marginTop: 22,
      gap: 10,
    },

    button: {
      flex: 1,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      borderRadius: 14,
    },

    cancelButton: {
      backgroundColor: colors.background.app,
      borderWidth: 1,
      borderColor: colors.border.subtle,
    },

    cancelButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text.main,
    },

    confirmButton: {
      backgroundColor: accentColor,
    },

    confirmButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text.onPrimary,
    },
  });
