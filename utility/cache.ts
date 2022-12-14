import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const prefix = 'cache';
const expiryInMinutes = 43200;

const store = async (key, value) => {
  const item = {
    value,
    timeStamp: Date.now(),
  };

  try {
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (err) {

  }
};

const isExpired = item => {
  const now = moment(Date.now());
  const storedTime = moment(item.timeStamp);
  return now.diff(storedTime, 'minutes') > expiryInMinutes;
};

const get = async key => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);

    if (!item) return null;

    if (isExpired(item)) {
      await AsyncStorage.removeItem(prefix + key);
      return null;
    }

    return item.value;
  } catch (err) {

  }
};

export const cacheIt = async (response, URL) => {

  if (response.ok) {

    let data = await response.text()
    await store(URL, data)

    return data;
  }

  const data = await get(URL);

  return data ? data : response;
}

export default { store, get };