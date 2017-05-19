import Promise from 'bluebird';
import Contacts from 'react-native-contacts';

Promise.promisifyAll(Contacts);
