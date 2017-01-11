import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save(newTimeZone) {
      newTimeZone.save().then(() => {
        alert('Timezone successfully saved');
        this.transitionToRoute('timezones');
      });
    }
  }
});
