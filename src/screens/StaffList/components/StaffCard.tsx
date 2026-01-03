
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ChevronRight, ChevronDown, Trash2 } from 'lucide-react-native';
import { スタッフ, 時間範囲 } from '../../../logic/types';
import StaffScheduleGrid from './StaffScheduleGrid';

interface Props {
    staff: スタッフ;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onUpdateName: (name: string) => void;
    onToggleDay: (dayIdx: number) => void;
    onUpdateRange: (dayIdx: number, rangeIdx: number, key: keyof 時間範囲, val: string) => void;
    onAddSlot: (dayIdx: number) => void;
    onDeleteSlot: (dayIdx: number, rangeIdx: number) => void;
    onApplyToAll: (dayIdx: number) => void;
    onDelete: () => void;
}

const StaffCard: React.FC<Props> = ({
    staff,
    isExpanded,
    onToggleExpand,
    onUpdateName,
    onToggleDay,
    onUpdateRange,
    onAddSlot,
    onDeleteSlot,
    onApplyToAll,
    onDelete,
}) => {
    return (
        <View style={[styles.card, isExpanded && styles.cardExpanded]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={onToggleExpand}
            >
                <View style={styles.userInfo}>
                    <View style={[styles.avatar, { backgroundColor: staff.色 }]}>
                        <Text style={styles.avatarText}>{staff.名前[0]}</Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>{staff.名前}</Text>
                        <Text style={styles.userRole}>{staff.役割}</Text>
                    </View>
                </View>
                {isExpanded ? <ChevronDown size={20} color="#cbd5e1" /> : <ChevronRight size={20} color="#cbd5e1" />}
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.details}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>名前</Text>
                        <TextInput
                            style={styles.input}
                            value={staff.名前}
                            onChangeText={onUpdateName}
                        />
                    </View>

                    <Text style={styles.subTitle}>週間出勤設定</Text>
                    <StaffScheduleGrid
                        schedule={staff.勤務設定}
                        onToggle={onToggleDay}
                        onUpdateRange={onUpdateRange}
                        onAddSlot={onAddSlot}
                        onDeleteSlot={onDeleteSlot}
                        onApplyToAll={onApplyToAll}
                    />

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={onDelete}
                    >
                        <Trash2 size={16} color="#f87171" />
                        <Text style={styles.deleteButtonText}>スタッフを削除</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0f4f0',
        overflow: 'hidden',
    },
    cardExpanded: {
        borderColor: '#cddc39',
        borderWidth: 2,
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
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 16,
        paddingVertical: 12,
        backgroundColor: '#fff5f5',
        borderRadius: 12,
    },
    deleteButtonText: {
        color: '#f87171',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default StaffCard;
