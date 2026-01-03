
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { UserPlus, ChevronRight, ChevronDown, Trash2 } from 'lucide-react-native';
import { スタッフ, 役割, 曜日一覧 } from '../../logic/types';

interface Props {
    全スタッフ: スタッフ[];
    set全スタッフ: (s: スタッフ[]) => void;
    展開中のスタッフID: string | null;
    set展開中のスタッフID: (id: string | null) => void;
    スタッフ追加: () => void;
}

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
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>スタッフ設定 ({全スタッフ.length}名)</Text>
                <TouchableOpacity style={styles.addButton} onPress={スタッフ追加}>
                    <UserPlus size={20} color="#fff" />
                    <Text style={styles.addButtonText}>追加</Text>
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
                            set全スタッフ(全スタッフ.map(st => st.id === s.id ? { ...st, 名前: name } : st));
                        }}
                        onToggleDay={(dayIdx) => {
                            const 新 = [...全スタッフ];
                            const stIdx = 新.findIndex(st => st.id === s.id);
                            新[stIdx].勤務設定[dayIdx].出勤可能 = !新[stIdx].勤務設定[dayIdx].出勤可能;
                            set全スタッフ(新);
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0f4f0',
        overflow: 'hidden',
    },
    cardExpanded: {
        borderColor: '#cddc39',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 18,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    userRole: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    details: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
        gap: 16,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#f0f4f0',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontWeight: 'bold',
    },
    subTitle: {
        color: '#2d5a27',
        fontWeight: '900',
        fontSize: 14,
    },
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
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 8,
    },
    deleteButtonText: {
        color: '#f87171',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default StaffList;
