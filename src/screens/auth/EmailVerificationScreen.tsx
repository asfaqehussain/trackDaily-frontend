import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'EmailVerification'>;
  route: RouteProp<AuthStackParamList, 'EmailVerification'>;
};

export function EmailVerificationScreen({ navigation, route }: Props) {
  const { resendVerificationMutation } = useAuth();
  const email = route.params?.email ?? '';

  async function handleResend() {
    if (!email) {
      Alert.alert('Error', 'No email address available. Please go back and sign up again.');
      return;
    }
    try {
      await resendVerificationMutation.mutateAsync(email);
      Alert.alert('Sent!', 'A new verification email has been sent.');
    } catch {
      Alert.alert('Error', 'Could not send verification email. Try again later.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>

      <Text style={styles.message}>
        We've sent a verification link to your email address.
        Please check your inbox (and spam folder) and click the link to activate your account.
      </Text>

      {email ? <Text style={styles.emailLabel}>{email}</Text> : null}

      <Text style={styles.note}>
        You won't be able to log in until your email is verified.
      </Text>

      {resendVerificationMutation.isPending ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <Button
          title="Resend Verification Email"
          onPress={handleResend}
          testID="resend-verification-btn"
        />
      )}

      {resendVerificationMutation.isSuccess ? (
        <Text style={styles.success}>Email sent! Check your inbox.</Text>
      ) : null}

      <View style={styles.footer}>
        <Button
          title="Back to Login"
          onPress={() => navigation.navigate('Login')}
          testID="back-to-login-btn"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  message: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  emailLabel: { fontSize: 16, fontWeight: '600', color: '#4B9EF5', marginBottom: 12, textAlign: 'center' },
  note: { fontSize: 14, marginBottom: 24, fontStyle: 'italic' },
  loader: { marginVertical: 16 },
  success: { color: 'green', marginTop: 12 },
  footer: { marginTop: 32 },
});
