import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, PanResponder, LayoutChangeEvent, DimensionValue, Platform } from 'react-native';
import { 時間範囲 } from '../../../logic/types';

interface Props {
    slots: 時間範囲[];
    onUpdate?: (newSlots: 時間範囲[]) => void;
    color?: string;
    inactive?: boolean;
}

// -----------------------------------------------------------------------------
// TimeRangeSlot (Sub-component)
// -----------------------------------------------------------------------------
interface SlotProps {
    slot: 時間範囲;
    containerWidth: number;
    color: string;
    onUpdate: (newSlot: 時間範囲) => void;
    inactive: boolean;
}

const TimeRangeSlot: React.FC<SlotProps> = ({ slot, containerWidth, color, onUpdate, inactive }) => {
    // ローカルで表示用スロットを管理 (ドラッグ中の滑らかな表示用)
    const [currentSlot, setCurrentSlot] = useState(slot);

    // ドラッグ中かどうかを管理するRef
    const isDragging = useRef(false);

    // props の slot が外部から変更されたら同期する
    // ただし、自分がドラッグしている最中の更新は無視する（ちらつき・巻き戻り防止）
    useEffect(() => {
        if (!isDragging.current) {
            setCurrentSlot(slot);
        }
    }, [slot]);

    // 最新の値を ref に保持 (PanResponder 内で参照するため)
    const stateRef = useRef<{
        currentSlot: 時間範囲;
        containerWidth: number;
        onUpdate: (newSlot: 時間範囲) => void;
        initialSlot?: 時間範囲;
    }>({
        currentSlot,
        containerWidth,
        onUpdate
    });
    // 副作用で常に最新の値を ref に入れる（レンダリング毎に更新）
    useEffect(() => {
        stateRef.current = { currentSlot, containerWidth, onUpdate };
    }, [currentSlot, containerWidth, onUpdate]);

    const createPanResponder = (type: 'start' | 'end' | 'move') => {
        const isHandle = type === 'start' || type === 'end';

        return PanResponder.create({
            // ハンドルは即座に反応、移動バーは方向判定してから反応（スクロール阻害防止）
            onStartShouldSetPanResponder: () => {
                if (inactive) return false;
                // ハンドルは常に反応
                if (isHandle) return true;
                // 本体はWebの場合、即座に反応させないとドラッグ開始に失敗することがあるため緩和
                // ただしスクロール誤爆を防ぐため、少し動きを見てから判定したいが
                // React Native WebのPanResponderは即座にCaptureしないとイベントを逃すことがある
                return true;
            },
            onStartShouldSetPanResponderCapture: () => !inactive && isHandle, // ハンドルだけCapture強め

            onMoveShouldSetPanResponder: (_, gestureState) => {
                if (inactive) return false;
                if (isHandle) return true;

                // バー本体の移動: 水平移動が優位な場合のみ
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 2;
            },
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
                if (inactive) return false;
                if (isHandle) return true;
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 2;
            },

            onPanResponderTerminationRequest: () => false,
            onShouldBlockNativeResponder: () => true,

            onPanResponderGrant: () => {
                isDragging.current = true;
                // ドラッグ開始時の基準点として、現在のスロット状態を保存
                // ここで「スナップショット」を取ることで、前回のドラッグ終了位置から再開できる
                stateRef.current.initialSlot = { ...stateRef.current.currentSlot };
            },

            onPanResponderMove: (_, gestureState) => {
                const { containerWidth, initialSlot } = stateRef.current;
                if (!containerWidth || !initialSlot) return;

                const deltaX = gestureState.dx; // 累積移動量
                const deltaTime = (deltaX / containerWidth) * 24;

                const nextSlot = { ...initialSlot };

                if (type === 'start') {
                    let newStart = initialSlot.開始 + deltaTime;
                    newStart = Math.max(0, Math.min(initialSlot.終了 - 0.25, newStart));
                    nextSlot.開始 = newStart;
                } else if (type === 'end') {
                    let newEnd = initialSlot.終了 + deltaTime;
                    newEnd = Math.max(initialSlot.開始 + 0.25, Math.min(24, newEnd));
                    nextSlot.終了 = newEnd;
                } else if (type === 'move') {
                    let newStart = initialSlot.開始 + deltaTime;
                    let newEnd = initialSlot.終了 + deltaTime;

                    if (newStart < 0) {
                        newEnd -= newStart;
                        newStart = 0;
                    }
                    if (newEnd > 24) {
                        newStart -= (newEnd - 24);
                        newEnd = 24;
                    }
                    nextSlot.開始 = newStart;
                    nextSlot.終了 = newEnd;
                }

                // ローカル描画更新 (Floatでスムーズに動く)
                // memo: 親には通知しないので親の再レンダリングは発生しない
                setCurrentSlot(nextSlot);
            },

            onPanResponderRelease: () => {
                isDragging.current = false;
                // 確定時に丸めて親へ通知
                const { currentSlot, onUpdate } = stateRef.current;

                const roundedSlot = {
                    ...currentSlot,
                    開始: Math.round(currentSlot.開始),
                    終了: Math.round(currentSlot.終了)
                };

                // バリデーション (丸めによって大小関係が壊れないように)
                if (type === 'start') {
                    roundedSlot.開始 = Math.min(roundedSlot.終了 - 1, roundedSlot.開始);
                } else if (type === 'end') {
                    roundedSlot.終了 = Math.max(roundedSlot.開始 + 1, roundedSlot.終了);
                } else if (type === 'move') {
                    // move の場合は長さが変わらないので通常問題ないが念のため
                    if (roundedSlot.開始 < 0) roundedSlot.開始 = 0;
                    if (roundedSlot.終了 > 24) roundedSlot.終了 = 24;
                }

                setCurrentSlot(roundedSlot); // ローカルも丸めておく
                onUpdate(roundedSlot); // 親へ実際に反映するためにコールバック
            },

            onPanResponderTerminate: () => {
                isDragging.current = false;
            }
        });
    };

    // PanResponder をマウント時に一度だけ作成 (内部メソッドはRef経由で最新stateを参照)
    // これによりレンダリング毎の PanResponder 再生成を防ぎ、イベントの途切れをなくす
    const panResponderStart = useMemo(() => createPanResponder('start'), []);
    const panResponderEnd = useMemo(() => createPanResponder('end'), []);
    const panResponderMove = useMemo(() => createPanResponder('move'), []);

    const getPosition = (time: number): DimensionValue => `${(time / 24) * 100}%` as DimensionValue;
    const getWidth = (start: number, end: number): DimensionValue => `${((end - start) / 24) * 100}%` as DimensionValue;

    const start = Math.max(0, Math.min(24, currentSlot.開始));
    const end = Math.max(start, Math.min(24, currentSlot.終了));

    return (
        <View
            className="absolute h-full z-10"
            style={{
                left: getPosition(start),
                width: getWidth(start, end)
            }}
        >
            {/* Main Bar */}
            <View
                className="flex-1 rounded-lg border border-black/10 active:opacity-80"
                style={[
                    { backgroundColor: color },
                    Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'grab' } as any : {}
                ]}
                {...panResponderMove.panHandlers}
            />

            {/* Left Handle */}
            <View
                className="absolute -left-[20px] top-0 bottom-0 w-[40px] justify-center items-center z-30 cursor-ew-resize"
                style={Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none' } as any : {}}
                {...panResponderStart.panHandlers}
            >
                <View
                    className="w-[4px] h-[60%] bg-white rounded-full shadow-sm"
                    style={{ transform: [{ translateX: 10 }] }}
                />
            </View>

            {/* Right Handle */}
            <View
                className="absolute -right-[20px] top-0 bottom-0 w-[40px] justify-center items-center z-30 cursor-ew-resize"
                style={Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none' } as any : {}}
                {...panResponderEnd.panHandlers}
            >
                <View
                    className="w-[4px] h-[60%] bg-white rounded-full shadow-sm"
                    style={{ transform: [{ translateX: -10 }] }}
                />
            </View>
        </View>
    );
};

// -----------------------------------------------------------------------------
// TimeRangeBar (Main)
// -----------------------------------------------------------------------------

const TimeRangeBar: React.FC<Props> = ({ slots, onUpdate, color = '#43a047', inactive = false }) => {
    const [containerWidth, setContainerWidth] = useState(0);

    const onLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    const handleUpdateSlot = (index: number, newSlot: 時間範囲) => {
        if (!onUpdate) return;
        const newSlots = [...slots];
        newSlots[index] = newSlot;
        onUpdate(newSlots);
    };

    return (
        <View
            className="py-2.5 w-full select-none"
            onLayout={onLayout}
            style={Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none' } as any : {}}
        >
            {/* Track Background */}
            <View className="h-5 bg-slate-100 rounded-full relative border border-slate-200 overflow-visible">
                {/* 目盛りガイド */}
                <View className="absolute inset-0 flex-row">
                    {[0, 6, 12, 18, 24].map(h => (
                        <View
                            key={h}
                            className="absolute top-0 bottom-0 w-[1px] bg-slate-300 opacity-50"
                            style={{ left: `${(h / 24) * 100}%` }}
                        />
                    ))}
                </View>

                {/* Slots */}
                {!inactive && slots.map((slot, index) => (
                    <TimeRangeSlot
                        key={index}
                        slot={slot}
                        containerWidth={containerWidth}
                        color={color}
                        inactive={inactive}
                        onUpdate={(newSlot) => handleUpdateSlot(index, newSlot)}
                    />
                ))}
            </View>

            {/* ラベル */}
            <View className="flex-row justify-between mt-2 px-0">
                {[0, 4, 8, 12, 16, 20, 24].map(h => (
                    <Text key={h} className="text-[10px] text-slate-400 font-bold w-6 text-center">{h}</Text>
                ))}
            </View>
        </View>
    );
};

export default TimeRangeBar;
