
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { 週間スケジュール, スタッフ, 曜日一覧, 時間ラベル } from '../../../logic/types';

interface Props {
    schedule: 週間スケジュール;
    staffList: スタッフ[];
}

const ShiftTableWeekVerticalView: React.FC<Props> = ({ schedule, staffList }) => {
    // 0:00 - 24:00 の時間枠
    const timeSlots = Array.from({ length: 25 }, (_, i) => i);
    const COLUMN_WIDTH = 100;
    const TIME_COL_WIDTH = 50;
    const CONTENT_WIDTH = TIME_COL_WIDTH + (COLUMN_WIDTH * 7);

    return (
        <View style={styles.container}>
            {/* Header: Days - Fixed at top, scrolls horizontally */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.headerScroll} contentContainerStyle={{ width: CONTENT_WIDTH }}>
                <View style={[styles.headerRow, { width: CONTENT_WIDTH }]}>
                    <View style={styles.timeHeader}>
                        <Text style={styles.headerText}>時間</Text>
                    </View>
                    {曜日一覧.map(day => (
                        <View key={day} style={styles.dayHeader}>
                            <Text style={styles.headerText}>{day}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Body: Vertical Scroll with Horizontal Scroll inside (synced ideally, but simplified here) */}
            {/* Note: true bidirectional scrolling is complex in RN. 
                For now, we vertically scroll the whole grid, and let the user scroll horizontally if needed.
                However, syncing header is tough without a library.
                Let's use a single ScrollView for vertical, and nested horizontal scroll view for the grid body?
                Or just a large ScrollView that scrolls both ways?
                Standard approach: Vertical ScrollView -> Horizontal ScrollView -> Content
            */}
            <ScrollView style={styles.verticalScroll} contentContainerStyle={{ paddingBottom: 50 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ width: CONTENT_WIDTH }}>
                    <View style={styles.gridContainer}>
                        {/* Horizontal Grid Lines for each hour */}
                        {timeSlots.map(h => (
                            <View key={h} style={[styles.gridRow, { top: h * 60, width: CONTENT_WIDTH }]}>
                                <Text style={styles.timeLabel}>{h}:00</Text>
                                <View style={styles.gridLine} />
                            </View>
                        ))}

                        {/* Columns for Days */}
                        {曜日一覧.map((day, dIdx) => {
                            // この曜日のシフト
                            const dayShifts = schedule.シフトリスト.filter(s => s.曜日 === day);

                            return (
                                <View key={day} style={[styles.dayColumn, { left: TIME_COL_WIDTH + (dIdx * COLUMN_WIDTH) }]}>
                                    {dayShifts.map((shift, sIdx) => {
                                        const staff = staffList.find(s => s.id === shift.担当者IDリスト[0]); // TODO: 複数人
                                        if (!staff) return null;

                                        return (
                                            <View
                                                key={sIdx}
                                                style={[
                                                    styles.shiftCard,
                                                    {
                                                        top: shift.開始時間 * 60,
                                                        height: (shift.終了時間 - shift.開始時間) * 60,
                                                        backgroundColor: staff.色,
                                                    }
                                                ]}
                                            >
                                                <Text style={styles.shiftText} numberOfLines={1}>{staff.名前}</Text>
                                                <Text style={[styles.shiftText, { fontSize: 8, fontWeight: 'normal' }]}>
                                                    {時間ラベル(shift.開始時間)}-{時間ラベル(shift.終了時間)}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerScroll: {
        maxHeight: 40,
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        zIndex: 10,
    },
    headerRow: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    verticalScroll: {
        flex: 1,
    },
    timeHeader: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        height: '100%',
        backgroundColor: '#f8fafc', // Sticky like effect
    },
    dayHeader: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#f1f5f9',
        height: '100%',
    },
    headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748b',
    },
    gridContainer: {
        height: 24 * 60 + 20,
        position: 'relative',
        backgroundColor: '#fff',
    },
    gridRow: {
        position: 'absolute',
        left: 0,
        height: 1,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    timeLabel: {
        width: 50,
        textAlign: 'center',
        fontSize: 10,
        color: '#94a3b8',
        marginTop: -10,
        backgroundColor: 'transparent',
    },
    gridLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#f1f5f9',
    },
    dayColumn: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 100,
        borderRightWidth: 1,
        borderRightColor: '#f8fafc',
        zIndex: 5,
    },
    shiftCard: {
        position: 'absolute',
        left: 2,
        right: 2,
        borderRadius: 4,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    shiftText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowRadius: 2,
    }
});

export default ShiftTableWeekVerticalView;

