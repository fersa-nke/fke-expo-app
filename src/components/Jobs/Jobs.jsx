import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { FloatingAction } from "react-native-floating-action";
import GBStyles from "../../assets/globalstyles";
import JobCard from "./JobCard";
import BarCode from "../../assets/images/qr.png";
import Button from "../../shared/Button";
import theme from "../../assets/theme";
import Ribbon from "../../shared/Ribbon";
import { useSelector, useDispatch } from "react-redux";
import { getJobs, removeJob, setSelectedJobId } from "../../redux/Jobs/JobsActions";
import {
  getExchangeTypes,
  getBearingTypes,
  getBrands,
  getModels,
  getReasonOfChanges,
  getShaftPositions,
} from "../../redux/Master/MasterActions";
import { useNavigation } from "@react-navigation/native";
import {JobsInitialLoader} from "../../shared/InitialLoaders";

function Jobs() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const removeFromJobs = (job) => dispatch(removeJob(job));
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const pagerLoader = useSelector((state) => state.jobsReducer.pageLoader);
  const showLoadMore = useSelector((state) => state.jobsReducer.pageInfo.isLastPage);
  const fetchExchangeTypes = () => dispatch(getExchangeTypes());
  const fetchShaftPositions = () => dispatch(getShaftPositions());
  const fetchReasonOfChanges = () => dispatch(getReasonOfChanges());
  const fetchBrands = () => dispatch(getBrands());
  const fetchModels = () => dispatch(getModels());
  const fetchBearingTypes = () => dispatch(getBearingTypes());

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      
    dispatch(getJobs())
    fetchExchangeTypes();
    fetchShaftPositions();
    fetchReasonOfChanges();
    fetchBrands();
    fetchModels();
    fetchBearingTypes();

    });
    return unsubscribe;
    
  }, [dispatch, navigation]);

  const loadMore = () => {
    
    // if ((results.length) < totalCount) {
    //   setShowLoadMore(false);
    //   setPagerLoader(true);
    //   let p = pageNumber + 1;
    //   // fetch another next page results
    //   setPageNumber(p);
    //   fetchData(p);
    // } else {
    //   console.log("no loadmore button")
    // }
  }

  const handleRemoveJob = (job) => {
    removeFromJobs(job);
  };

  const navigateToJobDetails = (Id) => {
    console.log(Id);
    dispatch(setSelectedJobId(Id));
    navigation.navigate('JobDetails',{id: Id});
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bgWhite} />
      <ScrollView style={Styles.jobs}>
        <View style={GBStyles.container}>
          <Text style={GBStyles.pageTitle}>Jobs</Text>
          {(jobs.length > 0) ? (
            <JobCard list={jobs} onHandlePress={navigateToJobDetails} />
          ) : (
            <>
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <JobsInitialLoader key={idx} />
              ))}
            </>
          )}
        </View>
        <View style={Styles.loadMoreCont} >
            {pagerLoader && <ActivityIndicator size="large" />}
            {showLoadMore === false && <Button title="Load more.." onPress={loadMore}></Button>}
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
  loadMoreBtn: {
    marginBottom: 20
  },
  loadMoreCont: {
    marginBottom: 10
  }
});

export default Jobs;
