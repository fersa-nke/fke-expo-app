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
  getLubricationGrades,
  getLubricationTypes
} from "../../redux/Master/MasterActions";
import { getUserLogo } from '../../redux/Attachments/AttachmentActions'
import { useNavigation } from "@react-navigation/native";
import { JobsInitialLoader } from "../../shared/InitialLoaders";
import IconComp from "../../shared/IconComp";
import Ripple from "react-native-material-ripple";
import NoData from "../../shared/NoData";
import nodata from "../../assets/images/nodata.png";
import Loader from '../../shared/Loader';
import displayToast from "../../services/ToastService";

function Jobs({route}) {
  const type = route.params?.type;
  const query = route.params?.query;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const removeFromJobs = (id) => dispatch(removeJob(id));
  const jobs = useSelector((state) => state.jobsReducer.jobs);
  const searchJobsResult = useSelector((state) => state.jobsReducer.searchJobs);
  const pagerLoader = useSelector((state) => state.jobsReducer.pageLoader);
  const showLoadMore = useSelector((state) => state.jobsReducer.pageInfo.isLastPage);
  const fetchExchangeTypes = () => dispatch(getExchangeTypes());
  const fetchShaftPositions = () => dispatch(getShaftPositions());
  const fetchReasonOfChanges = () => dispatch(getReasonOfChanges());
  const fetchBrands = () => dispatch(getBrands());
  const fetchModels = () => dispatch(getModels());
  const fetchBearingTypes = () => dispatch(getBearingTypes());
  const fetchGeneratorModels = () => dispatch(getGeneratorModels());
  const fetchStates = () => dispatch(getStates());
  const fetchWindFarms = () => dispatch(getWindFarms());
  const fetchWindLocations = () => dispatch(getWindLocations());
 // const fetchJobs = () => dispatch(getJobs());
  const fetchLubricationGrades = () => dispatch(getLubricationGrades());
  const fetchLubricationTypes = () => dispatch(getLubricationTypes());
  const fetchUserLogo = () => dispatch(getUserLogo());

  useEffect(() => {
   console.log('loaded fetch jobs', type); 
    if(type === 'search') {
      console.log(query);
      dispatch(getJobsBySearchQuery(query));
    } else {
        dispatch(getJobs());
    }

    fetchExchangeTypes();
    fetchShaftPositions();
    fetchReasonOfChanges();
    fetchBrands();
    fetchModels();
    fetchBearingTypes();
    fetchGeneratorModels();
    fetchStates();
    fetchWindFarms();
    fetchWindLocations();
    fetchLubricationGrades();
    fetchLubricationTypes();
    fetchUserLogo();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
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

  const navigateToJobDetails = (Id, viewType) => {
    dispatch(setSelectedJobId(Id));
    navigation.navigate('JobDetails',{Id: Id, viewType});
  }

  const onEditClick = (Id) => {
    dispatch(setSelectedJobId(Id));
    navigation.navigate('EditJob',{Id: Id});
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bgWhite} />
      <ScrollView style={Styles.jobs}>
      {/* <Loader loading={pagerLoader} /> */}
        <View style={[GBStyles.container, {paddingBottom: 50}]}>
          <Text style={GBStyles.pageTitle}>{type === 'search' ? 'Search Results' : 'jobs'}</Text>
          {loading && <View style={{padding: 18}}>{[1,2,3,4,5].map((idx)=>(
       <JobsInitialLoader key={idx} />
     ))}</View>}
          {!pagerLoader && jobs.length === 0 ? (
            <NoData title="No Jobs" image={nodata} description="MRO JOBS NOT FOUND" />
          ) : (
            <JobCard list={jobs} onHandlePress={navigateToJobDetails} JobEdit={onEditClick} JobDelete={handleRemoveJob} />
          )}
        </View>
        <View style={Styles.loadMoreCont} >
            {pagerLoader == true ? <ActivityIndicator size="large" /> : <></>}
            {/* {!showLoadMore && !pagerLoader  && <Button title="Load more.." onPress={loadMore}></Button>} */}
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
