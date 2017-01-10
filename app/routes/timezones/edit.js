import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.get('store').findRecord('timezone', params['timezoneId']);
  },
  deactivate(){
    this.modelFor('timezones.edit').rollbackAttributes();
  }
});
