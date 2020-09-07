import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';
import _ from 'lodash';

const effectsFnMap = {
  'every': takeEvery,
  'latest': takeLatest,
  'leading': takeLeading,
};

function createSaga(
  {
    take = 'every',
    type,
    handler,
  },
) {
  if (!_.has(effectsFnMap, take)) {
    throw Error(`Invalid 'take' parameter: ${take}`);
  }
  return effectsFnMap[take](type, handler);
}

export default createSaga;