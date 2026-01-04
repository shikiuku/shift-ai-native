
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { スタッフ, 週間スケジュール, 時間ラベル } from '../../../logic/types';

interface Props {
    date: Date;
    schedule: 週間スケジュール;
    staffList: スタッフ[];
}

// 簡易的な読み取り専用タイムバー
const SimpleTimeBar: React.FC<{ start: number; end: number; color: string }> = ({ start, end, color }) => {
    const left = `${(start / 24) * 100}%` as any;
    const width = `${((end - start) / 24) * 100}%` as any;

    return (
        <View
            style={{
                position: 'absolute',
                left,
                width,
                top: 8,
                bottom: 8,
                backgroundColor: color,
                borderRadius: 40, // 丸みを持たせる
                opacity: 0.9,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ fontSize: 8, fontWeight: '900', color: '#fff' }}>
                {時間ラベル(start)}-{時間ラベル(end)}
            </Text>
        </View>
    );
};

const ShiftTableDayView: React.FC<Props> = ({ date, schedule, staffList }) => {
    // 曜日を取得（簡易実装: 現在は固定データと仮定するため、scheduleから適合する曜日を探す）
    // 本来は date から曜日を特定するが、今はモックデータの「月」「火」...と照合する
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const currentDayStr = days[date.getDay()]; // 0=Sun, 1=Mon...

    // この曜日のシフトデータを抽出
    const dayShifts = schedule.シフトリスト.filter(s => s.曜日 === currentDayStr);

    return (
        <View style={styles.container}>
            {/* Header: Time Scale */}
            <View style={styles.headerRow}>
                <View style={styles.staffHeader}>
                    <Text style={styles.headerText}>スタッフ</Text>
                </View>
                <View style={styles.timeScale}>
                    {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(h => (
                        <View key={h} style={{ position: 'absolute', left: `${(h / 24) * 100}%`, alignItems: 'center', width: 40, marginLeft: -20 }}>
                            <Text style={styles.timeLabel}>{h}</Text>
                            <View style={styles.timeGridLineHeader} />
                        </View>
                    ))}
                </View>
            </View>

            <ScrollView>
                {staffList.map(staff => {
                    const staffShifts = dayShifts.filter(s => s.担当者IDリスト.includes(staff.id));

                    return (
                        <View key={staff.id} style={styles.row}>
                            <View style={styles.staffCell}>
                                <View style={[styles.avatar, { backgroundColor: staff.色 }]}>
                                    <Text style={styles.avatarText}>{staff.名前[0]}</Text>
                                </View>
                                <Text style={styles.staffName} numberOfLines={1}>{staff.名前}</Text>
                            </View>

                            <View style={styles.barsArea}>
                                {/* Grid Lines */}
                                {[0, 6, 12, 18, 24].map(h => (
                                    <View
                                        key={h}
                                        style={[
                                            styles.gridLine,
                                            { left: `${(h / 24) * 100}%` }
                                        ]}
                                    />
                                ))}

                                {/* Shift Bars */}
                                {staffShifts.map((shift, idx) => (
                                    <SimpleTimeBar
                                        key={idx}
                                        start={shift.開始時間}
                                        end={shift.終了時間}
                                        color={staff.色}
                                    />
                                ))}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: '#f8fafc',
    },
    staffHeader: {
        width: 100,
        justifyContent: 'center',
        paddingLeft: 16,
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
    },
    headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748b',
    },
    timeScale: {
        flex: 1,
        flexDirection: 'row',
        position: 'relative',
        height: '100%',
        alignItems: 'flex-end',
    },
    timeLabel: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    timeGridLineHeader: {
        height: 6,
        width: 1,
        backgroundColor: '#cbd5e1',
    },
    row: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    staffCell: {
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: '#f1f5f9',
        backgroundColor: '#fff',
        zIndex: 5,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    staffName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#334155',
        flex: 1,
    },
    barsArea: {
        flex: 1,
        position: 'relative',
    },
    gridLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#f1f5f9',
    }
});

export default ShiftTableDayView;
