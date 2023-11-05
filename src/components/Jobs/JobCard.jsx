import React, { useState, useRef, createRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Tost,
} from "react-native";
import displayToast from "../../services/ToastService";
import theme from "../../assets/theme";
import Icon from "../../shared/IconComp";
import GBStyles from "../../assets/globalstyles";
import Row from "../../shared/Row";
import Ripple from "react-native-material-ripple";
import defaultIcon from "../../assets/images/default.png";
import BarCode from "../../assets/images/barcode.png";
import { useNavigation } from "@react-navigation/native";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import IconComp from "../../shared/IconComp";

import { KEYMapper as JOBKEYMapper } from "./../../services/UserConfig";

function JobCard({ list, onHandlePress, JobEdit, JobDelete }) {
  const jobs = list;
  const navigation = useNavigation();
  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);
  const jobRow = useRef([]);

  const onOpen = (index) => {
    //console.log(index);
    let currswipeable = jobRow[index];
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== currswipeable) {
      currentlyOpenSwipeable.close();
    }
    setCurrentlyOpenSwipeable(currswipeable);
  };

  const onClose = () => {
    // setCurrentlyOpenSwipeable(null);
  };

  const closeSwipe = () => {
    //console.log("close opened swipe");
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.close();
    }
  };

  const renderLeftActions = (Id) => {
    return (
      <Row
        style={{
          height: 80,
          marginTop: "3%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f2f2f2",
        }}
      >
        <Ripple
          style={{
            width: 70,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.bgBlue,
          }}
          onPress={() => {
            closeSwipe();
            JobEdit(Id);
          }}
        >
          <IconComp name="Edit" size={24} color={theme.textWhite} />
        </Ripple>
        <Ripple
          style={{
            width: 70,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "red",
          }}
          onPress={() => {
            closeSwipe();
            JobDelete(Id);
          }}
        >
          <IconComp name="Delete" size={24} color={theme.textWhite} />
        </Ripple>
      </Row>
    );
  };
  // const newRes = jobs
  //   .map((item) => item);
  const newRes = jobs
    ?.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.JobId === value.JobId)
    )
    .map((item) => item);

  return (
    <>
      {newRes?.map((job, index) => {
        console.log(job.isSync, "job.isSync");
        return (
          <GestureHandlerRootView key={job.Id}>
            <Swipeable
              ref={(ref) => (jobRow[index] = ref)}
              renderRightActions={() => renderLeftActions(job.Id)}
              onSwipeableOpen={() => onOpen(index)}
              onSwipeableClose={() => onClose(index)}
            >
              <TouchableOpacity onPress={() => onHandlePress(job.Id)}>
                <Row style={[Styles.card]}>
                  {job.offline && <Text style={Styles.offline}>Offline</Text>}
                  <Image
                    source={
                      job[JOBKEYMapper.DATAMATRIX] ||
                      job[JOBKEYMapper.NDEDATAMATRIX] ||
                      job[JOBKEYMapper.DEDATAMATRIX]
                        ? BarCode
                        : defaultIcon
                    }
                    width={40}
                    height={40}
                    style={{
                      marginTop: 0,
                      marginLeft: 3,
                      marginBottom: 5,
                      marginRight: 14,
                      width: 80,
                    }}
                    resizeMethod="auto"
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={Styles.cardTitle} numberOfLines={1}>
                        {job[JOBKEYMapper.JOBID]}
                      </Text>
                      {job.isSync === 1 && (
                        <>
                          <Image
                            source={require("../../assets/images/offline.png")}
                            style={{ width: 20, height: 20 }}
                            resizeMethod="auto"
                            resizeMode="center"
                          />
                          <Text>{job.Date}</Text>
                        </>
                      )}
                    </View>
                    <Text style={Styles.cardTitle} numberOfLines={1}>
                      {job[JOBKEYMapper.CUSTOMERWINDFARM]?.length > 0
                        ? job[JOBKEYMapper.CUSTOMERWINDFARM][0].Name
                        : ""}
                    </Text>
                    <Text style={Styles.cardDescription} numberOfLines={2}>
                      {job[JOBKEYMapper.JOBDATE]}
                    </Text>
                    <Row
                      style={Styles.cardFooter}
                      justifyContent="space-between"
                    >
                      <Row>
                        <Icon
                          name="Operator"
                          size={14}
                          color={theme.textBlue}
                        />
                        <Text style={Styles.operatorName}>
                          {job[JOBKEYMapper.OPERATORNAME]}
                        </Text>
                      </Row>
                      <Ripple
                        style={Styles.circleBtn}
                        onPress={() => onHandlePress(job.Id, "reports")}
                      >
                        <Icon name="Report" size={14} color={theme.textBlue} />
                      </Ripple>
                    </Row>
                  </View>
                </Row>
              </TouchableOpacity>
            </Swipeable>
          </GestureHandlerRootView>
        );
      })}
    </>
  );
}

const Styles = StyleSheet.create({
  card: {
    backgroundColor: theme.bgWhite,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 12,
    position: "relative",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.textBlack,
    marginBottom: 0,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 12,
    marginTop: 2,
    color: theme.textGray,
    fontWeight: "500",
  },
  cardFooter: {
    borderTopWidth: 1,
    borderColor: theme.border,
    borderStyle: "solid",
    paddingTop: 4,
    marginTop: 0,
  },
  operatorName: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.textBlue,
    marginLeft: 4,
  },
  circleBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  offline: {
    fontSize: 10,
    color: theme.textBlack,
    fontStyle: "italic",
    position: "absolute",
    top: 0,
    right: 16,
    backgroundColor: "#FCDDEC",
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
});

export default JobCard;
