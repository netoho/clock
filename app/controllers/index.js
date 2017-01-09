import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Controller.extend({
  time: new Date(),
  socketIOService: Ember.inject.service('socket-io'),
  init: function () {
    let io = get(this, 'socketIOService').socketFor('http://localhost:7000/');
    // io.on('message', (time) => /*set(this, 'time', time)*/ console.log(time));
    io.on('message', this.onMessage, this);
  },
  onMessage(data) {
    console.log(data);
  },
  actions: {
    changeTime(){
      this.set('time', new Date());
    }
  }
});
