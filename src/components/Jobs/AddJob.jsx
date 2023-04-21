import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Linking,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import theme from '../../assets/theme';
import GBStyles from '../../assets/globalstyles';
import Input from '../../shared/Input';
import Button from '../../shared/Button';
import Row from '../../shared/Row';
import Icon from '../../shared/IconComp';
import Ripple from 'react-native-material-ripple';
import Select from '../../shared/Select';
import {useSelector, useDispatch} from 'react-redux';
import {saveJob} from '../../redux/Jobs/JobsActions';
// import {RNCamera} from 'react-native-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';


const bearingTypes = [
  {
    brandid: 1,
    brandname: 'HYBRID',
  },
  {
    brandid: 2,
    brandname: 'INSULATED',
  },
  {
    brandid: 3,
    brandname: 'STANDARD',
  },
];

const AddJob = ({navigation}) => {
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState('');
  const dispatch = useDispatch();
  const saveJobData = () => dispatch(saveJob());
  const masterData = useSelector(state => state.masterReducer);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {

    setScanned(true);
    onSuccess(type, data);
   // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onSuccess = (type, data) => {

    if (type && data != null) {
      setResult(data);
      setScan(false);
    } else {
      setScan(true);
    }
  };

  const startScan = () => {
    setScan(true);
  };

  const handleSubmitPress = () => {
    setLoading(true);
    let data = {
      DataMatirx: 'D123',
      Date: '2023-03-20',
      JobId: '1213',
      Name: 'test job',
      Brand: [],
      Model: [],
      'Farm Name': 'test form',
      Comments: 'MRC - 6328 changes',
      'Reason Of Change': [
        {
          Id: 1,
          Name: 'New installation',
        },
      ],
      Customer: [
        {
          Id: 9,
          Name: 'Customer2',
        },
      ],
      Operator: [],
    };
    dispatch(saveJobData(data));
  };

  return (
    <ScrollView style={{backgroundColor: theme.bgWhite}}>
      {scan ? (
        <View style={{flex: 1, height: Dimensions.get('window').height}}>
         <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button text='Tap to Scan Again' onPress={() => setScanned(false)} />}
          <View style={GBStyles.container}>
            <Button text="Close" onPress={() => {setScan(false), setScanned(false)}} />
          </View>
        </View>
      ) : (
        <View style={GBStyles.container}>
          <Ripple
            onPress={() => setScan(true)}
            style={{alignSelf: 'center', marginBottom: 24, marginTop: 12}}>
            <Icon name="QR" size={60} color={theme.textBlue} />
            <Text style={{alignSelf: 'center', marginTop: 5}}>Scan QR</Text>
          </Ripple>
          <View style={{marginBottom: 20}}>
            <Input
              labelName="Data Matrix Code"
              placeholder="Enter Data Matrix Code"
              value={result}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Input
              labelName="Start Date"
              placeholder="DD/MM/YYYY"
              appendIconName="Calendar"
              appendIconColor={theme.textBlue}
              appendIconSize={16}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Select
              selectedValue={''}
              disabled={false}
              //handlePress={handleSelectBrand}
              placeholder="Select Exchange"
              label="Exchange"
              modalTitle="Select Exchange"
              items={masterData.exhangeTypes}
              modalObj={{id: 'Id', name: 'Name'}}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Input labelName="Wind Farm" placeholder="Enter Wind Farm" />
          </View>
          <View style={{marginBottom: 20}}>
            <Input labelName="Wind Turbine" placeholder="Enter Wind Turbine" />
          </View>
          <View style={{marginBottom: 20}}>
            <Select
              selectedValue={''}
              disabled={false}
              //handlePress={handleSelectBrand}
              placeholder="Select Shaft Position"
              label="Shaft Position"
              modalTitle="Select Shaft Position"
              items={masterData.shaftPositions}
              modalObj={{id: 'Id', name: 'Name'}}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Input
              labelName="Generator Model"
              placeholder="Enter Generator Model"
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Select
              selectedValue={''}
              disabled={false}
              //handlePress={handleSelectBrand}
              placeholder="Select Reason"
              label="Reason for Change"
              modalTitle="Select Reason"
              items={masterData.reasonOfChanges}
              modalObj={{id: 'Id', name: 'Name'}}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Select
              selectedValue={''}
              disabled={false}
              //handlePress={handleSelectBrand}
              placeholder="Select Bearing Brand"
              label="Previous Bearing Brand"
              modalTitle="Select Bearing Brand"
              items={masterData.brands}
              modalObj={{id: 'Id', name: 'Name'}}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Select
              selectedValue={''}
              disabled={false}
              //handlePress={handleSelectBrand}
              placeholder="Select Bearing Type"
              label="Previous Bearing Type"
              modalTitle="Select Bearing Type"
              items={masterData.bearingTypes}
              modalObj={{id: 'Id', name: 'Name'}}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Input labelName="Operator ID" placeholder="Enter Operator ID" />
          </View>
          <View style={{marginBottom: 20}}>
            <Input labelName="Comments" placeholder="Enter Comments" />
          </View>
          <Ripple
            style={Styles.addReportBtn}
            onPress={() => navigation.navigate('AddReport')}>
            <Row>
              <Icon name="AddReport" size={18} color={theme.textBlue} />
              <Text style={[GBStyles.pageTitle, Styles.addReportBtnText]}>
                Add report
              </Text>
            </Row>
          </Ripple>
          <Row>
            <Button
              text="Save"
              style={{flex: 1, marginRight: 8}}
              onPress={handleSubmitPress}
            />
            <Button
              text="Close"
              type="Secondary"
              style={{flex: 1, marginLeft: 8}}
              onPress={() => navigation.navigate('Jobs')}
            />
          </Row>
        </View>
      )}
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  addReportBtnText: {
    color: theme.textBlue,
    marginBottom: 0,
    marginLeft: 6,
  },
  addReportBtn: {
    marginBottom: 34,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default AddJob;
