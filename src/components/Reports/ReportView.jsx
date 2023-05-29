import React, {useState} from 'react';
import {View, Text,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView} from 'react-native';
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
import {getAttachments, saveReportAttachment, removeAttachment, downloadAttachment } from '../../redux/Attachments/AttachmentActions';
import { useEffect } from 'react';
import Ribbon from "../../shared/Ribbon";
import PreviewImage from "../../assets/images/previewImage.png";
import PDFView from 'react-native-view-pdf';
import * as ImagePicker from 'expo-image-picker';


function ReportView({route}) {
  const jobId = route.params?.Id;
  const [previewModal, setPreviewModal] = useState(false);
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const dispatch = useDispatch();
  const attachments = useSelector(state => state.attachmentsReducer.attachments);
  const downloadedFile = useSelector(state => state.attachmentsReducer.downloadedFile);
  const [openFileObj, setOpenFileObj] = useState({});
  const IconsType = {
    "application/pdf": 'Pdf',
    "application/image": 'Image',
    "image/jpeg": 'Image'
  };

  const imageMimeTypes = ['application/pdf'];

 useEffect(() => {
  dispatch(getAttachments(jobId));
 }, []); 

 const onDeleteAttachment = (id) => {
  console.log('delete attachment',id);
  dispatch(removeAttachment(id))
 }

 const onViewAttachment = (path, fileDate, fileName, fileType) => {
  dispatch(downloadAttachment(path));
  console.log('file type', fileType);
  setOpenFileObj({path, fileDate, fileName, fileType});
  setPreviewModal(true);
 }

 const downLoadFile = () => {
  console.log('download file');
 };

 const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  try {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true
  });
    if (!result.canceled) {
      let date = new Date();
      let dateFormate = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
      let file = {...result,
        mimeType:'image/jpeg',
        name: `RP-${dateFormate}`
      };
      console.log(result, file);
      dispatch(saveReportAttachment(file, 'JobReport', jobId));
     // setImage(result.assets[0].uri);
    }
  } catch (err) {
    
  }
};

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
        //res.id = `${new Date().getTime()}`;
        //res.fileDate = `${new Date()}`;
       // let temparray = [...documents, res];
       dispatch(saveReportAttachment(res, 'JobReport', jobId));        
       // setDocuments(temparray);
      } 
    });
    
  } catch (err) {
    
  }
};
  return (
    <>
    <View style={GBStyles.container}>
      {attachments?.map(doc => (
          <View key={doc.Id}>
        <Document
          fileDate={doc.UpdatedAt}
          fileName={doc.Name}
          fileType={doc.MimeType}
          id = {doc.Id}
          path = {doc.Path}
          onDelete={onDeleteAttachment}
          onView={onViewAttachment}
        />
        </View>
        ))}
       
      <Ripple style={GBStyles.upload} onPress={pickFile}>
          <Text style={GBStyles.uploadTitle}>upload report</Text>
          <Text style={GBStyles.uploadHelpText}>
            Please upload PDF, jPG, JPEG, PNG formate files only.
          </Text>
        </Ripple>
        <Ripple style={GBStyles.upload} onPress={pickImage}>
          <Text style={GBStyles.uploadTitle}>upload report</Text>
          <Text style={GBStyles.uploadHelpText}>
            Please upload PDF, jPG, JPEG, PNG formate files only.
          </Text>
        </Ripple>
      <Button text="Close" type="Secondary"  onPress={() => navigation.navigate('JobDetails', {id: 1})} />
    </View>

    <Modal visible={previewModal} animationType="slide" transparent={true}>
        <SafeAreaView style={{ flex: 1 }}>
          <Ribbon />
          <View style={GBStyles.modalContent}>
            <Row style={GBStyles.modalHeader} justifyContent="space-between">
              <Ripple
                style={GBStyles.rippleBtn}
                onPress={() => setPreviewModal(false)}
              >
                <Icon name="LeftAngle" size={20} color={theme.textBlue} />
              </Ripple>
              <Text style={GBStyles.modalTitle}>Report View</Text>
              <Ripple
                style={GBStyles.rippleBtn}
                onPress={() => setPreviewModal(false)}
              >
                <Icon name="Close" size={20} color={theme.textBlue} />
              </Ripple>
            </Row>
            <ScrollView style={GBStyles.modalBody}>
            {downLoadFile ? <>  
              {IconsType[openFileObj.fileType] !== 'Pdf' ? 
           <Image
               resizeMethod="auto"
               resizeMode="contain"
               style={Styles.image}
              source={{uri: `data:image/png;base64,${downloadedFile}`}}
            /> : <View style={{ flex: 1 }}>
            {/* <PDFView
              fadeInDuration={250.0}
              style={{ flex: 1 }}
              resource={downloadedFile}
              resourceType={'base64'}
              onLoad={() => console.log(`PDF rendered from base64`)}
              onError={(error) => console.log('Cannot render PDF', error)}
            /> */}
          </View>
           }
           </> : <></> }

            <View><Text>{openFileObj.fileType}{IconsType[openFileObj.fileType]}</Text></View>
          
              <View style={GBStyles.container}>
                <Text style={Styles.fileName}>{openFileObj.fileName}</Text>
                <Text style={Styles.fileDate}>{openFileObj.fileDate}</Text>
                <Button
                  text="Download"
                  type="Primary"
                  style={{ marginTop: 20 }}
                  onPress={downLoadFile}
                />
                <Button
                  text="Close"
                  type="Secondary"
                  style={{ marginTop: 20 }}
                  onPress={() => setPreviewModal(false)}
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
const Styles = StyleSheet.create({
  document: {
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: "solid",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: theme.bgWhite,
  },
  fileName: {
    fontSize: 14,
    color: theme.textBlack,
    fontWeight: "700",
    marginBottom: 3,
    marginRight: 16
  },
  fileDate: {
    fontSize: 12,
    color: theme.textGray,
  },
  image: {
    width: '100%',
    height: 450
  }
});
export default ReportView;
