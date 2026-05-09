import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../hooks/useAuth';
import { authStore } from '../../store/auth.store';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { AppCheckbox } from '../../components/AppCheckbox';
import { Icon } from '../../components/Icon';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';
import { CommonStyles } from '../../theme/common.styles';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

/** DEV ONLY — bypass auth by injecting a mock verified user */
function mockLogin() {
  authStore.setToken('dev-bypass-token-2025');
  authStore.setUser({ id: 'dev-001', name: 'Dev User', email: 'dev@app.com', isVerified: true });
}

function getPasswordStrength(pw: string): number {
  if (pw.length === 0) return 0;
  if (pw.length < 6) return 1;
  if (pw.length < 10) return 2;
  return 3;
}

const STRENGTH_COLORS = ['#E0E0E0', '#F5A07A', '#F5C842', Colors.primary];

export function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const insets = useSafeAreaInsets();

  const { signupMutation } = useAuth();
  const strength = getPasswordStrength(password);

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation', 'All fields are required.'); return;
    }
    if (!agreed) {
      Alert.alert('Terms', 'Please agree to the Terms and Privacy Policy.'); return;
    }
    if (password.length < 8) {
      Alert.alert('Validation', 'Password must be at least 8 characters.'); return;
    }
    try {
      await signupMutation.mutateAsync({ name: name.trim(), email: email.trim(), password });
      navigation.navigate('EmailVerification', { email: email.trim() });
    } catch (error: any) {
      Alert.alert('Signup Failed', error?.response?.data?.message ?? 'Could not create account.');
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="back" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start tracking in 30 seconds.</Text>

        {/* Full name */}
        <Text style={CommonStyles.fieldLabel}>Full name</Text>
        <AppInput
          icon="user"
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
          autoComplete="name"
          returnKeyType="next"
          testID="signup-name-input"
        />

        {/* Email */}
        <Text style={CommonStyles.fieldLabel}>Email</Text>
        <AppInput
          icon="mail"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          returnKeyType="next"
          testID="signup-email-input"
        />

        {/* Password */}
        <Text style={CommonStyles.fieldLabel}>Password</Text>
        <AppInput
          icon="lock"
          placeholder="8+ characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoComplete="new-password"
          returnKeyType="done"
          rightIcon={showPassword ? 'eyeOff' : 'eye'}
          onRightIconPress={() => setShowPassword((v) => !v)}
          testID="signup-password-input"
        />

        {/* Password strength bar */}
        {password.length > 0 && (
          <View style={styles.strengthRow}>
            {[1, 2, 3].map((level) => (
              <View
                key={level}
                style={[
                  styles.strengthBar,
                  { backgroundColor: strength >= level ? STRENGTH_COLORS[strength] : Colors.border },
                ]}
              />
            ))}
          </View>
        )}

        {/* Terms */}
        <AppCheckbox
          checked={agreed}
          onToggle={() => setAgreed((v) => !v)}
          label={
            <Text style={styles.termsText}>
              {'I agree to the '}
              <Text style={styles.termsLink}>Terms</Text>
              {' and '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
              {'.'}
            </Text>
          }
        />

        {/* CTA */}
        <AppButton
          label="Create account"
          icon="arrowRight"
          onPress={handleSignup}
          loading={signupMutation.isPending}
          testID="signup-submit-btn"
        />

        {/* DEV bypass */}
        <TouchableOpacity style={styles.bypassBtn} onPress={mockLogin} testID="dev-bypass-btn">
          <Text style={styles.bypassTxt}>Continue as guest →</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={CommonStyles.footerRow}>
          <Text style={CommonStyles.footerTxt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} testID="goto-login-btn">
            <Text style={CommonStyles.footerLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, padding: Spacing.xl },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 32, fontWeight: '800', color: Colors.textPrimary,
    marginBottom: Spacing.xs, lineHeight: 38,
  },
  subtitle: {
    ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.xxxl,
  },
  strengthRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  termsText: { ...Typography.small, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
  termsLink: { color: Colors.primary, fontWeight: '600' },
  // Dev bypass
  bypassBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  bypassTxt: {
    ...Typography.small,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
