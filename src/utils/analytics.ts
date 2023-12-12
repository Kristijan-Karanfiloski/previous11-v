import analytics, {
  FirebaseAnalyticsTypes
} from '@react-native-firebase/analytics';
import moment from 'moment';

export enum APP_TYPE {
  COACH = 'coach',
  PLAYER = 'player'
}

export class FireBaseAnalytics {
  _team: Record<string, any> | undefined;
  _club: string | undefined;
  _userId: string | undefined;
  _userProperties: Record<string, any> | undefined;
  _analyticsInstance: FirebaseAnalyticsTypes.Module;
  _appType: string;

  constructor(appType: APP_TYPE) {
    this._appType = appType;

    analytics().setAnalyticsCollectionEnabled(true);

    this._analyticsInstance = analytics();
  }

  _saveUserProperties() {
    if (!this._team || !this._userProperties) return;

    this._analyticsInstance.setUserProperties(
      Object.assign({}, this._userProperties, {
        teamName: this._team?.name || '',
        teamGender: this._team?.gender || '',
        teamAge: this._team?.teamAge || '',
        role: this._appType
      })
    );
  }

  set team(team: Record<string, any>) {
    this.log('Setter team', team);
    this._team = team;

    this._saveUserProperties();
  }

  get team() {
    return this._team || {};
  }

  set club(club: string) {
    this.log('Setter Club', club);
    this._club = club;
  }

  get club() {
    return this._club || '';
  }

  set userId(userId: string) {
    this.log('Setter UserId', userId);
    this._userId = userId;

    this._analyticsInstance.setUserId(userId);
  }

  get userId() {
    return this._userId || '';
  }

  set userProperties(userProperties: Record<string, any>) {
    this.log('Setter userProperties', userProperties);

    this._userProperties = {
      userId: userProperties.uid,
      providerId: userProperties.providerId || '',
      displayName: userProperties.displayName || userProperties.name,
      email: userProperties.email,
      photoUrl: userProperties.photoUrl + ''
    };

    this._saveUserProperties();
  }

  get userProperties() {
    return this._userProperties || {};
  }

  private log(type: string, message: string | Record<string, any>) {
    console.log('[Firebase Analytics]', type, message);
  }

  public async logEvent(eventName: string, eventData: any): Promise<any> {
    // compose common information
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');

    eventData = Object.assign({}, eventData, {
      createTime,
      club: this._club,
      role: this._appType,
      userId: this._userId,
      teamName: this._team?.name,
      teamGender: this._team?.gender,
      teamAge: this._team?.teamAge
    });

    this.log('event ' + eventName, eventData);

    await this._analyticsInstance.logEvent(
      eventName.replace(/[\s|-]+/g, '_'),
      eventData
    );
  }

  public async logScreen(screenName: string, screenClass: string) {
    this.log('screen', screenName);
    // build a Funnel
    // log screen name
    await this._analyticsInstance.logScreenView({
      screen_name: screenName,
      screen_class: screenClass || screenName
    });

    await this.logEvent(
      `Page_${screenName}_${this._appType}app`.replace(/\s+/g, '_'),
      null
    );
  }
}

// Log predefined events
// https://rnfirebase.io/reference/analytics
/**
   *
   *  getAppInstanceId
      logAddPaymentInfo
      logAddShippingInfo
      logAddToCart
      logAddToWishlist
      logAppOpen
      logBeginCheckout
      logCampaignDetails
      logEarnVirtualCurrency
      logEvent
      logGenerateLead
      logJoinGroup
      logLevelEnd
      logLevelStart
      logLevelUp
      logLogin
      logPostScore
      logPurchase
      logRefund
      logRemoveFromCart
      logScreenView
      logSearch
      logSelectContent
      logSelectItem
      logSelectPromotion
      logSetCheckoutOption
      logShare
      logSignUp
      logSpendVirtualCurrency
      logTutorialBegin
      logTutorialComplete
      logUnlockAchievement
      logViewCart
      logViewItem
      logViewItemList
      logViewPromotion
      logViewSearchResults
      resetAnalyticsData
      setAnalyticsCollectionEnabled
      setDefaultEventParameters
      setSessionTimeoutDuration
      setUserId
      setUserProperties
      setUserProperty
   */

// Reserved events
/**
   *  app_clear_data app_uninstall app_update
      error first_open first_visit
      first_open_time first_visit_time in_app_purchase
      notification_dismiss notification_foreground notification_open
      notification_receive os_update session_start
      screen_view user_engagement ad_impression
      ad_click ad_query ad_exposure
      adunit_exposure ad_activeiew
   */
