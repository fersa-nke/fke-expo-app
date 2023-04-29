import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import theme from '../../assets/theme';
import Icon from '../../shared/IconComp';
import GBStyles from '../../assets/globalstyles';
import Row from '../../shared/Row';
import Ripple from 'react-native-material-ripple';
import defaultIcon from '../../assets/images/default.png';
import BarCode from '../../assets/images/barcode.png';
import { useNavigation } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import IconComp from '../../shared/IconComp';


function JobCard({list, onHandlePress, JobEdit, JobDelete}) {
  const jobs = list;
  const navigation = useNavigation();

  const renderLeftActions = (Id) => {
    return (
      <Row style={{height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f2f2f2"}}>
        <Ripple style={{width: 70, height: 120,justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bgBlue}} onPress={()=>JobEdit(Id)} >
        <IconComp name="Edit" size={24} color={theme.textWhite} />
      </Ripple>
      <Ripple style={{width: 70, height: 120,justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}  onPress={()=>JobDelete(Id)}>
        <IconComp name="Delete" size={24} color={theme.textWhite} />
      </Ripple>
      </Row>
    )
  }

  return (
      <>
      
        {jobs?.map(job => (
        <TouchableOpacity onPress={() => onHandlePress(job.Id)} key={job.Id}>
          <Swipeable renderRightActions={()=>renderLeftActions(job.Id)}>
          <Row style={[Styles.card]}>
            {job.offline && <Text style={Styles.offline}>Offline</Text> }
            <Image
              source={job?.DataMatirx ? BarCode : defaultIcon}
              width={40}
              height={40}
              style={{marginTop: 5 , marginLeft: 3, marginBottom: 5, marginRight: 14 }}
              resizeMethod="auto"
              resizeMode="cover"
            />
            <View style={{flex: 1}}>
              <Text style={Styles.cardTitle} numberOfLines={1}>
                {job['Title']}
              </Text>
              <Text style={Styles.cardDescription} numberOfLines={2}>
                {job['Date']} | {job['WindTurbine']}
              </Text>
              <Row style={Styles.cardFooter} justifyContent="space-between">
                <Row>
                  <Icon name="Operator" size={14} color={theme.textBlue} />
                  <Text style={Styles.operatorName}>{job['Operator Name']}</Text>
                </Row>
                <Ripple
                  style={Styles.circleBtn}
                  onPress={() => navigation?.navigate('JobDetails', {id:job.Id, viewType: 'reports'})}>
                  <Icon name="Report" size={14} color={theme.textBlue} />
                </Ripple>
              </Row>
            </View>
          </Row>
          </Swipeable>
        </TouchableOpacity>
      ))}      
    </>
  );
}

const Styles = StyleSheet.create({
  card: {
    backgroundColor: theme.bgWhite,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    position: 'relative',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textBlack,
    marginBottom: 2,
    marginTop: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: theme.textGray,
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderColor: theme.border,
    borderStyle: 'solid',
    paddingTop: 4,
    marginTop: 8,
  },
  operatorName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textBlue,
    marginLeft: 4,
  },
  circleBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offline: {
    fontSize: 10,
    color: theme.textBlack,
    fontStyle: 'italic',
    position: 'absolute',
    top: 0,
    right: 16,
    backgroundColor: '#FCDDEC',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
});

export default JobCard;
