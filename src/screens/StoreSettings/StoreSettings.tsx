
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Settings2, Clock } from 'lucide-react-native';
import { 曜日設定, 曜日一覧 } from '../../logic/types';

interface Props {
    店舗スケジュール: 曜日設定[];
    set店舗スケジュール: (s: 曜日設定[]) => void;
}

import DaySettingRow from './components/DaySettingRow';

const StoreSettings: React.FC<Props> = ({ 店舗スケジュール, set店舗スケジュール }) => {
    return (
        <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <View className="bg-white rounded-3xl p-5 border border-slate-200">
                <View className="flex-row items-center gap-3 mb-6">
                    <Settings2 size={24} color="#2d5a27" />
                    <Text className="text-xl font-black text-[#2d5a27]">店舗・必要人数の設定</Text>
                </View>

                <View className="gap-3">
                    {店舗スケジュール.map((s, sIdx) => (
                        <DaySettingRow
                            key={s.曜日}
                            setting={s}
                            onUpdate={(newSetting) => {
                                const 新 = [...店舗スケジュール];
                                新[sIdx] = newSetting;
                                set店舗スケジュール(新);
                            }}
                            onApplyToAll={() => {
                                const 新 = 店舗スケジュール.map(item => ({
                                    ...item,
                                    営業時間帯: JSON.parse(JSON.stringify(s.営業時間帯))
                                }));
                                set店舗スケジュール(新);
                            }}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default StoreSettings;
