import React, {useState, useEffect} from 'react';
import { View, Text, SafeAreaView, Alert, ActivityIndicator, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Button } from 'react-native-paper';

const REMOTE_PDF = 'https://tc.canada.ca/sites/default/files/2022-05/canadian-rail-operating-rules-may-9-2022.pdf';

export default function ReaderTab(){
  const [downloading, setDownloading] = useState(false);
  const [havePdf, setHavePdf] = useState(false);
  const [localUri, setLocalUri] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try{
        const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'cror.pdf');
        if(info.exists){
          setHavePdf(true);
          setLocalUri(info.uri);
        }
      }catch(e){}
    })();
  },[]);

  const openRemoteInSafari = async () => {
    const ok = await Linking.canOpenURL(REMOTE_PDF);
    if(ok) Linking.openURL(REMOTE_PDF);
    else Alert.alert('Cannot open', REMOTE_PDF);
  };

  const downloadPdfToLocal = async () => {
    try{
      setDownloading(true);
      const downloadResumable = FileSystem.createDownloadResumable(REMOTE_PDF, FileSystem.documentDirectory + 'cror.pdf');
      const { uri } = await downloadResumable.downloadAsync();
      setLocalUri(uri);
      setHavePdf(true);
      Alert.alert('Downloaded', 'CROR PDF downloaded for offline use.');
    }catch(e){
      Alert.alert('Download failed', String(e));
    }finally{
      setDownloading(false);
    }
  };

  const openDownloaded = async () => {
    if(!localUri) return Alert.alert('No file', 'Please download first.');
    try{
      await Sharing.shareAsync(localUri);
    }catch(e){
      Alert.alert('Open failed', String(e));
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{padding:12}}>
        <Text style={{fontSize:18, fontWeight:'600'}}>CROR Reader</Text>
        <Text style={{marginTop:8, color:'#444'}}>
          To get an exact offline copy of the CROR inside the app, upload the official CROR PDF into the project's assets folder named 'cror.pdf' (see /assets/README_upload_cror.txt). If not present, you can open the official PDF in Safari.
        </Text>

        <View style={{marginTop:12, flexDirection:'row', gap:8}}>
          <Button mode="contained" onPress={openRemoteInSafari} style={{marginRight:8}}>Open in Safari (exact)</Button>
          <Button mode="outlined" onPress={downloadPdfToLocal} disabled={downloading}>
            {downloading ? 'Downloading...' : 'Download copy (to app storage)'}
          </Button>
        </View>

        <View style={{marginTop:10}}>
          <Button mode="contained" onPress={openDownloaded} disabled={!havePdf}>Open downloaded copy / Share</Button>
        </View>

        <View style={{marginTop:14}}>
          <Text style={{color:'#666'}}>
            Note: To make the app fully offline, add the PDF to the assets folder in Replit before running.
          </Text>
        </View>
      </View>

      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        {downloading && <ActivityIndicator size="large" />}
      </View>
    </SafeAreaView>
  );
}
