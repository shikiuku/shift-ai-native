
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { CalendarDays, Users2, Printer } from 'lucide-react-native';
import { 週間スケジュール, スタッフ, 曜日一覧, 時間ラベル } from '../logic/types';

interface Props {
    スケジュール: 週間スケジュール | null;
    全スタッフ: スタッフ[];
    スタッフ総時間: Record<string, number>;
}

const ShiftTable: React.FC<Props> = ({ スケジュール, 全スタッフ, スタッフ総時間 }) => {
    if (!スケジュール) {
        return (
            <View style={styles.emptyContainer}>
                <CalendarDays size={64} color="#e2e8f0" />
                <Text style={styles.emptyText}>「AI生成」を実行してシフトを作成してください</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.statsContainer}>
                    <View style={styles.statBadge}>
                        <Users2 size={14} color="#2d5a27" />
                        <Text style={styles.statText}>充足: 完了</Text>
                    </View>
                </View>
                <Printer size={20} color="#cbd5e1" />
            </View>

            <ScrollView horizontal bounces={false} style={styles.tableScroll}>
                <View>
                    <View style={styles.tableHeader}>
                        <View style={styles.staffColumnHeader}>
                            <Text style={styles.headerText}>スタッフ</Text>
                        </View>
                        {曜日一覧.map(曜日 => (
                            <View key={曜日} style={styles.dayColumnHeader}>
                                <Text style={styles.headerText}>{曜日}</Text>
                            </View>
                        ))}
                    </View>

                    <ScrollView style={styles.tableBody} bounces={false}>
                        {全スタッフ.map(s => (
                            <View key={s.id} style={styles.tableRow}>
                                <View style={styles.staffCell}>
                                    <View style={[styles.miniAvatar, { backgroundColor: s.色 }]}>
                                        <Text style={styles.miniAvatarText}>{s.名前[0]}</Text>
                                    </View>
                                    <Text style={styles.staffNameText} numberOfLines={1}>{s.名前}</Text>
                                </View>
                                {曜日一覧.map(曜日 => {
                                    const 今日のシフト = スケジュール.シフトリスト.filter(枠 => 枠.曜日 === 曜日 && 枠.担当者IDリスト.includes(s.id));
                                    return (
                                        <View key={曜日} style={styles.dayCell}>
                                            {今日のシフト.map((枠, idx) => (
                                                <View key={idx} style={styles.shiftBadge}>
                                                    <View style={[styles.dot, { backgroundColor: s.色 }]} />
                                                    <Text style={styles.shiftTimeText}>
                                                        {時間ラベル(枠.開始時間)}-{時間ラベル(枠.終了時間)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9f8',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        gap: 16,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '900',
        color: '#cbd5e1',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#cddc39',
    },
    statText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2d5a27',
    },
    tableScroll: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderBottomWidth: 2,
        borderBottomColor: '#e2e8f0',
    },
    staffColumnHeader: {
        width: 120,
        padding: 12,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
    },
    dayColumnHeader: {
        width: 160,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#f1f5f9',
    },
    headerText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#2d5a27',
    },
    tableBody: {
        flex: 1,
    },
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

export default ShiftTable;
