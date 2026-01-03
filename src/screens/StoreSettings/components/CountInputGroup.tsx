
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
    minStaff: number;
    maxStaff: number;
    onMinChange: (val: string) => void;
    onMaxChange: (val: string) => void;
}

const CountInputGroup: React.FC<Props> = ({
    minStaff,
    maxStaff,
    onMinChange,
    onMaxChange
}) => {
    const displayVal = (n: number) => (n === 0 || isNaN(n) ? '' : n.toString());

    return (
        <View style={styles.countInputGroup}>
            <Text style={styles.countLabel}>必要人数</Text>
            <TextInput
                keyboardType="numeric"
                value={displayVal(minStaff)}
                onChangeText={onMinChange}
                style={styles.countInput}
                placeholder="0"
            />
            <Text style={styles.separator}>〜</Text>
            <TextInput
                keyboardType="numeric"
                value={displayVal(maxStaff)}
                onChangeText={onMaxChange}
                style={styles.countInput}
                placeholder="0"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    countInputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#f0f4f0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    countLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    countInput: {
        backgroundColor: '#f8fafc',
        width: 36,
        textAlign: 'center',
        fontWeight: '900',
        borderRadius: 6,
        paddingVertical: 2,
        color: '#1e293b',
    },
    separator: {
        color: '#cbd5e1',
        fontWeight: 'bold',
    },
});

export default CountInputGroup;
