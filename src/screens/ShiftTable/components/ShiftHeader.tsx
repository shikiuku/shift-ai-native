
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 曜日一覧 } from '../../../logic/types';

const ShiftHeader: React.FC = () => {
    return (
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
    );
};

const styles = StyleSheet.create({
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
});

export default ShiftHeader;
