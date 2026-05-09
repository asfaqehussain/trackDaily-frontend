import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface Props {
  total?: number;   // total dots to show (default 8)
  filled?: number;  // how many are filled
  color?: string;   // fill color
  size?: number;
}

/**
 * A row of dots showing habit progress (e.g. streak level).
 * Filled dots use the habit color; empty dots use the border color.
 */
export function ProgressDots({ total = 8, filled = 0, color = Colors.primary, size = 7 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: i < filled ? color : Colors.border,
              marginRight: 3,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {},
});
