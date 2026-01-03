
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
    // 0やNaNを空文字として表示することで入力しやすくする
    const displayVal = (n: number) => (n === 0 || isNaN(n) ? '' : n.toString());

    return (
        <View style={styles.timeInputGroup}>
            <Clock size={16} color="#2d5a27" style={{ opacity: 0.4 }} />
            <TextInput
                keyboardType="numeric"
                value={displayVal(startTime)}
                onChangeText={onStartTimeChange}
                style={styles.timeInput}
                placeholder="0"
            />
            <Text style={styles.separator}>〜</Text>
            <TextInput
                keyboardType="numeric"
                value={displayVal(endTime)}
                onChangeText={onEndTimeChange}
                style={styles.timeInput}
                placeholder="0"
            />
            {showDelete && onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                    <Trash2 size={16} color="#f87171" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    timeInputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f4f0',
        padding: 8,
        borderRadius: 12,
        gap: 8,
    },
    timeInput: {
        backgroundColor: '#fff',
        width: 44,
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 6,
        paddingVertical: 4,
        color: '#1e293b',
    },
    separator: {
        color: '#cbd5e1',
        fontWeight: 'bold',
    },
    deleteBtn: {
        marginLeft: 'auto',
        padding: 4,
    }
});

export default TimeInputGroup;
