import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { queueStore } from '../store/queue.store';

interface Props {
  isOnline: boolean;
}

/**
 * Shown at the top of the screen when the device is offline.
 * Also shows how many actions are queued for sync.
 */
export function OfflineBanner({ isOnline }: Props) {
  if (isOnline) return null;

  const queueSize = queueStore.getSize();

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        📵 Offline Mode
        {queueSize > 0 ? ` — ${queueSize} action${queueSize !== 1 ? 's' : ''} queued` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 13,
  },
});
