import { View } from 'react-native';

function Bar({ width, height = 12 }: { width: number | `${number}%`; height?: number }) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 6,
        backgroundColor: '#F0F0F0',
      }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <View style={{ marginTop: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 14, padding: 14, gap: 8 }}>
          <Bar width={80} />
          <Bar width={110} height={20} />
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 14, padding: 14, gap: 8 }}>
          <Bar width={70} />
          <Bar width={90} height={20} />
        </View>
      </View>
      {[0, 1, 2].map((row) => (
        <View
          key={row}
          style={{
            borderWidth: 1,
            borderColor: '#F0F0F0',
            borderRadius: 12,
            padding: 14,
            gap: 8,
          }}
        >
          <Bar width="60%" />
          <Bar width="35%" />
        </View>
      ))}
    </View>
  );
}

export function ListSkeleton() {
  return (
    <View style={{ marginTop: 16, gap: 10 }}>
      {[0, 1, 2, 3].map((row) => (
        <View
          key={row}
          style={{
            borderWidth: 1,
            borderColor: '#F0F0F0',
            borderRadius: 12,
            padding: 14,
            gap: 8,
          }}
        >
          <Bar width="55%" />
          <Bar width="30%" />
        </View>
      ))}
    </View>
  );
}

export function friendlyError() {
  return 'Something went wrong. Check your connection and try again.';
}
