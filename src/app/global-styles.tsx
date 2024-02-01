import { StyleSheet } from "react-native";

const temp2 = '#000'
const temp = 'rgba(0,0,0, .9)'

export const colors = {
    mainColor: '#B84AB5',
    secondaryColor: '#24D906',
    fiscalNoteColor: 'white',
    mainAppColor: temp,
    title: 'white',
    // productFooter: '#F8BFF6',
    productFooter: '#2e2e2e',
}

export const globalStyles = StyleSheet.create({
    buttonError: {
        backgroundColor: 'red',
    },
    buttonMainColor: {
        backgroundColor: colors.mainColor,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
    },
    cartHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});