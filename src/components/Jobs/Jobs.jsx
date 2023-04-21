import React, { useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import GBStyles from '../../assets/globalstyles';
import JobCard from './JobCard';
import BarCode from '../../assets/images/qr.png';
import Button from '../../shared/Button';
import theme from '../../assets/theme';
import { useSelector, useDispatch } from 'react-redux';
import { getJobs, removeJob } from '../../redux/Jobs/JobsActions';
import { getExchangeTypes, getBearingTypes, getBrands, getModels, getReasonOfChanges, getShaftPositions } from '../../redux/Master/MasterActions';
// const jobs = [
//   {
//     id: 1,
//     url: BarCode,
//     windFarm: 'Salesforce Developer Salesforce Developer',
//     windTurbine: 'vertical axis turbine',
//     date: '03-04-2023',
//     operator: 'John Doe',
//   },
//   {
//     id: 2,
//     url: BarCode,
//     windFarm: 'Salesforce Developer',
//     windTurbine: 'vertical axis turbine',
//     date: '03-04-2023',
//     operator: 'John Doe',
//   },
//   {
//     id: 3,
//     url: BarCode,
//     windFarm: 'Salesforce Developer',
//     windTurbine: 'vertical axis turbine',
//     date: '03-04-2023',
//     operator: 'John Doe',
//   },
//   {
//     id: 4,
//     url: BarCode,
//     windFarm: 'Salesforce Developer',
//     windTurbine: 'vertical axis turbine',
//     date: '03-04-2023',
//     operator: 'John Doe',
//   },
//   {
//     id: 5,
//     url: BarCode,
//     windFarm: 'Salesforce Developer',
//     windTurbine: 'vertical axis turbine',
//     date: '03-04-2023',
//     operator: 'John Doe',
//   },
//   {
//     id: 6,
//     url: BarCode,
//     windFarm: 'Salesforce Developer',
//     windTurbine: 'vertical axis turbine',
//     date: '03-04-2023',
//     operator: 'John Doe',
//   },
//   {
//     id: 7,
//     url: BarCode,
//     windFarm: 'Salesforce Developer',
//     windTurbine: 'vertical axis turbine',
//     date: '03-04-2023',
//     operator: 'John Doe',
//   },
//   {
//     id: 8,
//     url: BarCode,
//     windFarm: 'Salesforce Developer',
//     windTurbine: 'vertical axis turbine',
//     date: '03-04-2023',
//     operator: 'John Doe',
//   },
// ];
function Jobs({ navigation }) {
  const dispatch = useDispatch();
  const fetchJobs = () => dispatch(getJobs());
  const removeFromJobs = job => dispatch(removeJob(job));
  const jobs = useSelector((state) => state.jobsReducer.jobs);

  console.log('loaded jobs ***********************************>', jobs);
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

  const handleRemoveJob = job => {
    removeFromJobs(job);
  };

  return (
    <>
      <ScrollView style={Styles.jobs}>
        <View style={GBStyles.container}>
          <Text style={GBStyles.pageTitle}>Jobs</Text>
          <JobCard list={jobs} onPress={(navigation) => navigation.navigate("JobDetails")} />
        </View>


      </ScrollView>
      <Button
        text="add job"
        style={Styles.addJobBtn}
        buttonIcon={true}
        onPress={() => navigation.navigate('AddJob')}
      />
    </>
  );
}

const Styles = StyleSheet.create({
  jobs: {
    backgroundColor: theme.bgLight,
  },
  addJobBtn: {
    position: 'absolute',
    height: 48,
    width: 150,
    borderRadius: 24,
    top: Dimensions.get('window').height - 160,
    left: '50%',
    transform: [{ translateX: -70 }],
    zIndex: 1
  },
});

export default Jobs;
