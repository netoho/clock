import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', { path: '/:timezone' });
  this.route('timezones', function() {
    this.route('index');
    this.route('edit');
    this.route('new');
  });
});

export default Router;
