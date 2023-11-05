import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Button,
  ActivityIndicator,
} from "react-native";
import GBStyles from "../../assets/globalstyles";
import JobCard from "./JobCard";
import theme from "../../assets/theme";
import { useSelector, useDispatch } from "react-redux";
import {
  getJobs,
  getJobsBySearchQuery,
  removeJob,
  setSelectedJobId,
} from "../../redux/Jobs/JobsActions";
import {
  getExchangeTypes,
  getBearingTypes,
  getBrands,
  getModels,
  getReasonOfChanges,
  getShaftPositions,
  getGeneratorModels,
  getWindFarms,
  getWindLocations,
  getStates,
} from "../../redux/Master/MasterActions";
import { useNavigation } from "@react-navigation/native";
import { JobsInitialLoader } from "../../shared/InitialLoaders";
import IconComp from "../../shared/IconComp";
import Ripple from "react-native-material-ripple";
import NoData from "../../shared/NoData";
import nodata from "../../assets/images/nodata.png";
import Loader from "../../shared/Loader";

function SearchJobsResult({ route }) {
  const type = route.params?.type;
  const query = route.params?.query;
  const formObj = route.params?.formObj;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const removeFromJobs = (id) => dispatch(removeJob(id));
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const searchJobsResult = useSelector((state) => state.jobsReducer.searchJobs);
  const pagerLoader = useSelector((state) => state.jobsReducer.pageLoader);
  const showLoadMore = useSelector(
    (state) => state.jobsReducer.pageInfo.isLastPage
  );

  useEffect(() => {
    //console.log(type);
    if (type === "search") {
      //console.log(query);
      dispatch(getJobsBySearchQuery(query, formObj));
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [route]);

  const loadMore = () => {};
  const handleRemoveJob = (Id) => {
    removeFromJobs(Id);
  };

  const navigateToJobDetails = (Id) => {
    dispatch(setSelectedJobId(Id));
    navigation.navigate("JobDetails", { Id: Id });
  };

  const onEditClick = (Id) => {
    dispatch(setSelectedJobId(Id));
    navigation.navigate("EditJob", { Id: Id });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bgWhite} />
      <ScrollView style={Styles.jobs}>
        <View style={[GBStyles.container, { paddingBottom: 50 }]}>
          <Text style={GBStyles.pageTitle}>
            {type === "search" ? "Search Results" : "jobs"}
          </Text>
          {loading && (
            <View style={{ padding: 18 }}>
              {[1, 2, 3, 4, 5].map((idx) => (
                <JobsInitialLoader key={idx} />
              ))}
            </View>
          )}
          {type === "search" ? (
            <>
              {!pagerLoader && searchJobsResult.length === 0 ? (
                <NoData
                  title="No Jobs"
                  image={nodata}
                  description="MRO JOBS NOT FOUND"
                />
              ) : (
                <JobCard
                  list={searchJobsResult}
                  onHandlePress={navigateToJobDetails}
                  JobEdit={onEditClick}
                  JobDelete={handleRemoveJob}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </View>
        {/* <View style={Styles.loadMoreCont} >
            {pagerLoader == true ? <ActivityIndicator size="large" /> : <></>}
            {!showLoadMore && !pagerLoader  && <Button title="Load more.." onPress={loadMore}></Button>}
          </View> */}
      </ScrollView>
    </>
  );
}

const Styles = StyleSheet.create({
  jobs: {
    backgroundColor: theme.bgLight,
  },
  addJobBtn: {
    position: "absolute",
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: theme.bgBlue,
    right: 16,
    bottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loadMoreBtn: {
    marginBottom: 20,
  },
  loadMoreCont: {
    marginBottom: 10,
  },
});

export default SearchJobsResult;
