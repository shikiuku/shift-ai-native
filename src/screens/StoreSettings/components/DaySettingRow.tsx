
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Plus, Copy } from 'lucide-react-native';
import { 曜日設定, 時間範囲 } from '../../../logic/types';
import TimeInputGroup from './TimeInputGroup';
import CountInputGroup from './CountInputGroup';

interface Props {
    setting: 曜日設定;
    onUpdate: (newSetting: 曜日設定) => void;
    onApplyToAll: () => void;
}

const DaySettingRow: React.FC<Props> = ({ setting, onUpdate, onApplyToAll }) => {
    const updateSlot = (sIdx: number, key: keyof 時間範囲, val: string) => {
        const newSetting = { ...setting };
        const slots = [...newSetting.営業時間帯];
        slots[sIdx] = {
            ...slots[sIdx],
            [key]: val === '' ? 0 : parseInt(val) || 0
        };
        newSetting.営業時間帯 = slots;
        onUpdate(newSetting);
    };

    const toggleClosed = () => {
        onUpdate({ ...setting, 定休日: !setting.定休日 });
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
        <View style={[styles.row, setting.定休日 && styles.rowClosed]}>
            <View style={styles.rowHeader}>
                <View style={styles.titleArea}>
                    <Text style={styles.dayLabel}>{setting.曜日}</Text>
                    <View style={styles.statusArea}>
                        <Text style={[styles.statusText, setting.定休日 && styles.statusTextClosed]}>
                            {setting.定休日 ? '定休日' : '営業日'}
                        </Text>
                        <Switch
                            value={!setting.定休日}
                            onValueChange={toggleClosed}
                            trackColor={{ false: '#cbd5e1', true: '#cddc39' }}
                            thumbColor={!setting.定休日 ? '#2d5a27' : '#f4f3f4'}
                            ios_backgroundColor="#cbd5e1"
                        />
                    </View>
                </View>

                {!setting.定休日 && (
                    <View style={styles.headerBtns}>
                        <TouchableOpacity onPress={onApplyToAll} style={styles.applyAllBtn}>
                            <Copy size={14} color="#2d5a27" />
                            <Text style={styles.applyAllText}>全曜日に適用</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addSlot} style={styles.addSlotBtn}>
                            <Plus size={16} color="#2d5a27" />
                            <Text style={styles.addSlotText}>追加</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {!setting.定休日 ? (
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
            ) : (
                <View style={styles.closedInfo}>
                    <Text style={styles.closedInfoText}>この曜日はシフトを生成しません</Text>
                </View>
            )}
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
    rowClosed: {
        backgroundColor: '#f8fafc',
        borderColor: '#f1f5f9',
        opacity: 0.8,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
        gap: 12,
    },
    titleArea: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusArea: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2d5a27',
    },
    statusTextClosed: {
        color: '#94a3b8',
    },
    headerBtns: {
        flexDirection: 'row',
        gap: 8,
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
    applyAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    applyAllText: {
        fontSize: 10,
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
    },
    closedInfo: {
        padding: 12,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        alignItems: 'center',
    },
    closedInfoText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: 'bold',
    }
});

export default DaySettingRow;
