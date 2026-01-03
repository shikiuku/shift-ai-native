
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 時間範囲 } from '../../../logic/types';

interface Props {
    slots: 時間範囲[];
    color?: string;
    inactive?: boolean;
}

const TimeRangeBar: React.FC<Props> = ({ slots, color = '#43a047', inactive = false }) => {
    // 0-24時間を100%として計算
    const getPosition = (time: number) => {
        return `${(time / 24) * 100}%`;
    };

    const getWidth = (start: number, end: number) => {
        return `${((end - start) / 24) * 100}%`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.track}>
                {/* 背景の目盛り（ガイド） */}
                <View style={styles.guideRow}>
                    {[0, 6, 12, 18, 24].map(h => (
                        <View key={h} style={[styles.tick, { left: getPosition(h) }]} />
                    ))}
                </View>

                {/* スケジュールされた枠 */}
                {!inactive && slots.map((slot, index) => {
                    // 不正な値のガード
                    const start = Math.max(0, Math.min(24, slot.開始));
                    const end = Math.max(start, Math.min(24, slot.終了));

                    return (
                        <View
                            key={index}
                            style={[
                                styles.slotBar,
                                {
                                    left: getPosition(start),
                                    width: getWidth(start, end),
                                    backgroundColor: color
                                }
                            ]}
                        />
                    );
                })}
            </View>

            {/* 目盛りラベル */}
            <View style={styles.labelRow}>
                <Text style={styles.tickLabel}>0</Text>
                <Text style={styles.tickLabel}>6</Text>
                <Text style={styles.tickLabel}>12</Text>
                <Text style={styles.tickLabel}>18</Text>
                <Text style={styles.tickLabel}>24</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        width: '100%',
    },
    track: {
        height: 12,
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    guideRow: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
    },
    tick: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#cbd5e1',
        opacity: 0.5,
    },
    slotBar: {
        position: 'absolute',
        height: '100%',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingHorizontal: 2,
    },
    tickLabel: {
        fontSize: 8,
        color: '#94a3b8',
        fontWeight: 'bold',
    }
});

export default TimeRangeBar;
