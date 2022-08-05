import { StyleSheet, Text, View } from 'react-native';

type TotalProps = {
  value: number;
  currency: string;
};

export default function Total({ value, currency }: TotalProps) {
  return (
    <View style={styles.totalContainer}>
      <View style={styles.total}>
        <Text style={styles.totalText}>Total Expenses</Text>
        <Text style={styles.totalSum}>
          {value} {currency}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  totalContainer: {
    paddingHorizontal: 16,
    width: '100%',
  },

  total: {
    marginBottom: 20,
    height: 110,
    backgroundColor: '#F2F2F7',
    borderRadius: 13,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  totalText: {
    fontSize: 17,
    height: 42,
    lineHeight: 22,
    color: '#C7C7CC',
  },
  totalSum: {
    height: 42,
    fontWeight: '700',
    fontSize: 34,
    lineHeight: 41,
  },
});
