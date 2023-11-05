
import { Toast as toast } from 'toastify-react-native';

const defaultOptions = {
  
};

const displayToast = (
  toastType,
  message,
  options
) => {
  const toastOptions = { ...defaultOptions, ...options };
  switch (toastType) {
    case "success":
      toast.success(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "custom":
      toast(message);
      break;
    default:
      toast.success(message);
      break;
  }
};

//displayToast.defaultOptions = defaultOptions;

export default displayToast;