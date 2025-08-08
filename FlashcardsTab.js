import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import signalsDeck from './data/signals.json';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function FlashcardsTab(){
  const [cards, setCards] = useState(signalsDeck.cards);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  useEffect(()=> setCards(signalsDeck.cards),[]);

  const next = () => {
    setShowBack(false);
    setIndex((index + 1) % cards.length);
  };

  const flip = () => setShowBack(!showBack);

  const shuffle = () => {
    const s = [...cards].sort(()=>Math.random()-0.5);
    setCards(s);
    setIndex(0);
    setShowBack(false);
  };

  const markKnown = () => {
    const c = [...cards];
    c[index].known = (c[index].known || 0) + 1;
    setCards(c);
    next();
  };

  const exportDeck = async () => {
    const filename = FileSystem.documentDirectory + 'cror_signals_export.json';
    await FileSystem.writeAsStringAsync(filename, JSON.stringify({meta: signalsDeck.meta, cards}, null, 2));
    const canShare = await Sharing.isAvailableAsync();
    if(canShare) await Sharing.shareAsync(filename);
    else Alert.alert('Export saved', 'Saved to: ' + filename);
  };

  const card = cards[index] || {name:'(no cards)', short:'', definition:''};

  return (
    <SafeAreaView style={{flex:1, padding:12}}>
      <Text style={{fontSize:18, fontWeight:'600'}}>{signalsDeck.meta.name}</Text>
      <Text style={{color:'#666', marginTop:6}}>{signalsDeck.meta.description}</Text>

      <View style={styles.card}>
        <Text style={styles.title}>{card.name}</Text>
        {!showBack ? (
          <Text style={styles.front}>{card.short}</Text>
        ) : (
          <Text style={styles.back}>{card.definition}</Text>
        )}
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:12}}>
        <TouchableOpacity onPress={flip} style={styles.btn}><Text>Flip</Text></TouchableOpacity>
        <TouchableOpacity onPress={next} style={styles.btn}><Text>Next</Text></TouchableOpacity>
        <TouchableOpacity onPress={markKnown} style={styles.btn}><Text>Known</Text></TouchableOpacity>
        <TouchableOpacity onPress={shuffle} style={styles.btn}><Text>Shuffle</Text></TouchableOpacity>
      </View>

      <View style={{marginTop:12}}>
        <TouchableOpacity onPress={exportDeck} style={[styles.btn,{alignSelf:'flex-start'}]}>
          <Text>Export Deck (JSON)</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop:14}}>
        <Text>Card {index+1} / {cards.length}   Known: {card.known || 0}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card:{marginTop:12, padding:12, borderRadius:6, borderWidth:1, borderColor:'#ddd', minHeight:180, backgroundColor:'#fff', justifyContent:'center'},
  title:{fontSize:20, fontWeight:'700', marginBottom:8},
  front:{fontSize:16, color:'#333'},
  back:{fontSize:15, color:'#222'},
  btn:{padding:10, borderWidth:1, borderColor:'#007AFF', borderRadius:6}
});
