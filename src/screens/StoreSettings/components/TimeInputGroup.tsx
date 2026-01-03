
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

interface Props {
    startTime: number;
    endTime: number;
    onStartTimeChange: (val: string) => void;
    onEndTimeChange: (val: string) => void;
}

const TimeInputGroup: React.FC<Props> = ({
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange
}) => {
    return (
        <View style={styles.timeInputGroup}>
            <Clock size={16} color="#2d5a27" style={{ opacity: 0.4 }} />
            <TextInput
                keyboardType="numeric"
                value={startTime.toString()}
                onChangeText={onStartTimeChange}
                style={styles.timeInput}
            />
            <Text style={styles.separator}>〜</Text>
            <TextInput
                keyboardType="numeric"
                value={endTime.toString()}
                onChangeText={onEndTimeChange}
                style={styles.timeInput}
            />
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
        width: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 6,
        paddingVertical: 4,
    },
    separator: {
        color: '#cbd5e1',
        fontWeight: 'bold',
    },
});

export default TimeInputGroup;
