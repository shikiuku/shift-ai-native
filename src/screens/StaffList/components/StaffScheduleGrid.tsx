
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Copy } from 'lucide-react-native';
import { スタッフ勤務設定, 時間範囲 } from '../../../logic/types';
import TimeInputGroup from '../../StoreSettings/components/TimeInputGroup';

interface Props {
    schedule: スタッフ勤務設定[];
    onToggle: (index: number) => void;
    onUpdateRange: (dayIdx: number, rangeIdx: number, key: keyof 時間範囲, val: string) => void;
    onApplyToAll: (dayIdx: number) => void;
}

const StaffScheduleGrid: React.FC<Props> = ({ schedule, onToggle, onUpdateRange, onApplyToAll }) => {
    return (
        <View style={styles.container}>
            {schedule.map((config, cIdx) => (
                <View key={config.曜日} style={[styles.dayRow, !config.出勤可能 && styles.dayRowOff]}>
                    <View style={styles.rowHeader}>
                        <View style={styles.dayInfo}>
                            <Text style={styles.dayText}>{config.曜日}</Text>
                            <Switch
                                value={config.出勤可能}
                                onValueChange={() => onToggle(cIdx)}
                                trackColor={{ false: '#cbd5e1', true: '#cddc39' }}
                                thumbColor={config.出勤可能 ? '#2d5a27' : '#f4f3f4'}
                                ios_backgroundColor="#cbd5e1"
                            />
                        </View>
                        {config.出勤可能 && (
                            <TouchableOpacity style={styles.copyBtn} onPress={() => onApplyToAll(cIdx)}>
                                <Copy size={14} color="#2d5a27" />
                                <Text style={styles.copyText}>全曜日に適用</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {config.出勤可能 && config.可能時間帯.map((range, rIdx) => (
                        <View key={rIdx} style={styles.timeArea}>
                            <TimeInputGroup
                                startTime={range.開始}
                                endTime={range.終了}
                                onStartTimeChange={(val) => onUpdateRange(cIdx, rIdx, '開始', val)}
                                onEndTimeChange={(val) => onUpdateRange(cIdx, rIdx, '終了', val)}
                                showDelete={false}
                            />
                        </View>
                    ))}

                    {!config.出勤可能 && (
                        <Text style={styles.offText}>この曜日はお休みです</Text>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    dayRow: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 8,
    },
    dayRowOff: {
        opacity: 0.6,
        backgroundColor: '#f1f5f9',
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dayText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e293b',
        width: 60,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    copyText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2d5a27',
    },
    timeArea: {
        marginTop: 4,
    },
    offText: {
        fontSize: 11,
        color: '#94a3b8',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 4,
    }
});

export default StaffScheduleGrid;
