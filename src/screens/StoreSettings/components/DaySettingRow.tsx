
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

    const updateAllSlots = (newSlots: 時間範囲[]) => {
        onUpdate({ ...setting, 営業時間帯: newSlots });
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
        <View className={`p-4 bg-white rounded-2xl border-2 border-[#f0f4f0] mb-3 ${setting.定休日 ? 'bg-slate-50 border-slate-100 opacity-80' : ''}`}>
            <View className="flex-row justify-between items-center mb-2 flex-wrap gap-3">
                <View className="flex-row items-center gap-3">
                    <Text className="text-lg font-black text-slate-800">{setting.曜日}</Text>
                    <View className="flex-row items-center gap-2 bg-[#f8faf9] px-2 py-1 rounded-full border border-slate-200">
                        <Text className={`text-[10px] font-bold ${setting.定休日 ? 'text-slate-400' : 'text-[#2d5a27]'}`}>
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
                    <View className="flex-row gap-2">
                        <TouchableOpacity onPress={onApplyToAll} className="flex-row items-center gap-1 bg-[#e8f5e9] px-2 py-1 rounded-md border border-[#c8e6c9]">
                            <Copy size={14} color="#2d5a27" />
                            <Text className="text-[10px] font-bold text-[#2d5a27]">全曜日に適用</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={addSlot} className="flex-row items-center gap-1 bg-[#f0f4f0] px-2 py-1 rounded-md">
                            <Plus size={16} color="#2d5a27" />
                            <Text className="text-xs font-bold text-[#2d5a27]">追加</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>



            {!setting.定休日 ? (
                <View className="gap-3">
                    {setting.営業時間帯.map((slot, sIdx) => (
                        <View key={sIdx} className="gap-2 pt-3 border-t border-slate-100">
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
                <View className="p-3 bg-slate-100 rounded-xl items-center">
                    <Text className="text-xs text-slate-500 font-bold">この曜日はシフトを生成しません</Text>
                </View>
            )}
        </View>
    );
};

export default DaySettingRow;
