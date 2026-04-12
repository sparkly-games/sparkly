import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Send, LogOut, MessageSquare, Plus, AlertCircle, X } from 'lucide-react-native';
import { supabase } from '@/assets/data/supabase'; 

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [toast, setToast] = useState({ message: '', visible: false });

  const auth = getAuth();
  const router = useRouter();

  const showToast = (msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 5000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchRooms(firebaseUser.email);
        setLoading(false);
      } else {
        router.replace('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchRooms = async (email) => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .or(`participant_1_email.eq.${email.toLowerCase()},participant_2_email.eq.${email.toLowerCase()}`);
    
    if (error) showToast("Load Error: " + error.message);
    else setRooms(data || []);
  };

  const handleStartChat = async () => {
    const targetEmail = newEmail.toLowerCase().trim();
    if (!targetEmail || !user) return;
    const myEmail = user.email.toLowerCase();
    const [e1, e2] = [myEmail, targetEmail].sort();

    try {
      // 1. Check if room exists
      let { data: room, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('participant_1_email', e1)
        .eq('participant_2_email', e2)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!room) {
        // 2. Create room if it doesn't exist
        const { data: newRoom, error: createError } = await supabase
          .from('rooms')
          .insert({ participant_1_email: e1, participant_2_email: e2 })
          .select()
          .single();
        
        if (createError) throw createError;
        room = newRoom;
      }

      setActiveRoom(room);
      setNewEmail('');
      fetchRooms(myEmail);
    } catch (err) {
      showToast(err.message);
    }
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /></View>;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}><Text style={styles.sidebarTitle}>Chats</Text></View>
        <View style={styles.searchBar}>
          <TextInput 
            placeholder="Search email..." 
            value={newEmail} 
            onChangeText={setNewEmail}
            style={styles.searchInput}
            onSubmitEditing={handleStartChat}
          />
          <TouchableOpacity onPress={handleStartChat} style={styles.addBtn}><Plus size={20} color="white"/></TouchableOpacity>
        </View>
        <ScrollView style={styles.roomsList}>
          {rooms.map(room => (
            <TouchableOpacity 
              key={room.id} 
              style={[styles.roomItem, activeRoom?.id === room.id && styles.activeRoomItem]}
              onPress={() => setActiveRoom(room)}
            >
              <MessageSquare size={18} color="#666" style={{marginRight: 10}} />
              <Text style={styles.roomText}>
                {room.participant_1_email === user.email ? room.participant_2_email : room.participant_1_email}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.chatWindow}>
        {activeRoom ? (
           <View style={styles.centered}><Text>Chat ID: {activeRoom.id}</Text></View>
        ) : (
          <View style={styles.centered}><Text style={{color: '#999'}}>Choose a conversation</Text></View>
        )}
      </View>

      {/* TOAST COMPONENT */}
      {toast.visible && (
        <View style={styles.fixedToast}>
          <AlertCircle size={20} color="white" />
          <Text style={styles.fixedToastText}>{toast.message}</Text>
          <TouchableOpacity onPress={() => setToast({visible: false})}><X size={16} color="white" /></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#FFF' },
  sidebar: { width: 320, borderRightWidth: 1, borderColor: '#EEE', backgroundColor: '#F9F9F9' },
  sidebarHeader: { padding: 25 },
  sidebarTitle: { fontSize: 22, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 15 },
  searchInput: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 10 },
  addBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 10, marginLeft: 8 },
  roomsList: { flex: 1 },
  roomItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  activeRoomItem: { backgroundColor: '#E7F2FF' },
  roomText: { fontSize: 14, fontWeight: '500' },
  chatWindow: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fixedToast: {
    position: 'absolute', // React Native uses absolute for overlays
    top: 50,
    alignSelf: 'center',
    width: 350,
    backgroundColor: '#E11D48',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,
  },
  fixedToastText: { color: 'white', fontWeight: '600', fontSize: 14, flex: 1, marginLeft: 12 }
});