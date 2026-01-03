
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import { 時間範囲 } from '../../../logic/types';

interface Props {
    slots: 時間範囲[];
    onUpdate?: (newSlots: 時間範囲[]) => void;
    color?: string;
    inactive?: boolean;
}

const TimeRangeBar: React.FC<Props> = ({ slots, onUpdate, color = '#43a047', inactive = false }) => {
    const [containerWidth, setContainerWidth] = useState(0);

    // ジェスチャー開始時の値を保持するRef
    const gestureStateRef = useRef<{
        idx: number;
        type: 'start' | 'end' | 'move';
        initialStart: number;
        initialEnd: number;
    } | null>(null);

    const getPosition = (time: number) => {
        return `${(time / 24) * 100}%`;
    };

    const getWidth = (start: number, end: number) => {
        return `${((end - start) / 24) * 100}%`;
    };

    const onLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    const createPanResponder = (index: number, type: 'start' | 'end' | 'move') => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => !inactive && !!onUpdate,
            onPanResponderGrant: () => {
                gestureStateRef.current = {
                    idx: index,
                    type,
                    initialStart: slots[index].開始,
                    initialEnd: slots[index].終了,
                };
            },
            onPanResponderMove: (_, gestureState) => {
                if (inactive || !onUpdate || containerWidth === 0 || !gestureStateRef.current) return;

                const { idx, initialStart, initialEnd } = gestureStateRef.current;
                const deltaX = gestureState.dx;
                const deltaTime = (deltaX / containerWidth) * 24;

                const newSlots = [...slots];
                const slot = { ...newSlots[idx] };

                if (type === 'start') {
                    // 開始時間のみ変更
                    let newStart = Math.round(initialStart + deltaTime);
                    newStart = Math.max(0, Math.min(initialEnd - 1, newStart));
                    if (newStart !== slot.開始) {
                        slot.開始 = newStart;
                        newSlots[idx] = slot;
                        onUpdate(newSlots);
                    }
                } else if (type === 'end') {
                    // 終了時間のみ変更
                    let newEnd = Math.round(initialEnd + deltaTime);
                    newEnd = Math.max(initialStart + 1, Math.min(24, newEnd));
                    if (newEnd !== slot.終了) {
                        slot.終了 = newEnd;
                        newSlots[idx] = slot;
                        onUpdate(newSlots);
                    }
                } else if (type === 'move') {
                    // バー全体を移動
                    let newStart = Math.round(initialStart + deltaTime);
                    let newEnd = Math.round(initialEnd + deltaTime);

                    if (newStart < 0) {
                        newEnd -= newStart;
                        newStart = 0;
                    }
                    if (newEnd > 24) {
                        newStart -= (newEnd - 24);
                        newEnd = 24;
                    }

                    if (newStart !== slot.開始 || newEnd !== slot.終了) {
                        slot.開始 = newStart;
                        slot.終了 = newEnd;
                        newSlots[idx] = slot;
                        onUpdate(newSlots);
                    }
                }
            },
            onPanResponderRelease: () => {
                gestureStateRef.current = null;
            },
            onPanResponderTerminate: () => {
                gestureStateRef.current = null;
            }
        });
    };

    return (
        <View style={styles.container} onLayout={onLayout}>
            <View style={styles.track}>
                {/* 目盛りガイド */}
                <View style={styles.guideRow}>
                    {[0, 6, 12, 18, 24].map(h => (
                        <View key={h} style={[styles.tick, { left: `${(h / 24) * 100}%` }]} />
                    ))}
                </View>

                {!inactive && slots.map((slot, index) => {
                    const start = Math.max(0, Math.min(24, slot.開始));
                    const end = Math.max(start, Math.min(24, slot.終了));

                    return (
                        <View
                            key={index}
                            style={[
                                styles.slotBarContainer,
                                { left: getPosition(start), width: getWidth(start, end) }
                            ]}
                        >
                            {/* 移動用メインエリア */}
                            <View
                                style={[styles.slotBar, { backgroundColor: color }]}
                                {...createPanResponder(index, 'move').panHandlers}
                            />

                            {/* 左ハンドル（開始時間用）: タッチ範囲を広げる */}
                            <View
                                style={styles.handleContainer}
                                {...createPanResponder(index, 'start').panHandlers}
                            >
                                <View style={[styles.handle, { borderColor: color }]} />
                            </View>

                            {/* 右ハンドル（終了時間用） */}
                            <View
                                style={[styles.handleContainer, styles.handleRight]}
                                {...createPanResponder(index, 'end').panHandlers}
                            >
                                <View style={[styles.handle, { borderColor: color }]} />
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.labelRow}>
                {[0, 4, 8, 12, 16, 20, 24].map(h => (
                    <Text key={h} style={styles.tickLabel}>{h}</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        width: '100%',
    },
    track: {
        height: 18,
        backgroundColor: '#f1f5f9',
        borderRadius: 9,
        position: 'relative',
        overflow: 'visible',
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
    slotBarContainer: {
        position: 'absolute',
        height: '100%',
        zIndex: 10,
    },
    slotBar: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    handleContainer: {
        position: 'absolute',
        left: -15, // タッチ範囲を広げる
        top: -10,
        width: 30, // 30pxのタッチ範囲
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30, // 最前面
    },
    handleRight: {
        left: undefined,
        right: -15,
    },
    handle: {
        width: 14,
        height: 14,
        backgroundColor: '#fff',
        borderRadius: 7,
        borderWidth: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 0,
    },
    tickLabel: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: 'bold',
        width: 25,
        textAlign: 'center',
    }
});

export default TimeRangeBar;
