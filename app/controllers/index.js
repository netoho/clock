import Ember from 'ember';
import ENV from 'clock/config/environment';
const { get, set, run } = Ember;

export default Ember.Controller.extend({
  serverDate: Ember.inject.service(),
  seconds: 0,
  minutes: 0,
  hours: 0,
  day: 0,
  init: function () {
    if(ENV.APP.isSocketEnable){
      io('http://localhost:7000').on('message', date => {
        this.set('seconds', date.seconds);
        this.set('minutes', date.minutes);
        this.set('hours', date.hours);
        this.set('day', date.day);
      });
    } else {
      this.getDate();
    }
  },

  getDate(){
    Ember.run.later(this, () => {
      this.get('serverDate').getDate()
        .then(date => {
          this.set('seconds', date.seconds);
          this.set('minutes', date.minutes);
          this.set('hours', date.hours);
          this.set('day', date.day);
        });
      this.getDate();
    }, ENV.APP.updateFrequency);
  }
});
