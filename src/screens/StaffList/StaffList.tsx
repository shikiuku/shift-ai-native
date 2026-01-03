
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { スタッフ, 時間範囲 } from '../../logic/types';
import StaffCard from './components/StaffCard';

interface Props {
    全スタッフ: スタッフ[];
    set全スタッフ: (s: スタッフ[]) => void;
    展開中のスタッフID: string | null;
    set展開中のスタッフID: (id: string | null) => void;
    スタッフ追加: () => void;
}

const StaffList: React.FC<Props> = ({
    全スタッフ,
    set全スタッフ,
    展開中のスタッフID,
    set展開中のスタッフID,
    スタッフ追加
}) => {
    const updateStaff = (id: string, updater: (s: スタッフ) => スタッフ) => {
        set全スタッフ(全スタッフ.map(s => s.id === id ? updater(s) : s));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>スタッフ設定 ({全スタッフ.length}名)</Text>
                <TouchableOpacity style={styles.addButton} onPress={スタッフ追加}>
                    <UserPlus size={20} color="#fff" />
                    <Text style={styles.addButtonText}>スタッフ追加</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {全スタッフ.map(s => (
                    <StaffCard
                        key={s.id}
                        staff={s}
                        isExpanded={展開中のスタッフID === s.id}
                        onToggleExpand={() => set展開中のスタッフID(展開中のスタッフID === s.id ? null : s.id)}
                        onUpdateName={(name) => {
                            updateStaff(s.id, st => ({ ...st, 名前: name }));
                        }}
                        onToggleDay={(dayIdx) => {
                            updateStaff(s.id, st => {
                                const 新 = [...st.勤務設定];
                                新[dayIdx] = { ...新[dayIdx], 出勤可能: !新[dayIdx].出勤可能 };
                                return { ...st, 勤務設定: 新 };
                            });
                        }}
                        onUpdateRange={(dayIdx, rangeIdx, key, val) => {
                            updateStaff(s.id, st => {
                                const 新 = [...st.勤務設定];
                                const range新 = [...新[dayIdx].可能時間帯];
                                range新[rangeIdx] = {
                                    ...range新[rangeIdx],
                                    [key]: val === '' ? 0 : parseInt(val) || 0
                                };
                                新[dayIdx] = { ...新[dayIdx], 可能時間帯: range新 };
                                return { ...st, 勤務設定: 新 };
                            });
                        }}
                        onApplyToAll={(dayIdx) => {
                            updateStaff(s.id, st => {
                                const source = st.勤務設定[dayIdx];
                                const 新 = st.勤務設定.map(item => ({
                                    ...item,
                                    出勤可能: source.出勤可能,
                                    可能時間帯: JSON.parse(JSON.stringify(source.可能時間帯))
                                }));
                                return { ...st, 勤務設定: 新 };
                            });
                        }}
                        onDelete={() => {
                            set全スタッフ(全スタッフ.filter(item => item.id !== s.id));
                        }}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9faf9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        color: '#2d5a27',
    },
    addButton: {
        backgroundColor: '#2d5a27',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    list: {
        padding: 16,
        gap: 12,
    },
});

export default StaffList;
