
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Settings2, Clock } from 'lucide-react-native';
import { 曜日設定, 曜日一覧 } from '../../logic/types';

interface Props {
    店舗スケジュール: 曜日設定[];
    set店舗スケジュール: (s: 曜日設定[]) => void;
}

import DaySettingRow from './components/DaySettingRow';

interface Props {
    店舗スケジュール: 曜日設定[];
    set店舗スケジュール: (s: 曜日設定[]) => void;
}

const StoreSettings: React.FC<Props> = ({ 店舗スケジュール, set店舗スケジュール }) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Settings2 size={24} color="#2d5a27" />
                    <Text style={styles.title}>店舗・必要人数の設定</Text>
                </View>

                <View style={styles.list}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9faf9',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#2d5a27',
    },
    list: {
        gap: 12,
    },
    row: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#f0f4f0',
        gap: 12,
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: '#334155',
    },
    inputsContainer: {
        flexDirection: 'column',
        gap: 12,
    },
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
    countInputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#f0f4f0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    countLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    countInput: {
        backgroundColor: '#f8fafc',
        width: 36,
        textAlign: 'center',
        fontWeight: '900',
        borderRadius: 6,
        paddingVertical: 2,
    },
});

export default StoreSettings;
