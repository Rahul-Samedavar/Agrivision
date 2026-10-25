import FloatingChatButton from "../components/chat/FloatingChatButton";
import ChatModal from "../components/chat/ChatModal";

export default function TabNavigator() {
    const [chatVisible, setChatVisible] = useState(false);

    return (
        <>
            <Tab.Navigator ...>
            {/* screens */}
        </Tab.Navigator >

      <FloatingChatButton onPress={() => setChatVisible(true)} />

      <ChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
      />
    </>
  );
}