import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return params['timezone'] ? params['timezone'] : '-5';
  }
});
