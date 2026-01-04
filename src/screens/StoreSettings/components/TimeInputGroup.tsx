
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';

interface Props {
    startTime: number;
    endTime: number;
    onStartTimeChange: (val: string) => void;
    onEndTimeChange: (val: string) => void;
    onDelete?: () => void;
    showDelete?: boolean;
}

const TimeInputGroup: React.FC<Props> = ({
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
    onDelete,
    showDelete
}) => {
    // 文字をそのまま表示し、0はプレースホルダーに任せる
    const displayVal = (n: number) => {
        if (n === 0) return '';
        if (isNaN(n)) return '';
        return n.toString();
    };

    return (
        <View className="flex-col bg-[#f0f4f0] p-2.5 rounded-xl gap-1.5">
            <View className="flex-row items-center gap-1.5">
                <Clock size={16} color="#2d5a27" style={{ opacity: 0.4 }} />
                <Text className="text-[10px] font-black text-[#2d5a27] opacity-60">時間帯</Text>
            </View>
            <View className="flex-row items-center gap-2">
                <TextInput
                    keyboardType="numeric"
                    value={displayVal(startTime)}
                    onChangeText={onStartTimeChange}
                    className="bg-white w-[60px] text-center font-bold rounded-lg py-1.5 text-slate-800 text-base border border-slate-200"
                    placeholder="0"
                    placeholderTextColor="#cbd5e1"
                />
                <Text className="text-[#2d5a27] font-bold opacity-30">〜</Text>
                <TextInput
                    keyboardType="numeric"
                    value={displayVal(endTime)}
                    onChangeText={onEndTimeChange}
                    className="bg-white w-[60px] text-center font-bold rounded-lg py-1.5 text-slate-800 text-base border border-slate-200"
                    placeholder="0"
                    placeholderTextColor="#cbd5e1"
                />
                {showDelete && onDelete && (
                    <TouchableOpacity onPress={onDelete} className="ml-auto p-1.5 bg-red-100 rounded-lg">
                        <Trash2 size={16} color="#f87171" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default TimeInputGroup;
