import axios from 'axios';

import {
  APIInterface,
  ChangeEmail,
  IActivationProps,
  IPlayerInvitation,
  RequestFullReportInterface,
  TrackingCompanyInterface,
  TrackingEventInterface,
  TrackingUserInterface
} from '../../types';

import API_ENDPOINTS from './api_endpoints';

const API = {
  checkActivation: (email: string, userType: 'player' | 'coach' = 'coach') =>
    axios.get<APIInterface>(API_ENDPOINTS.INVITED_COACH(email, userType)),
  checkActivationCode: (activationCode: string) =>
    axios.get<APIInterface>(
      API_ENDPOINTS.CHECK_ACTIVATION_CODE(activationCode)
    ),
  checkPlayerActivationCode: (activationCode: string) =>
    axios.get<APIInterface>(
      API_ENDPOINTS.CHECK_PLAYER_ACTIVATION_CODE(activationCode)
    ),
  activateUser: (activationCode: string, data: IActivationProps) =>
    axios.post<APIInterface>(
      API_ENDPOINTS.CHECK_ACTIVATION_CODE(activationCode),
      data
    ),
  invitePlayer: (data: IPlayerInvitation) =>
    axios.post<APIInterface>(API_ENDPOINTS.INVITE_PLAYER, data),
  changeEmail: (data: ChangeEmail) =>
    axios.post<APIInterface>(API_ENDPOINTS.CHANGE_EMAIL, data),
  disableEmail: (email: string) =>
    axios.post<APIInterface>(API_ENDPOINTS.DISABLE_ACCOUNT, { email }),
  requestFullReport: (
    data?: RequestFullReportInterface | object,
    gameId?: string,
    sleep?: boolean
  ) =>
    axios.post(
      API_ENDPOINTS.REQUEST_FULL_REPORT +
        (gameId ? `?gameId=${gameId}` : '') +
        (sleep ? (gameId ? '&' : '?') + `sleep=false` : ''),
      data
    ),
  bucketTrackingEvent: (data: TrackingEventInterface) =>
    axios.post(API_ENDPOINTS.BUCKET_TRACKING_URL, data),
  bucketCustomerEvent: (data: TrackingCompanyInterface) =>
    axios.post(API_ENDPOINTS.BUCKET_COMPANY_TRACKING_URL, data),
  bucketUserEvent: (data: TrackingUserInterface) =>
    axios.post(API_ENDPOINTS.BUCKET_USER_TRACKING_URL, data)
};

export default API;

// exponential backoff api request retry method
export const backoffRetry = (
  fun: () => Promise<any>,
  successFun: () => void,
  failureFun: () => void,
  exponent = 1
) => {
  console.log('Retrying after' + Math.pow(2, exponent));
  setTimeout(async () => {
    const res = await fun();
    if (res.data) {
      console.log('success');
      return successFun();
    } else if (exponent <= 10) {
      return backoffRetry(fun, successFun, failureFun, exponent + 1);
    }
    console.log('failure');
    failureFun();
  }, Math.pow(2, exponent) + Math.random() * 1000);
};
