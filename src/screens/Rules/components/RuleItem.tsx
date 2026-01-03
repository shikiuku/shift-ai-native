
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRightLeft } from 'lucide-react-native';
import { 相性ルール, スタッフ } from '../../../logic/types';

interface Props {
    rule: 相性ルール;
    staff1: スタッフ | undefined;
    staff2: スタッフ | undefined;
    onToggleType: () => void;
    onDelete: () => void;
}

const RuleItem: React.FC<Props> = ({ rule, staff1, staff2, onToggleType, onDelete }) => {
    return (
        <View style={styles.card}>
            <View style={styles.ruleDetail}>
                <View style={styles.participant}>
                    <Text style={styles.participantName}>{staff1?.名前 || '不明'}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.typeBadge, rule.タイプ === '一緒にしない' ? styles.typeBad : styles.typeGood]}
                    onPress={onToggleType}
                >
                    <ArrowRightLeft size={16} color={rule.タイプ === '一緒にしない' ? '#f87171' : '#4ade80'} />
                    <Text style={[styles.typeText, rule.タイプ === '一緒にしない' ? styles.typeTextBad : styles.typeTextGood]}>
                        {rule.タイプ}
                    </Text>
                </TouchableOpacity>
                <View style={styles.participant}>
                    <Text style={styles.participantName}>{staff2?.名前 || '不明'}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={onDelete}
            >
                <ArrowRightLeft size={16} color="#cbd5e1" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default RuleItem;
