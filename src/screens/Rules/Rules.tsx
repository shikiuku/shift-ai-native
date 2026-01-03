
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowRightLeft, Plus, Trash2 } from 'lucide-react-native';
import { 相性ルール, スタッフ } from '../../logic/types';

interface Props {
    全スタッフ: スタッフ[];
    全ルール: 相性ルール[];
    set全ルール: (r: 相性ルール[]) => void;
}

import RuleItem from './components/RuleItem';

interface Props {
    全スタッフ: スタッフ[];
    全ルール: 相性ルール[];
    set全ルール: (r: 相性ルール[]) => void;
}

const Rules: React.FC<Props> = ({ 全スタッフ, 全ルール, set全ルール }) => {
    const ルール追加 = () => {
        if (全スタッフ.length < 2) return;
        const 新: 相性ルール = {
            スタッフID1: 全スタッフ[0].id,
            スタッフID2: 全スタッフ[1].id,
            タイプ: '一緒にしない'
        };
        set全ルール([...全ルール, 新]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>相性ルールの設定</Text>
                <TouchableOpacity style={styles.addButton} onPress={ルール追加}>
                    <Plus size={20} color="#fff" />
                    <Text style={styles.addButtonText}>ルール追加</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {全ルール.map((r, idx) => (
                    <RuleItem
                        key={idx}
                        rule={r}
                        staff1={全スタッフ.find(s => s.id === r.スタッフID1)}
                        staff2={全スタッフ.find(s => s.id === r.スタッフID2)}
                        onToggleType={() => {
                            const 新 = [...全ルール];
                            新[idx].タイプ = r.タイプ === '一緒にする' ? '一緒にしない' : '一緒にする';
                            set全ルール(新);
                        }}
                        onDelete={() => set全ルール(全ルール.filter((_, i) => i !== idx))}
                    />
                ))}

                {全ルール.length === 0 && (
                    <View style={styles.emptyState}>
                        <ArrowRightLeft size={48} color="#e2e8f0" />
                        <Text style={styles.emptyText}>設定されたルールはありません</Text>
                    </View>
                )}
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
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#f0f4f0',
    },
    ruleDetail: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    participant: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
    },
    participantName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#334155',
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    typeGood: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
    },
    typeBad: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    typeText: {
        fontSize: 10,
        fontWeight: '900',
    },
    typeTextGood: {
        color: '#16a34a',
    },
    typeTextBad: {
        color: '#dc2626',
    },
    deleteButton: {
        padding: 8,
    },
    emptyState: {
        marginTop: 100,
        alignItems: 'center',
        gap: 12,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#94a3b8',
    },
});

export default Rules;
