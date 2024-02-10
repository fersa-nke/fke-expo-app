import React, { useState, useRef } from 'react';
import {
  View, Text,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Linking,
  Alert
} from 'react-native';
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
import { 
  getAttachments, 
  saveReportAttachment, 
  removeAttachment, 
  downloadAttachment, 
  setDownloadAttachment 
  } from '../../redux/Attachments/AttachmentActions';
import { useEffect } from 'react';
import Ribbon from "../../shared/Ribbon";
import PreviewImage from "../../assets/images/previewImage.png";
import * as ImagePicker from 'expo-image-picker';
import IconComp from '../../shared/IconComp';
import displayToast from '../../services/ToastService';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import Loader from '../../shared/Loader';
import * as MediaLibrary from 'expo-media-library';
import mime from 'mime';
import ActionSheet from 'react-native-actionsheet';
import * as Print from 'expo-print';
import { showLoader } from '../../redux/Master/MasterActions';
import { Camera } from 'expo-camera';

function ReportView({ route }) {
  let actionSheet = useRef();
  const reportId = route.params?.Id;
  const [previewModal, setPreviewModal] = useState(false);
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const appDirectory = FileSystem.cacheDirectory + 'MROtracker/';
  const dispatch = useDispatch();
  const attachments = useSelector(state => state.attachmentsReducer.attachments);
  const downloadedFile = useSelector(state => state.attachmentsReducer.downloadedFile);
  const [openFileObj, setOpenFileObj] = useState({});
  const loading = useSelector((state) => state.masterReducer.pageLoader);
  const [cameraPermission, requestPermission] = Camera.useCameraPermissions();

  const IconsType = {
    "application/pdf": 'Pdf',
    "application/image": 'Image',
    "image/jpeg": 'Image'
  };

  var optionArray = ['Capture', 'Upload File', 'Upload From Gallery', 'Cancel'];

  const showActionSheet = () => {
    //To show the Bottom ActionSheet
    actionSheet.current.show();
  };

  const imageMimeTypes = ['application/pdf'];

  useEffect(() => {
    dispatch(getAttachments(reportId));
  }, []);

  const onDeleteAttachment = (id) => {
    console.log('delete attachment', id);
    dispatch(removeAttachment(id))
  }

  const onViewAttachment = (path, fileDate, fileName, fileType, location) => {
    dispatch(setDownloadAttachment(null));
    dispatch(downloadAttachment(path));
    console.log('file type', fileType);
    setOpenFileObj({ path, fileDate, fileName, fileType, location });
    setPreviewModal(true);
  }

  async function ensureDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(appDirectory);
    if (!dirInfo.exists) {
      console.log("Gif directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(appDirectory, { intermediates: true });
    }
  }

  const downLoadFile = async () => {
    //const filename = openFileObj.fileName;
    const fileType = openFileObj.fileType;
    const uri = `data:${fileType};base64,${downloadedFile}`;
    const extenstion = mime.getExtension(fileType);
    try {
      const filename = FileSystem.documentDirectory + openFileObj.fileName + '.' + extenstion;
       save(filename, openFileObj.fileType, openFileObj.location); 
      // await FileSystem.writeAsStringAsync(filename, downloadedFile, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });
      // if(extenstion != 'pdf') {
      //   await MediaLibrary.saveToLibraryAsync(filename);
      //   displayToast('success', 'Downloaded succesfully');
      // } else {
      //   shareAsync(filename);
      // }     
    }
    catch (e) {
      console.log('error', e);
      displayToast('error', 'Something went wrong!');
    }
    //   const fr = new FileReader();
    //   fr.onload = async () => {
    //     const fileUri = `${FileSystem.documentDirectory}/${filename}`;
    //     await FileSystem.writeAsStringAsync(fileUri, downloadedFile, { encoding: FileSystem.EncodingType.Base64 });
    //     shareAsync(fileUri);
    //   };
    //   fr.readAsDataURL(downloadedFile);
  };

  const save = async (filename, mimetype, remoteURI) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      console.log(permissions, 'permissions status');
      if (permissions.granted) {
        const base64 = await FileSystem.writeAsStringAsync(filename, downloadedFile, {
            encoding: FileSystem.EncodingType.Base64,
          });
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, downloadedFile, { encoding: FileSystem.EncodingType.Base64 });
            alert('Downloaded succesfully! Check in' +permissions.directoryUri);
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(filename);
      }
    } else {
      dispatch(showLoader(true));
      const tfilename = openFileObj.fileName.replace(/ /g,"-");
      console.log(remoteURI, tfilename);
      const result = await FileSystem.downloadAsync(
        remoteURI,
        FileSystem.documentDirectory + tfilename
      );
      await shareAsync(result.uri);
      dispatch(showLoader(false));
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
   // console.log(permission);

    try {
      if (!cameraPermission.granted) {
        
        return requestPermission().then((cameraPermission) => {
          if(cameraPermission.granted) {
            console.log(cameraPermission);
            launchCamera();
          }
          else {
            Alert.alert('Permission denied', 'MRO Tracker does not have permission to access your camera. please go to Settings and enable it', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Settings', onPress: () => Linking.openSettings()},
            ]);
          }
        });
      // Camera permissions are not granted yet
      //  return ImagePicker.requestCameraPermissionsAsync().then((cameraPermission) => {
      //   console.log(cameraPermission);
      //   if(cameraPermission.granted) {
      //     launchCamera();
      //   }
      //   }
      //   );
      }
      launchCamera();
    } catch (err) {
      console.log(err);
    }
  };


  const launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true
    });
    console.log('hello', result);
    if (!result.canceled) {
      let date = new Date();
      let file = {
        ...result.assets[0]
      };
      console.log('file------->', result, file);
      dispatch(saveReportAttachment(file, 'JobReport', reportId));
      // setImage(result.assets[0].uri);
    }
  }

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        allowMultiSelection: true,
        copyToCacheDirectory: true
      }).then((res) => {
        if (res.type == 'cancel') {
          throw 'error';
        } else {
          console.log('response file____>', res);
          //res.id = `${new Date().getTime()}`;
          // res.fileDate = `${new Date()}`;
          // let temparray = [...documents, res];
          dispatch(saveReportAttachment(res, 'JobReport', reportId));
          // setDocuments(temparray);
        }
      });

    } catch (err) {

    }
  };


  const pickFromGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true
      });
      console.log('hello', result);
      if (!result.canceled) {
        let date = new Date();
        let file = {
          ...result.assets[0]
        };
        console.log('file------->', result, file);
        dispatch(saveReportAttachment(file, 'JobReport', reportId));
        // setImage(result.assets[0].uri);
      }
    } catch (err) {

    }
  };

  return (
    <>
      <ScrollView>

        <View style={GBStyles.container}>
          <Row style={{ marginVertical: 24 }}>
            {/* <Ripple style={[Styles.reportUpload, { marginRight: 6 }]} onPress={pickImage}>
              <IconComp name="Camera" size={22} color={theme.textBlue} />
              <Text style={Styles.reportUploadTitle}>CAPTURE</Text>
              <Text style={Styles.reportUploadHelpTxt}>
                Please capture from your device camera
              </Text>
            </Ripple> */}
            <Ripple style={[Styles.reportUpload, { marginLeft: 6 }]} onPress={showActionSheet}>
              <Row><IconComp name="File" size={16} color={theme.textBlue} /><Text style={Styles.reportUploadTitle}>UPLOAD</Text></Row>
            
              <Text style={Styles.reportUploadHelpTxt}>
                Please upload PDF, JPG, JPEG, PNG formats
              </Text>
            </Ripple>
          </Row>
          {attachments?.map(doc => (
            <View key={doc.Id}>
              <Document
                fileDate={doc.UpdatedAt}
                fileName={doc.Name}
                fileType={doc.MimeType}
                id={doc.Id}
                path={doc.Path}
                location={doc.Location}
                onDelete={onDeleteAttachment}
                onView={onViewAttachment}
              />
            </View>
          ))}


          {/* <Ripple style={GBStyles.upload} onPress={pickFile}>
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
        </Ripple> */}
          <Button text="Close" style={{ marginTop: 20 }} type="Secondary" onPress={() => navigation.navigate('JobDetails', { id: 1 })} />
        </View>
      </ScrollView>
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
              {downloadedFile ? <>
                {IconsType[openFileObj.fileType] !== 'Pdf' ?
                  <Image
                    resizeMethod="auto"
                    resizeMode="contain"
                    style={Styles.image}
                    source={{ uri: `data:image/png;base64,${downloadedFile}` }}
                  /> : <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
                    {/* <PDFView
              fadeInDuration={250.0}
              style={{ flex: 1 }}
              resource={downloadedFile}
              resourceType={'base64'}
              onLoad={() => console.log(`PDF rendered from base64`)}
              onError={(error) => console.log('Cannot render PDF', error)}
            /> */}
                    <Icon name="Pdf" size={100} color={theme.textGray} />
                  </View>
                }
              </> : <></>}

              <View style={GBStyles.container}>
                <Text style={Styles.fileName}>{openFileObj.fileName}</Text>
                <Text style={Styles.fileDate}>{openFileObj.fileDate}</Text>
                
               {
                loading ? <ActivityIndicator
                  animating={true}
                  color="#000000"
                  size="large"
                  style={Styles.activityIndicator}
                /> : <Button
                text="Download"
                type="Primary"
                style={{ marginTop: 20 }}
                onPress={downLoadFile}
              />
               }
                
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
      <ActionSheet
          ref={actionSheet}
          // Title of the Bottom Sheet
          title={'Which one do you like ?'}
          // Options Array to show in bottom sheet
          options={optionArray}
          // Define cancel button index in the option array
          // This will take the cancel option in bottom
          // and will highlight it
          cancelButtonIndex={4}
          // Highlight any specific option
          destructiveButtonIndex={3}
          onPress={(index) => {
            // Clicking on the option will give you alert
            switch(index) {
              case 0: 
              pickImage();
              break;
              case 1:
                pickFile();  
              break;
              case 2:
                pickFromGallery();
              break;
            }
          }}
        />

      <Loader loading={loading} />

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
  activityIndicator: {
    alignItems: 'center',
    height: 80,
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
  },
  reportUpload: {
    borderWidth: 1,
    borderColor: theme.bgBlue,
    borderStyle: 'dashed',
    backgroundColor: theme.bgWhite,
    padding: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center'
  },
  reportUploadTitle: {
    fontSize: 16,
    color: theme.textBlack,
    fontWeight: '700',
    marginLeft: 6

  },
  reportUploadHelpTxt: {
    fontSize: 10,
    color: theme.textBlack,
    textAlign: 'center',
    marginTop: 6
  }

});
export default ReportView;
