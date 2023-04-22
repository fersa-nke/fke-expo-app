import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { FloatingAction } from "react-native-floating-action";
import GBStyles from "../../assets/globalstyles";
import JobCard from "./JobCard";
import BarCode from "../../assets/images/qr.png";
import Button from "../../shared/Button";
import theme from "../../assets/theme";
import Ribbon from "../../shared/Ribbon";
import { useSelector, useDispatch } from "react-redux";
import { getJobs, removeJob } from "../../redux/Jobs/JobsActions";
import {
  getExchangeTypes,
  getBearingTypes,
  getBrands,
  getModels,
  getReasonOfChanges,
  getShaftPositions,
} from "../../redux/Master/MasterActions";
import { useNavigation } from "@react-navigation/native";

function Jobs() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const fetchJobs = () => dispatch(getJobs());
  const removeFromJobs = (job) => dispatch(removeJob(job));
  const jobs = useSelector((state) => state.jobsReducer.jobs);

  console.log("loaded jobs ***********************************>", jobs);
  const fetchExchangeTypes = () => dispatch(getExchangeTypes());
  const fetchShaftPositions = () => dispatch(getShaftPositions());
  const fetchReasonOfChanges = () => dispatch(getReasonOfChanges());
  const fetchBrands = () => dispatch(getBrands());
  const fetchModels = () => dispatch(getModels());
  const fetchBearingTypes = () => dispatch(getBearingTypes());

  useEffect(() => {
    fetchJobs();
    fetchExchangeTypes();
    fetchShaftPositions();
    fetchReasonOfChanges();
    fetchBrands();
    fetchModels();
    fetchBearingTypes();
  }, []);

  const handleRemoveJob = (job) => {
    removeFromJobs(job);
  };

  return (
    <>
      <ScrollView style={Styles.jobs}>
        <View style={GBStyles.container}>
          <Text style={GBStyles.pageTitle}>Jobs</Text>
          <JobCard
            list={jobs}
            onPress={() => navigation.navigate("JobDetails")}
          />
        </View>
      </ScrollView>
      <FloatingAction
        onPressMain={() => navigation.navigate("AddJob")}
        showBackground={false}
        color={theme.bgBlue}
      />
    </>
  );
}

const Styles = StyleSheet.create({
  jobs: {
    backgroundColor: theme.bgLight,
  },
  addJobBtn: {
    position: "absolute",
    height: 48,
    width: 150,
    borderRadius: 24,
    top: Dimensions.get("window").height - 160,
    left: "50%",
    transform: [{ translateX: -70 }],
    zIndex: 1,
  },
});

export default Jobs;
