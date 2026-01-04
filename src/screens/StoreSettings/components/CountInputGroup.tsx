
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
    minStaff: number;
    maxStaff: number;
    onMinChange: (val: string) => void;
    onMaxChange: (val: string) => void;
}

const CountInputGroup: React.FC<Props> = ({
    minStaff,
    maxStaff,
    onMinChange,
    onMaxChange
}) => {
    const displayVal = (n: number) => {
        if (n === 0) return '';
        if (isNaN(n)) return '';
        return n.toString();
    };

    return (
        <View className="flex-col bg-white border-2 border-[#f0f4f0] p-2.5 rounded-xl gap-1.5">
            <Text className="text-[10px] font-black text-slate-400 uppercase">必要人数</Text>
            <View className="flex-row items-center gap-2">
                <TextInput
                    keyboardType="numeric"
                    value={displayVal(minStaff)}
                    onChangeText={onMinChange}
                    className="bg-slate-50 w-[60px] text-center font-black rounded-lg py-1.5 text-slate-800 text-base border border-slate-200"
                    placeholder="0"
                    placeholderTextColor="#cbd5e1"
                />
                <Text className="text-slate-300 font-bold">〜</Text>
                <TextInput
                    keyboardType="numeric"
                    value={displayVal(maxStaff)}
                    onChangeText={onMaxChange}
                    className="bg-slate-50 w-[60px] text-center font-black rounded-lg py-1.5 text-slate-800 text-base border border-slate-200"
                    placeholder="0"
                    placeholderTextColor="#cbd5e1"
                />
                <Text className="text-xs text-slate-400 font-bold">人</Text>
            </View>
        </View>
    );
};

export default CountInputGroup;
