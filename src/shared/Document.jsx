import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import theme from "../assets/theme";
import Icon from "./IconComp";
import Row from "./Row";
import Ripple from "react-native-material-ripple";
import GBStyles from "../assets/globalstyles";
import Ribbon from "./Ribbon";
import Button from "./Button";
import PreviewImage from "../assets/images/previewImage.png";

const Document = ({ fileDate, fileName, fileType }) => {
  const [previewModal, setPreviewModal] = useState(false);

  const handlePreviewModal = () => {
    setPreviewModal(true);
  };

  const IconsType = {
    "application/pdf": 'Pdf',
    "application/image": 'Image'
  }

  return (
    <>
      <TouchableOpacity onPress={handlePreviewModal}>
        <Row style={Styles.document}>
          <Icon name={IconsType[fileType]} size={40} color={theme.textGray} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={Styles.fileName} numberOfLines={1}>
              {fileName}
            </Text>
            <Text style={Styles.fileDate} numberOfLines={1}>{new Date(fileDate).toDateString()}</Text>
          </View>
          <Ripple style={[GBStyles.rippleBtn, {marginRight: 8}]}>
            <Icon name="Download" size={18} color={theme.textBlue} />
          </Ripple>
          <Ripple style={GBStyles.rippleBtn}>
            <Icon name="Delete" size={18} color={theme.textRed} />
          </Ripple>
        </Row>
      </TouchableOpacity>

      {/* Preview Modal */}
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
              <Image
                source={PreviewImage}
                height={500}
                resizeMethod="auto"
                resizeMode="cover"
                style={{ width: "100%" }}
              />
              <View style={GBStyles.container}>
                <Text style={Styles.fileName}>Reports.Jpeg</Text>
                <Text style={Styles.fileDate}>06-04-2023</Text>
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
};

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
});

export default Document;
