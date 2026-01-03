
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';

interface Props {
    startTime: number;
    endTime: number;
    onStartTimeChange: (val: string) => void;
    onEndTimeChange: (val: string) => void;
    onDelete?: () => void;
    showDelete?: boolean;
}

const TimeInputGroup: React.FC<Props> = ({
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
    onDelete,
    showDelete
}) => {
    // 文字をそのまま表示し、0はプレースホルダーに任せる
    const displayVal = (n: number) => {
        if (n === 0) return '';
        if (isNaN(n)) return '';
        return n.toString();
    };

    return (
        <View style={styles.timeInputGroup}>
            <View style={styles.iconArea}>
                <Clock size={16} color="#2d5a27" style={{ opacity: 0.4 }} />
                <Text style={styles.groupLabel}>時間帯</Text>
            </View>
            <View style={styles.inputsRow}>
                <TextInput
                    keyboardType="numeric"
                    value={displayVal(startTime)}
                    onChangeText={onStartTimeChange}
                    style={styles.timeInput}
                    placeholder="0"
                    placeholderTextColor="#cbd5e1"
                />
                <Text style={styles.separator}>〜</Text>
                <TextInput
                    keyboardType="numeric"
                    value={displayVal(endTime)}
                    onChangeText={onEndTimeChange}
                    style={styles.timeInput}
                    placeholder="0"
                    placeholderTextColor="#cbd5e1"
                />
                {showDelete && onDelete && (
                    <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                        <Trash2 size={16} color="#f87171" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    timeInputGroup: {
        flexDirection: 'column',
        backgroundColor: '#f0f4f0',
        padding: 10,
        borderRadius: 12,
        gap: 6,
    },
    iconArea: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    groupLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#2d5a27',
        opacity: 0.6,
    },
    inputsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeInput: {
        backgroundColor: '#fff',
        width: 60,
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 8,
        paddingVertical: 6,
        color: '#1e293b',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    separator: {
        color: '#2d5a27',
        fontWeight: 'bold',
        opacity: 0.3,
    },
    deleteBtn: {
        marginLeft: 'auto',
        padding: 6,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
    }
});

export default TimeInputGroup;
