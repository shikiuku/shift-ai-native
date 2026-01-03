
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
    const displayVal = (n: number) => {
        if (n === 0) return '';
        if (isNaN(n)) return '';
        return n.toString();
    };

    return (
        <View style={styles.countInputGroup}>
            <Text style={styles.countLabel}>必要人数</Text>
            <View style={styles.inputsRow}>
                <TextInput
                    keyboardType="numeric"
                    value={displayVal(minStaff)}
                    onChangeText={onMinChange}
                    style={styles.countInput}
                    placeholder="0"
                    placeholderTextColor="#cbd5e1"
                />
                <Text style={styles.separator}>〜</Text>
                <TextInput
                    keyboardType="numeric"
                    value={displayVal(maxStaff)}
                    onChangeText={onMaxChange}
                    style={styles.countInput}
                    placeholder="0"
                    placeholderTextColor="#cbd5e1"
                />
                <Text style={styles.unitText}>人</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    countInputGroup: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#f0f4f0',
        padding: 10,
        borderRadius: 12,
        gap: 6,
    },
    countLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    inputsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countInput: {
        backgroundColor: '#f8fafc',
        width: 60,
        textAlign: 'center',
        fontWeight: '900',
        borderRadius: 8,
        paddingVertical: 6,
        color: '#1e293b',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    separator: {
        color: '#cbd5e1',
        fontWeight: 'bold',
    },
    unitText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: 'bold',
    }
});

export default CountInputGroup;
