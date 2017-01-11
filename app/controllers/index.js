import Ember from 'ember';
import ENV from 'clock/config/environment';
const { get, set, run } = Ember;

export default Ember.Controller.extend({
  serverDate: Ember.inject.service(),
  seconds: 0,
  minutes: 0,
  hours: 0,
  day: 0,
  selectedTimezone: null,
  init: function () {
    if(ENV.APP.isSocketEnable){
      let socket = io('http://localhost:7000');
      socket.on('message', date => {
        console.log(date);
        this.set('seconds', date.seconds);
        this.set('minutes', date.minutes);
        this.set('hours', date.hours);
        this.set('day', date.day);
      });
      this.set('socket', socket);
    } else {
      this.getDate();
    }
  },

  getDate(){
    Ember.run.later(this, () => {
      let offset = this.get('selectedTimezone.offset');
      this.get('serverDate').getDate(offset)
        .then(date => {
          this.set('seconds', date.seconds);
          this.set('minutes', date.minutes);
          this.set('hours', date.hours);
          this.set('day', date.day);
        });
      this.getDate();
    }, ENV.APP.updateFrequency);
  },
  actions: {
    selectTimezone(selectedTimezone) {
      this.set('selectedTimezone', selectedTimezone);
      if(ENV.APP.isSocketEnable) {
        this.get('socket').emit('timezone', selectedTimezone.get('offset'));
      }
    }
  }
});
