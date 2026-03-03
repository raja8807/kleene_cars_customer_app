import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import CustomText from '../UI/CustomText';
import { Colors } from '../../styles/colors';
import moment from 'moment';

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM'
];

const SlotSelection = ({ onSlotSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Generate next 7 days
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const nextDays = [];
        for (let i = 0; i < 7; i++) {
            nextDays.push(moment().add(i, 'days'));
        }
        setDates(nextDays);
        // Default select today
        setSelectedDate(nextDays[0].format('YYYY-MM-DD'));
    }, []);

    useEffect(() => {
        if (selectedDate && selectedTime) {
            onSlotSelect({ date: selectedDate, time: selectedTime });
        } else {
            onSlotSelect(null);
        }
    }, [selectedDate, selectedTime]);

    const handleDateSelect = (dateStr) => {
        setSelectedDate(dateStr);
        setSelectedTime(null); // Reset time when date changes
    };

    return (
        <View style={styles.container}>
            <CustomText type="subheading" style={styles.title}>Schedule Service</CustomText>

            <CustomText weight="bold" style={styles.label}>Select Date</CustomText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                {dates.map((date, index) => {
                    const dateStr = date.format('YYYY-MM-DD');
                    const isSelected = dateStr === selectedDate;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.chip, styles.dateChip, isSelected && styles.selectedChip]}
                            onPress={() => handleDateSelect(dateStr)}
                        >
                            <CustomText
                                weight="bold"
                                size={12}
                                style={{ color: isSelected ? '#FFFFFF' : Colors.text.primary }}
                            >
                                {date.format('ddd').toUpperCase()}
                            </CustomText>
                            <CustomText
                                weight="bold"
                                size={18}
                                style={{ color: isSelected ? '#FFFFFF' : Colors.text.primary, marginTop: 4 }}
                            >
                                {date.format('D')}
                            </CustomText>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <CustomText weight="bold" style={styles.label}>Select Time Slot</CustomText>
            <View style={styles.timeGrid}>
                {TIME_SLOTS.map((time, index) => {
                    const isSelected = time === selectedTime;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.chip, styles.timeChip, isSelected && styles.selectedChip]}
                            onPress={() => setSelectedTime(time)}
                        >
                            <CustomText
                                size={12}
                                weight={isSelected ? "bold" : "regular"}
                                style={{ color: isSelected ? '#FFFFFF' : Colors.text.primary }}
                            >
                                {time}
                            </CustomText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 12,
        fontSize: 14,
        color: Colors.text.light,
    },
    dateScroll: {
        marginBottom: 20,
    },
    chip: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateChip: {
        width: 60,
        height: 70,
        borderRadius: 12,
        marginRight: 10,
    },
    selectedChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5
    },
    timeChip: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        margin: 5,
        minWidth: '28%', // roughly 3 per row
        flexGrow: 1,
    }
});

export default SlotSelection;
