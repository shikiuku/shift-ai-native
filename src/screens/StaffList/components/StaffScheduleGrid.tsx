
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Copy, Plus } from 'lucide-react-native';
import { スタッフ勤務設定, 時間範囲 } from '../../../logic/types';
import TimeInputGroup from '../../StoreSettings/components/TimeInputGroup';


interface Props {
    schedule: スタッフ勤務設定[];
    onToggle: (index: number) => void;
    onUpdateAllSlots: (dayIdx: number, newSlots: 時間範囲[]) => void;
    onUpdateRange: (dayIdx: number, rangeIdx: number, key: keyof 時間範囲, val: string) => void;
    onAddSlot: (dayIdx: number) => void;
    onDeleteSlot: (dayIdx: number, rangeIdx: number) => void;
    onApplyToAll: (dayIdx: number) => void;
}

const StaffScheduleGrid: React.FC<Props> = ({
    schedule,
    onToggle,
    onUpdateAllSlots,
    onUpdateRange,
    onAddSlot,
    onDeleteSlot,
    onApplyToAll
}) => {
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
                            <View style={styles.headerBtns}>
                                <TouchableOpacity style={styles.copyBtn} onPress={() => onApplyToAll(cIdx)}>
                                    <Copy size={12} color="#2d5a27" />
                                    <Text style={styles.btnText}>全曜日に適用</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.addBtn} onPress={() => onAddSlot(cIdx)}>
                                    <Plus size={14} color="#2d5a27" />
                                    <Text style={styles.btnText}>追加</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>



                    {config.出勤可能 && (
                        <View style={styles.slotsList}>
                            {config.可能時間帯.map((range, rIdx) => (
                                <View key={rIdx} style={styles.timeArea}>
                                    <TimeInputGroup
                                        startTime={range.開始}
                                        endTime={range.終了}
                                        onStartTimeChange={(val) => onUpdateRange(cIdx, rIdx, '開始', val)}
                                        onEndTimeChange={(val) => onUpdateRange(cIdx, rIdx, '終了', val)}
                                        showDelete={config.可能時間帯.length > 1}
                                        onDelete={() => onDeleteSlot(cIdx, rIdx)}
                                    />
                                </View>
                            ))}
                        </View>
                    )}

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
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    dayRowOff: {
        backgroundColor: '#f8fafc',
        opacity: 0.7,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
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
        width: 50,
    },
    visualization: {
        marginVertical: 4,
        paddingHorizontal: 4,
    },
    headerBtns: {
        flexDirection: 'row',
        gap: 6,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f0f4f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    btnText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2d5a27',
    },
    slotsList: {
        gap: 8,
        marginTop: 4,
    },
    timeArea: {
        marginTop: 2,
    },
    offText: {
        fontSize: 11,
        color: '#94a3b8',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        marginTop: 4,
    }
});

export default StaffScheduleGrid;
