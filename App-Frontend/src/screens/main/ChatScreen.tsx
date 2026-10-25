import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import ChatModal from '../../components/chat/ChatModal';

export default function ChatScreen() {
    const navigation = useNavigation<any>();
    const [visible, setVisible] = useState(true);

    const handleClose = useCallback(() => {
        setVisible(false);
        navigation.goBack();
    }, [navigation]);

    return <ChatModal visible={visible} onClose={handleClose} />;
}
