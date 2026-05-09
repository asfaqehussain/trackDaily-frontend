import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useAuth } from "../../hooks/useAuth";
import { authStore } from "../../store/auth.store";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { AppCheckbox } from "../../components/AppCheckbox";
import { Icon } from "../../components/Icon";
import { GradientCard } from "../../components/GradientCard";
import {
  Colors,
  BorderRadius,
  Spacing,
  Typography,
  Shadows,
} from "../../theme";
import { CommonStyles } from "../../theme/common.styles";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

/** DEV ONLY — bypass auth by injecting a mock verified user into MMKV store */
function mockLogin() {
  authStore.setToken("dev-bypass-token-2025");
  authStore.setUser({
    id: "dev-001",
    name: "Dev User",
    email: "dev@app.com",
    isVerified: true,
  });
}

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const insets = useSafeAreaInsets();

  const { loginMutation } = useAuth();

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation", "Email and password are required.");
      return;
    }
    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            {
              text: "Go to Verification",
              onPress: () => navigation.navigate("EmailVerification"),
            },
            { text: "OK" },
          ],
        );
      } else {
        Alert.alert(
          "Login Failed",
          error?.response?.data?.message ?? "Invalid credentials.",
        );
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* App logo */}
        <GradientCard colors={Colors.gradientPurple} style={styles.logoCard}>
          <Icon name="trendUp" size={28} color="#fff" />
        </GradientCard>

        {/* Header */}
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to keep your streaks alive.</Text>

        {/* Email */}
        <Text style={CommonStyles.fieldLabel}>Email</Text>
        <AppInput
          icon="mail"
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          returnKeyType="next"
          testID="login-email-input"
        />

        {/* Password */}
        <Text style={CommonStyles.fieldLabel}>Password</Text>
        <AppInput
          icon="lock"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          rightIcon={showPassword ? "eyeOff" : "eye"}
          onRightIconPress={() => setShowPassword((v) => !v)}
          testID="login-password-input"
        />

        {/* Remember me + Forgot */}
        <View style={styles.rememberRow}>
          <AppCheckbox
            checked={rememberMe}
            onToggle={() => setRememberMe((v) => !v)}
            label="Remember me"
          />
        </View>

        {/* Spacer before button */}
        <View style={{ flex: 1, minHeight: 32 }} />

        {/* CTA */}
        <AppButton
          label="Log in"
          icon="arrowRight"
          onPress={handleLogin}
          loading={loginMutation.isPending}
          testID="login-submit-btn"
        />

        {/* DEV bypass */}
        <TouchableOpacity
          style={styles.bypassBtn}
          onPress={mockLogin}
          testID="dev-bypass-btn"
        >
          <Text style={styles.bypassTxt}>Continue as guest →</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={CommonStyles.footerRow}>
          <Text style={CommonStyles.footerTxt}>New here? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            testID="goto-signup-btn"
          >
            <Text style={CommonStyles.footerLink}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  scroll: { flexGrow: 1, padding: Spacing.xl },

  // App logo
  logoCard: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    lineHeight: 38,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },

  // Remember me row
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  forgotTxt: {
    ...Typography.smallMedium,
    color: Colors.primary,
    fontWeight: "700",
  },
  // Dev bypass
  bypassBtn: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  bypassTxt: {
    ...Typography.small,
    color: Colors.textMuted,
    textDecorationLine: "underline",
  },
});
