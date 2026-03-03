import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../../../components/UI/CustomText";
import { Colors } from "../../../../styles/colors";


const SectionHeader = ({ title, onPress, showViewAll = true }) => {

    return (
        <View style={styles.sectionHeader}>
            <CustomText
                size={20}
                weight='bold'
            >{title}</CustomText>
            {showViewAll && <TouchableOpacity onPress={onPress}>
                <CustomText
                    color={Colors.primary}
                    weight='bold'
                    size={16}
                >View All</CustomText>
            </TouchableOpacity>}

        </View>
    )
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: 16,
        flex: 1
    },
})

export default SectionHeader;