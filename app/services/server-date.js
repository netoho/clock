import Ember from 'ember';
import ENV from 'clock/config/environment';

export default Ember.Service.extend({
  getDate(){
    let url = `${ENV.APP.API.protocol}://${ENV.APP.API.domain}:${ENV.APP.API.port}/${ENV.APP.API.endpoint}`;
    return Ember.$.getJSON(url);
  }
});
