import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Button,
  ActivityIndicator
} from "react-native";
import GBStyles from "../../assets/globalstyles";
import JobCard from "./JobCard";
import theme from "../../assets/theme";
import { useSelector, useDispatch } from "react-redux";
import {
  getJobs,
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
  getGeneratorModels
} from "../../redux/Master/MasterActions";
import { useNavigation } from "@react-navigation/native";
import { JobsInitialLoader } from "../../shared/InitialLoaders";
import IconComp from "../../shared/IconComp";
import Ripple from "react-native-material-ripple";
import NoData from "../../shared/NoData";
import nodata from "../../assets/images/nodata.png";
import Loader from '../../shared/Loader';

function Jobs({route}) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const removeFromJobs = (id) => dispatch(removeJob(id));
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const pagerLoader = useSelector((state) => state.jobsReducer.pageLoader);
  const showLoadMore = useSelector((state) => state.jobsReducer.pageInfo.isLastPage);
  const fetchExchangeTypes = () => dispatch(getExchangeTypes());
  const fetchShaftPositions = () => dispatch(getShaftPositions());
  const fetchReasonOfChanges = () => dispatch(getReasonOfChanges());
  const fetchBrands = () => dispatch(getBrands());
  const fetchModels = () => dispatch(getModels());
  const fetchBearingTypes = () => dispatch(getBearingTypes());
  const fetchGeneratorModels = () => dispatch(getGeneratorModels());
  const fetchJobs = () => dispatch(getJobs());

  useEffect(() => {
    fetchJobs();
    fetchExchangeTypes();
    fetchShaftPositions();
    fetchReasonOfChanges();
    fetchBrands();
    fetchModels();
    fetchBearingTypes();
    fetchGeneratorModels();
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  

  const loadMore = () => {
    dispatch(getJobs());
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
  };
  const handleRemoveJob = (Id) => {
    removeFromJobs(Id);
  };

  const navigateToJobDetails = (Id) => {
    dispatch(setSelectedJobId(Id));
    navigation.navigate('JobDetails',{Id: Id});
  }

  const onEditClick = (Id) => {
    dispatch(setSelectedJobId(Id));
    navigation.navigate('EditJob',{Id: Id});
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bgWhite} />
      <ScrollView style={Styles.jobs}>

        <View style={[GBStyles.container, {paddingBottom: 50}]}>
          <Text style={GBStyles.pageTitle}>Jobs</Text>
          {loading && <View style={{padding: 18}}>{[1,2,3,4,5].map((idx)=>(
       <JobsInitialLoader key={idx} />
     ))}</View>}
          {!pagerLoader && jobs.length === 0 ? (
            <NoData title="No Jobs" image={nodata} description="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s" />
          ) : (
            <JobCard list={jobs} onHandlePress={navigateToJobDetails} JobEdit={onEditClick} JobDelete={handleRemoveJob} />
          )}
        </View>
        <View style={Styles.loadMoreCont} >
            {pagerLoader == true ? <ActivityIndicator size="large" /> : <></>}
            {!showLoadMore && !pagerLoader  && <Button title="Load more.." onPress={loadMore}></Button>}
          </View>
      </ScrollView>
      <Ripple
        style={Styles.addJobBtn}
        onPress={() => navigation.navigate("AddJob", {Id: ''})}
      >
          <IconComp name="Add" size={20} color={theme.textWhite} />
      </Ripple>
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

export default Jobs;
