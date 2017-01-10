import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('timezones', function() {
    this.route('index');
    this.route('edit', { path: '/:timezoneId/edit'});
    this.route('new', { path: '/new'});
  });
  this.route('index');
});

export default Router;
