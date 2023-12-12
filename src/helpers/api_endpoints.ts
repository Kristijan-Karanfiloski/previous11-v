import * as Updates from 'expo-updates';

const IS_PROD =
  Updates.channel === 'production' || Updates.channel === 'staging';
// Prevent commit of this variable
const TEST_LOCAL = false;

const BASE_URLS = {
  API_SERVICE_EXTERNAL: IS_PROD
    ? 'https://next11-services-prod.apps.next11.com'
    : 'https://next11-services-dev.apps.next11.com',
  EDGE: __DEV__ ? 'http://192.168.0.105' : 'http://192.168.8.1',
  MOCK_SERVER: 'https://next11-mock-server.apps.next11.com',
  BUCKET: 'https://tracking.bucket.co/trrn0ltQHSaHfDsY1E3q7D8T'
};

const createSocketURL = (baseUrl: string) => {
  const protocol = TEST_LOCAL ? 'wss' : 'ws';
  const port = TEST_LOCAL ? '' : ':10002';
  const strippedUrl = baseUrl.replace(/^https?:\/\//, '');
  return `${protocol}://${strippedUrl}${port}`;
};

const API_ENDPOINTS = {
  SOCKET_URL: createSocketURL(
    TEST_LOCAL ? BASE_URLS.MOCK_SERVER : BASE_URLS.EDGE
  ),
  EDGE_DEVICE_CONNECTION: `${BASE_URLS.EDGE}:10005/`,
  REQUEST_FULL_REPORT: `${BASE_URLS.EDGE}:1234/generate_app_report`,
  EDGE_LIST_SESSIONS: `${BASE_URLS.EDGE}:1234/list_sessions`,
  EDGE_SESSION_METADATA: (sessionId: string) =>
    `${BASE_URLS.EDGE}:1234/metadata/${sessionId}`,
  EDGE_CANCEL_FULL_REPORT: (gameId: string) =>
    `${BASE_URLS.EDGE}/cancel/${gameId}`,
  CHECK_ACTIVATION_CODE: (activationCode: string) =>
    `${BASE_URLS.API_SERVICE_EXTERNAL}/api/activation/${activationCode}`,
  CHECK_PLAYER_ACTIVATION_CODE: (activationCode: string) =>
    `${BASE_URLS.API_SERVICE_EXTERNAL}/api/player/activation/${activationCode}`,
  ACTIVATE_USER: (activationCode: string) =>
    `${BASE_URLS.API_SERVICE_EXTERNAL}/api/activation/${activationCode}`,
  INVITE_PLAYER: `${BASE_URLS.API_SERVICE_EXTERNAL}/api/invite_player`,
  INVITED_COACH: (email: string, userType = 'coach') =>
    `${BASE_URLS.API_SERVICE_EXTERNAL}/api/activated?email=${encodeURIComponent(
      email
    )}&userType=${userType}`,
  RESET_PWD: `${BASE_URLS.API_SERVICE_EXTERNAL}/api/reset_pwd`,
  CHANGE_EMAIL: `${BASE_URLS.API_SERVICE_EXTERNAL}/api/change/email`,
  DISABLE_ACCOUNT: `${BASE_URLS.API_SERVICE_EXTERNAL}/api/disable/email`,
  BUCKET_TRACKING_URL: `${BASE_URLS.BUCKET}/event`,
  BUCKET_COMPANY_TRACKING_URL: `${BASE_URLS.BUCKET}/company`,
  BUCKET_USER_TRACKING_URL: `${BASE_URLS.BUCKET}/user`
};

export default API_ENDPOINTS;
