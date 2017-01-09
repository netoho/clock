import Ember from 'ember';
import {select, selectAll} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import {extent, ascending} from 'd3-array';
import {transition} from 'd3-transition';
import {easeCubicInOut} from 'd3-ease';
import {range} from 'd3-array';
import moment from 'moment';

const {run, get, set} = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  timezone: '',
  radius: 200,
  seconds: 0,
  minutes: 0,
  hours: 0,
  day: '',

  didInsertElement() {
    let radius = get(this, 'radius');
    set(this, 'handsData', [
      {
        length: radius,
        type: 'seconds',
        scale: scaleLinear().domain([0, 60]).range([-90, 270])
      },
      {
        type: 'minutes',
        length: radius * 0.7,
        scale: scaleLinear().domain([0, 60]).range([-90, 270])
      },
      {
        type: 'hours',
        length: radius * 0.5,
        scale: scaleLinear().domain([0, 12]).range([-90, 270])
      }
    ]);
    set(this, 'center', {x: radius, y: radius});
    run.scheduleOnce('render', this, this.drawClock);
  },

  dateChanged: Ember.observer('seconds', function () {
    let seconds = get(this, 'seconds');
    let minutes = get(this, 'minutes');
    let hours = get(this, 'hours');
    let day = get(this, 'day');
    this.updateClock(seconds, minutes, hours, day);
  }),

  updateClock(seconds, minutes, hours, day){
    let handsData = get(this, 'handsData');
    let center = get(this, 'center');
    let hands = get(this, 'hands');
    hands.selectAll('line')
      // .data(handsData)
      .transition()
      .attr('transform', d => {
        if(d.type === 'seconds'){
          return `rotate(${d.scale(seconds)}, ${center.x}, ${center.y})`;
        } else if(d.type === 'minutes') {
          return `rotate(${d.scale(minutes)}, ${center.x}, ${center.y})`;
        } else if(d.type === 'hours') {
          return `rotate(${d.scale(hours)}, ${center.x}, ${center.y})`;
        }
      });
  },

  drawClock(){
    let radius = get(this, 'radius');
    let height = radius * 2, width = radius * 2;
    let center = {
      x: radius,
      y: radius
    };

    let handsData = get(this, 'handsData');

    let markLength = {
      minute: radius / 15,
      fives: radius / 10,
    };

    let element = select(this.element);
    element.attr('width', width).attr('height', height);

    let marks = element.append('g').attr('id', 'marks');
    marks
      .selectAll('minute mark')
      .data(range(0, 60))
      .enter()
      .append('line')
      .attr('class', 'minute mark')
      .attr('x1', center.x + radius - markLength.minute)
      .attr('y1', center.y)
      .attr('x2', center.x + radius)
      .attr('y2', center.y)
      .attr('transform', (d) => `rotate(${d * 6}, ${center.x}, ${center.y})`);
    marks
      .selectAll('five mark')
      .data(range(0, 60, 5))
      .enter()
      .append('line')
      .attr('class', 'five mark')
      .attr('x1', center.x + radius - markLength.fives)
      .attr('y1', center.y)
      .attr('x2', center.x + radius)
      .attr('y2', center.y)
      .attr('transform', (d) => `rotate(${d * 6}, ${center.x}, ${center.y})`);

    let hands = element.append('g').attr('id', 'hands');
    hands.append('circle')
      .attr('class', 'little-circle')
      .attr('cx', radius)
      .attr('cy', radius)
      .attr('r', radius / 10);

    hands.selectAll('line')
      .data(handsData)
      .enter()
      .append('line')
      .attr('class', d => `hand ${d.type}`)
      .attr('x1', center.x)
      .attr('y1', center.y)
      .attr('x2', d => center.x + d.length)
      .attr('y2', d => center.y);

    set(this, 'hands', hands);
  }


});
