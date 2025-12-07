import React from 'react';
import { Dimensions } from 'react-native';
import { Appbar, Divider, Menu } from 'react-native-paper';


interface ChatHeaderProps {
    title: string;
    onDrawerPress: () => void
}

const { width } = Dimensions.get('window');

export default function ChatHeader({ title, onDrawerPress }: ChatHeaderProps) {
    const [visible, setVisible] = React.useState(false);

    function openMenu() {
        console.log('called')
        setVisible(!visible)
    }

    function closeMenu() {
        console.log('called')

        setVisible(false)
    }
    return (
        <Appbar.Header>
            <Appbar.Action icon="menu" onPress={onDrawerPress} />
            <Appbar.Content title={title} />
            <Appbar.Action icon="dots-vertical" onPress={openMenu} />
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                mode='elevated'
                anchor={{ x: width - 8, y: 100 }}>
                <Menu.Item leadingIcon={'pencil-outline'} onPress={() => { }} title="Rename" />
                <Menu.Item leadingIcon={'information-outline'} onPress={() => { }} title="Chat Info" />
                <Divider />
                <Menu.Item leadingIcon={'delete'} onPress={() => { }} title="Delete" />
            </Menu>
        </Appbar.Header>
    )
}