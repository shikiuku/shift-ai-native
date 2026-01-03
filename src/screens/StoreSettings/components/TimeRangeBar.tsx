
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
    const activeSlotIdx = useRef<number | null>(null);
    const activeHandle = useRef<'start' | 'end' | 'move' | null>(null);

    const getPosition = (time: number) => {
        return `${(time / 24) * 100}%`;
    };

    const getWidth = (start: number, end: number) => {
        return `${((end - start) / 24) * 100}%`;
    };

    const onLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    // 汎用的なPanResponderの作成
    const createPanResponder = (index: number, type: 'start' | 'end' | 'move') => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => !inactive && !!onUpdate,
            onPanResponderGrant: () => {
                activeSlotIdx.current = index;
                activeHandle.current = type;
            },
            onPanResponderMove: (_, gestureState) => {
                if (inactive || !onUpdate || containerWidth === 0 || activeSlotIdx.current === null) return;

                const deltaX = gestureState.dx;
                const deltaTime = (deltaX / containerWidth) * 24;

                const newSlots = [...slots];
                const slot = { ...newSlots[activeSlotIdx.current] };

                if (activeHandle.current === 'start') {
                    let newStart = Math.round(slot.開始 + deltaTime);
                    newStart = Math.max(0, Math.min(slot.終了 - 1, newStart));
                    if (newStart !== slot.開始) {
                        slot.開始 = newStart;
                        newSlots[activeSlotIdx.current] = slot;
                        onUpdate(newSlots);
                    }
                } else if (activeHandle.current === 'end') {
                    let newEnd = Math.round(slot.終了 + deltaTime);
                    newEnd = Math.max(slot.開始 + 1, Math.min(24, newEnd));
                    if (newEnd !== slot.終了) {
                        slot.終了 = newEnd;
                        newSlots[activeSlotIdx.current] = slot;
                        onUpdate(newSlots);
                    }
                } else if (activeHandle.current === 'move') {
                    let newStart = Math.round(slot.開始 + deltaTime);
                    let newEnd = Math.round(slot.終了 + deltaTime);

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
                        newSlots[activeSlotIdx.current] = slot;
                        onUpdate(newSlots);
                    }
                }
            },
            onPanResponderRelease: () => {
                activeSlotIdx.current = null;
                activeHandle.current = null;
            },
        });
    };

    return (
        <View style={styles.container} onLayout={onLayout}>
            <View style={styles.track}>
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
                            {/* メインのバー（移動用） */}
                            <View
                                style={[styles.slotBar, { backgroundColor: color }]}
                                {...createPanResponder(index, 'move').panHandlers}
                            />

                            {/* 左ハンドル（開始時間変更用） */}
                            <View
                                style={styles.handle}
                                {...createPanResponder(index, 'start').panHandlers}
                            >
                                <View style={styles.handleDot} />
                            </View>

                            {/* 右ハンドル（終了時間変更用） */}
                            <View
                                style={[styles.handle, styles.handleRight]}
                                {...createPanResponder(index, 'end').panHandlers}
                            >
                                <View style={styles.handleDot} />
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.labelRow}>
                {[0, 6, 12, 18, 24].map(h => (
                    <Text key={h} style={styles.tickLabel}>{h}</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        width: '100%',
    },
    track: {
        height: 16,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        position: 'relative',
        overflow: 'visible', // ハンドルをはみ出させるため
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
    handle: {
        position: 'absolute',
        left: -10,
        top: -4,
        width: 20,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    handleRight: {
        left: undefined,
        right: -10,
    },
    handleDot: {
        width: 10,
        height: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#43a047',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        paddingHorizontal: 0,
    },
    tickLabel: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: 'bold',
        width: 20,
        textAlign: 'center',
    }
});

export default TimeRangeBar;
