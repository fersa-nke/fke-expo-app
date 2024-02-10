import {StyleSheet} from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  container: {
    padding: 15,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: theme.textBlack,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  labelName: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 4,
  },
  mainHeading: {
    fontSize: 16,
    color: theme.textBlack,
    fontWeight: '700',
    marginBottom: 12,
  },
  rippleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addReportBtn: {
    marginVertical: 24,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    overflow: 'hidden',
  },
  addReportBtnText: {
    color: theme.textBlue,
    marginBottom: 0,
    marginLeft: 6,
  },
  upload: {
    borderWidth: 1,
    borderColor: theme.bgBlue,
    borderStyle: 'dashed',
    padding: 24,
    borderRadius: 8,
    backgroundColor: theme.bgWhite,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 34
  },
  uploadTitle: {
    fontSize: 18,
    color: theme.textBlue,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 4,
  },
  uploadHelpText: {
    fontSize: 12,
    color: theme.textGray,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 16,
    color: theme.textBlack,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginLeft: 16
  },
  modalContent: {
    backgroundColor: theme.bgWhite,
    flex: 1,
  },
  modalHeader: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  modalBody: {
    flex: 1,
  },
  linkText: {
    fontSize: 14,
    color: theme.textBlue,
    fontWeight: '700'
  }
});
