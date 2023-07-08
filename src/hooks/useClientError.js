import {notification} from 'antd';

export function useClientError() {
  const onClientError = (error) => {

    if (!error?.response) {
      return notification.error({
        message: error.response?.data?.message,
        description: 'Bir hata oluştu',
      });
    }

    function combineValuesWithCommas(obj) {
      let combinedValues = "";

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let values = obj[key];

          for (let i = 0; i < values.length; i++) {
            combinedValues += values[i];
          }
        }
      }

      return combinedValues;
    }

    if (error.response?.status === 404) {
      return history.replace('/404');
    } else {
      let dataErrors = combineValuesWithCommas(error.response?.data.errors)
      return notification.error({
        message: error.response.data.message,
        description: error?.response?.data?.errors ? <div
          dangerouslySetInnerHTML={{__html: dataErrors.replaceAll('.', '. <br /><br />')}}></div> : 'Bir hata oluştu',
      });
    }
  };

  return onClientError;
}