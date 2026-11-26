import { useState } from "react";

import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import Container from "@/app/components/ui/Container";
import FeedbackModal, {
  type FeedbackModalDetail,
  type FeedbackModalVariant,
} from "@/app/components/ui/FeedbackModal";

import LanguageSetting from "@/app/components/Settings/LanguageSetting";
import ThemeSetting from "@/app/components/Settings/ThemeSetting";

import { AppColors } from "@/app/constants/theme";
import type { LanguageCode } from "@/app/constants/language";

import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";

import { getTranslation } from "@/app/utils/translation/getTranslation";

import {
  exportJournalBackup,
  importJournalBackup,
} from "@/app/services/journal/journalBackupService";


type FeedbackState = {
  variant: FeedbackModalVariant;
  title: string;
  message: string;
  details?: FeedbackModalDetail[];
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};


export default function Settings() {
  const { colors } = useTheme();
  const { languageCode } = useLanguage();

  const styles = createStyles(colors);

  return (
    <Container>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          {getTranslation("settings.title", languageCode)}
        </Text>

        <View style={styles.preferencesCard}>
          <LanguageSetting />

          <View style={styles.divider} />

          <ThemeSetting />
        </View>

        <JournalBackupSettings
          colors={colors}
          languageCode={languageCode}
        />
      </ScrollView>
    </Container>
  );
}


type JournalBackupSettingsProps = {
  colors: AppColors;
  languageCode: LanguageCode;
};


function JournalBackupSettings({
  colors,
  languageCode,
}: JournalBackupSettingsProps) {
  const [busyAction, setBusyAction] = useState<
    "export" | "import" | null
  >(null);

  const [feedback, setFeedback] = useState<FeedbackState | null>(
    null
  );

  const [pendingAction, setPendingAction] = useState<
    (() => void) | null
  >(null);

  const styles = createBackupStyles(colors);

  const doneLabel =
    languageCode === "pl"
      ? "Gotowe"
      : "Done";

  const understandLabel =
    languageCode === "pl"
      ? "Rozumiem"
      : "Understood";
  const handleFeedbackConfirm = () => {
  const action = feedback?.onConfirm;

  if (Platform.OS === "ios" && action) {
    setPendingAction(() => action);
    setFeedback(null);
    return;
  }

  setFeedback(null);
  action?.();
};


const handleFeedbackDismiss = () => {
  if (pendingAction === null) {
    return;
  }

  const action = pendingAction;

  setPendingAction(null);

  action();
};

  const handleExport = async () => {
    if (busyAction !== null) {
      return;
    }

    setBusyAction("export");

    try {
      const result = await exportJournalBackup();

      if (result === null) {
        return;
      }

      const saveMessage =
        result.savedTo === "device"
          ? `${getTranslation(
              "settings.backup.savedToDevice",
              languageCode
            )} (${result.directoryName})`
          : getTranslation(
              "settings.backup.savedToShare",
              languageCode
            );

      setFeedback({
        variant: "success",

        title: getTranslation(
          "settings.backup.exportSuccess",
          languageCode
        ),

        message: saveMessage,

        details: [
          {
            label: getTranslation(
              "settings.backup.file",
              languageCode
            ),
            value: result.fileName,
          },
          {
            label: getTranslation(
              "settings.backup.entries",
              languageCode
            ),
            value: result.entriesCount,
          },
          {
            label: getTranslation(
              "settings.backup.catches",
              languageCode
            ),
            value: result.catchesCount,
          },
          {
            label: getTranslation(
              "settings.backup.photos",
              languageCode
            ),
            value: result.photosCount,
          },
        ],

        confirmLabel: doneLabel,
      });
    } catch (error) {
      setFeedback({
        variant: "error",

        title: getTranslation(
          "settings.backup.exportError",
          languageCode
        ),

        message:
          error instanceof Error
            ? error.message
            : getTranslation(
                "settings.backup.exportErrorFallback",
                languageCode
              ),

        confirmLabel: understandLabel,
      });
    } finally {
      setBusyAction(null);
    }
  };


  const runImport = async () => {
    if (busyAction !== null) {
      return;
    }

    setBusyAction("import");

    try {
      const result = await importJournalBackup();

      if (result === null) {
        return;
      }

      setFeedback({
        variant: "success",

        title: getTranslation(
          "settings.backup.importSuccess",
          languageCode
        ),

        message: languageCode === "pl"
          ? "Dane dziennika zostały przywrócone."
          : "Journal data has been restored.",

        details: [
          {
            label: getTranslation(
              "settings.backup.restoredEntries",
              languageCode
            ),
            value: result.entriesCount,
          },
          {
            label: getTranslation(
              "settings.backup.restoredCatches",
              languageCode
            ),
            value: result.catchesCount,
          },
          {
            label: getTranslation(
              "settings.backup.restoredPhotos",
              languageCode
            ),
            value: result.photosCount,
          },
        ],

        confirmLabel: doneLabel,
      });
    } catch (error) {
      setFeedback({
        variant: "error",

        title: getTranslation(
          "settings.backup.importError",
          languageCode
        ),

        message:
          error instanceof Error
            ? error.message
            : getTranslation(
                "settings.backup.importErrorFallback",
                languageCode
              ),

        confirmLabel: understandLabel,
      });
    } finally {
      setBusyAction(null);
    }
  };


  const handleImport = () => {
    if (busyAction !== null) {
      return;
    }

    setFeedback({
      variant: "warning",

      title: getTranslation(
        "settings.backup.importConfirmTitle",
        languageCode
      ),

      message: getTranslation(
        "settings.backup.importConfirmMessage",
        languageCode
      ),

      confirmLabel: getTranslation(
        "settings.backup.confirmImport",
        languageCode
      ),

      cancelLabel: getTranslation(
        "settings.backup.cancel",
        languageCode
      ),

      onConfirm: () => {
        void runImport();
      },
    });
  };


  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {getTranslation(
          "settings.backup.title",
          languageCode
        )}
      </Text>

      <View style={styles.card}>
        <Pressable
          style={[
            styles.action,
            busyAction !== null && styles.disabled,
          ]}
          onPress={handleExport}
          disabled={busyAction !== null}
          accessibilityRole="button"
        >
          <View style={styles.iconCircle}>
            {busyAction === "export" ? (
              <ActivityIndicator
                color={colors.primary}
              />
            ) : (
              <Ionicons
                name="cloud-upload-outline"
                size={29}
                color={colors.primary}
              />
            )}
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              {getTranslation(
                "settings.backup.export",
                languageCode
              )}
            </Text>

            <Text style={styles.actionDescription}>
              {getTranslation(
                "settings.backup.exportDescription",
                languageCode
              )}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={23}
            color={colors.text.muted}
          />
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={[
            styles.action,
            busyAction !== null && styles.disabled,
          ]}
          onPress={handleImport}
          disabled={busyAction !== null}
          accessibilityRole="button"
        >
          <View style={styles.iconCircle}>
            {busyAction === "import" ? (
              <ActivityIndicator
                color={colors.primary}
              />
            ) : (
              <Ionicons
                name="cloud-download-outline"
                size={29}
                color={colors.primary}
              />
            )}
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              {getTranslation(
                "settings.backup.import",
                languageCode
              )}
            </Text>

            <Text style={styles.actionDescription}>
              {getTranslation(
                "settings.backup.importDescription",
                languageCode
              )}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={23}
            color={colors.text.muted}
          />
        </Pressable>
      </View>
        <FeedbackModal
          visible={feedback !== null}
          variant={feedback?.variant ?? "success"}
          title={feedback?.title ?? ""}
          message={feedback?.message ?? ""}
          details={feedback?.details}
          confirmLabel={feedback?.confirmLabel ?? doneLabel}
          cancelLabel={feedback?.cancelLabel}
          onClose={() => {
            setFeedback(null);
          }}
          onConfirm={handleFeedbackConfirm}
          onDismiss={handleFeedbackDismiss}
        />
    </View>
  );
}


const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: colors.background.app,
    },

    container: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 32,
      gap: 24,
    },

    pageTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text.main,
      marginBottom: 2,
    },

    preferencesCard: {
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.card,
      borderRadius: 18,
      paddingHorizontal: 16,
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border.subtle,
      marginLeft: 46,
    },
  });


const createBackupStyles = (colors: AppColors) =>
  StyleSheet.create({
    section: {
      gap: 12,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text.main,
    },

    card: {
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.card,
      borderRadius: 18,
      overflow: "hidden",
    },

    action: {
      minHeight: 88,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      gap: 14,
    },

    iconCircle: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: colors.background.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },

    actionContent: {
      flex: 1,
      gap: 4,
    },

    actionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text.main,
    },

    actionDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.text.muted,
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border.subtle,
      marginLeft: 84,
      marginRight: 16,
    },

    disabled: {
      opacity: 0.55,
    },
  });