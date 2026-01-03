
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { 曜日設定, 時間範囲 } from '../../../logic/types';
import TimeInputGroup from './TimeInputGroup';
import CountInputGroup from './CountInputGroup';

interface Props {
    setting: 曜日設定;
    onUpdate: (newSetting: 曜日設定) => void;
}

const DaySettingRow: React.FC<Props> = ({ setting, onUpdate }) => {
    const updateSlot = (sIdx: number, key: keyof 時間範囲, val: string) => {
        const newSetting = { ...setting };
        const slots = [...newSetting.営業時間帯];
        slots[sIdx] = {
            ...slots[sIdx],
            [key]: parseInt(val) || 0
        };
        newSetting.営業時間帯 = slots;
        onUpdate(newSetting);
    };

    const addSlot = () => {
        const newSetting = { ...setting };
        const lastSlot = newSetting.営業時間帯[newSetting.営業時間帯.length - 1];
        newSetting.営業時間帯 = [
            ...newSetting.営業時間帯,
            {
                開始: lastSlot ? lastSlot.終了 : 9,
                終了: lastSlot ? lastSlot.終了 + 4 : 18,
                最小人数: 1,
                最大人数: 3
            }
        ];
        onUpdate(newSetting);
    };

    const deleteSlot = (sIdx: number) => {
        const newSetting = { ...setting };
        newSetting.営業時間帯 = newSetting.営業時間帯.filter((_, i) => i !== sIdx);
        onUpdate(newSetting);
    };

    return (
        <View style={styles.row}>
            <View style={styles.rowHeader}>
                <Text style={styles.dayLabel}>{setting.曜日}</Text>
                <TouchableOpacity onPress={addSlot} style={styles.addSlotBtn}>
                    <Plus size={16} color="#2d5a27" />
                    <Text style={styles.addSlotText}>時間帯追加</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.slotsContainer}>
                {setting.営業時間帯.map((slot, sIdx) => (
                    <View key={sIdx} style={styles.slotBox}>
                        <TimeInputGroup
                            startTime={slot.開始}
                            endTime={slot.終了}
                            onStartTimeChange={(val) => updateSlot(sIdx, '開始', val)}
                            onEndTimeChange={(val) => updateSlot(sIdx, '終了', val)}
                            showDelete={setting.営業時間帯.length > 1}
                            onDelete={() => deleteSlot(sIdx)}
                        />

                        <CountInputGroup
                            minStaff={slot.最小人数}
                            maxStaff={slot.最大人数}
                            onMinChange={(val) => updateSlot(sIdx, '最小人数', val)}
                            onMaxChange={(val) => updateSlot(sIdx, '最大人数', val)}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#f0f4f0',
        gap: 12,
        marginBottom: 12,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1e293b',
    },
    addSlotBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f0f4f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    addSlotText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2d5a27',
    },
    slotsContainer: {
        gap: 12,
    },
    slotBox: {
        gap: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    }
});

export default DaySettingRow;
