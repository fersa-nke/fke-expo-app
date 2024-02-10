import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import theme from "../assets/theme";
import Icon from "./IconComp";
import Row from "./Row";
import Ripple from "react-native-material-ripple";
import GBStyles from "../assets/globalstyles";

import { downloadAttachment } from '../redux/Attachments/AttachmentActions';

const Document = ({ fileDate, fileName, fileType, path , location, id , onDelete, onView }) => {

  const IconsType = {
    "application/pdf": 'Pdf',
    "application/image": 'Image',
    "image/jpeg": "Image",
    "image/png": "Image",
    "text/plain": "Image"
  }

  return (
    <>
      <TouchableOpacity onPress={() => onView(path, fileDate, fileName, fileType, location)}>
        <Row style={Styles.document}>
          <Icon name={IconsType[fileType]} size={40} color={theme.textGray} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={Styles.fileName} numberOfLines={1}>
              {fileName}
            </Text>
            <Text style={Styles.fileDate} numberOfLines={1}>{new Date(fileDate).toDateString()}</Text>
          </View>
          {/* <Ripple style={[GBStyles.rippleBtn, {marginRight: 8}]}>
            <Icon name="Download" size={18} color={theme.textBlue} />
          </Ripple> */}
          <Ripple style={GBStyles.rippleBtn} onPress={() => onDelete(id)}>
            <Icon name="Delete" size={18} color={theme.textRed} />
          </Ripple>
        </Row>
      </TouchableOpacity>

      {/* Preview Modal */}

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
