
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { スタッフ勤務設定 } from '../../../logic/types';

interface Props {
    schedule: スタッフ勤務設定[];
    onToggle: (index: number) => void;
}

const StaffScheduleGrid: React.FC<Props> = ({ schedule, onToggle }) => {
    return (
        <View style={styles.scheduleGrid}>
            {schedule.map((config, cIdx) => (
                <View key={config.曜日} style={styles.scheduleRow}>
                    <Text style={styles.dayText}>{config.曜日.slice(0, 1)}</Text>
                    <TouchableOpacity
                        style={[styles.toggle, config.出勤可能 ? styles.toggleOn : styles.toggleOff]}
                        onPress={() => onToggle(cIdx)}
                    >
                        <Text style={[styles.toggleText, config.出勤可能 && styles.toggleTextOn]}>
                            {config.出勤可能 ? '可' : '不可'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    scheduleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    scheduleRow: {
        alignItems: 'center',
        gap: 4,
    },
    dayText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b',
    },
    toggle: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    toggleOn: {
        backgroundColor: '#2d5a27',
        borderColor: '#2d5a27',
    },
    toggleOff: {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
    },
    toggleText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#cbd5e1',
    },
    toggleTextOn: {
        color: '#fff',
    },
});

export default StaffScheduleGrid;
