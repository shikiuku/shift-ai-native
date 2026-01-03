
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 曜日設定 } from '../../../logic/types';
import TimeInputGroup from './TimeInputGroup';
import CountInputGroup from './CountInputGroup';

interface Props {
    setting: 曜日設定;
    onUpdate: (newSetting: 曜日設定) => void;
}

const DaySettingRow: React.FC<Props> = ({ setting, onUpdate }) => {
    const updateRange = (key: keyof typeof setting.営業時間帯[0], val: string) => {
        const newSetting = { ...setting };
        newSetting.営業時間帯[0] = {
            ...newSetting.営業時間帯[0],
            [key]: parseInt(val) || 0
        };
        onUpdate(newSetting);
    };

    return (
        <View style={styles.row}>
            <Text style={styles.dayLabel}>{setting.曜日}</Text>

            <View style={styles.inputsContainer}>
                <TimeInputGroup
                    startTime={setting.営業時間帯[0].開始}
                    endTime={setting.営業時間帯[0].終了}
                    onStartTimeChange={(val) => updateRange('開始', val)}
                    onEndTimeChange={(val) => updateRange('終了', val)}
                />

                <CountInputGroup
                    minStaff={setting.営業時間帯[0].最小人数}
                    maxStaff={setting.営業時間帯[0].最大人数}
                    onMinChange={(val) => updateRange('最小人数', val)}
                    onMaxChange={(val) => updateRange('最大人数', val)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#f0f4f0',
        gap: 12,
    },
    dayLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: '#334155',
    },
    inputsContainer: {
        flexDirection: 'column',
        gap: 12,
    },
});

export default DaySettingRow;
