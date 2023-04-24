import React, {useState} from 'react';
import {View, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GBStyles from '../../assets/globalstyles';
import Ripple from 'react-native-material-ripple';
import Icon from '../../shared/IconComp';
import theme from '../../assets/theme';
import Row from '../../shared/Row';
import Document from '../../shared/Document';
import Button from '../../shared/Button';
import * as DocumentPicker from 'expo-document-picker';
import { useSelector, useDispatch } from "react-redux";
import {saveReportAttachment } from '../../redux/Attachments/AttachmentActions';

function ReportView() {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const dispatch = useDispatch();

 const pickFile = async () => {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      allowMultiSelection: true,
      copyToCacheDirectory: false
    }).then((res) => {
      if (res.type == 'cancel') {
        throw 'error';
      } else {
        console.log('response file____>',res.type, res);
        res.id = `${new Date().getTime()}`;
        res.fileDate = `${new Date()}`;
        let temparray = [...documents, res];
        dispatch(saveReportAttachment(res));        
        setDocuments(temparray);
        console.log('documents ------------>',temparray, res);
      } 
    });
    
  } catch (err) {
    
  }
};
  return (
    <View style={GBStyles.container}>
      {documents?.map(doc => (
          <View key={doc.id}>
        <Document
          fileDate={doc.fileDate}
          fileName={doc.name}
          fileType={doc.mimeType}
          key = {doc.id}
        />
        </View>
        ))}
       
      <Ripple style={GBStyles.upload} onPress={pickFile}>
          <Text style={GBStyles.uploadTitle}>upload report</Text>
          <Text style={GBStyles.uploadHelpText}>
            Please upload PDF, jPG, JPEG, PNG formate files only.
          </Text>
        </Ripple>
      <Button text="Close" type="Secondary"  onPress={() => navigation.navigate('JobDetails', {id: 1})} />
    </View>
  );
}

export default ReportView;
