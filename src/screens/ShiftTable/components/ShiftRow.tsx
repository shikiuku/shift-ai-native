
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { スタッフ, 曜日一覧, 時間ラベル, 週間スケジュール } from '../../../logic/types';

interface Props {
    staff: スタッフ;
    schedule: 週間スケジュール;
}

const ShiftRow: React.FC<Props> = ({ staff, schedule }) => {
    return (
        <View style={styles.tableRow}>
            <View style={styles.staffCell}>
                <View style={[styles.miniAvatar, { backgroundColor: staff.色 }]}>
                    <Text style={styles.miniAvatarText}>{staff.名前[0]}</Text>
                </View>
                <Text style={styles.staffNameText} numberOfLines={1}>{staff.名前}</Text>
            </View>
            {曜日一覧.map(曜日 => {
                const 今日のシフト = schedule.シフトリスト.filter(枠 => 枠.曜日 === 曜日 && 枠.担当者IDリスト.includes(staff.id));
                return (
                    <View key={曜日} style={styles.dayCell}>
                        {今日のシフト.map((枠, idx) => (
                            <View key={idx} style={styles.shiftBadge}>
                                <View style={[styles.dot, { backgroundColor: staff.色 }]} />
                                <Text style={styles.shiftTimeText}>
                                    {時間ラベル(枠.開始時間)}-{時間ラベル(枠.終了時間)}
                                </Text>
                            </View>
                        ))}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        height: 60,
    },
    staffCell: {
        width: 120,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 8,
        borderRightWidth: 1,
        borderRightColor: '#f1f5f9',
        backgroundColor: '#fff',
    },
    miniAvatar: {
        width: 24,
        height: 24,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniAvatarText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    staffNameText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#334155',
        flex: 1,
    },
    dayCell: {
        width: 160,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        borderRightWidth: 1,
        borderRightColor: '#f8fafc',
    },
    shiftBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f4f0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    shiftTimeText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#2d5a27',
    },
});

export default ShiftRow;
