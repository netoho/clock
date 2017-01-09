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
  time: new Date(),

  didInsertElement() {
    let radius = get(this, 'radius');
    set(this, 'handsData', [
      {
        length: radius,
        type: 'second',
        scale: scaleLinear().domain([0, 60]).range([0, 360])
      },
      {
        type: 'minute',
        length: radius * 0.7,
        scale: scaleLinear().domain([0, 60]).range([0, 360])
      },
      {
        type: 'hour',
        length: radius * 0.5,
        scale: scaleLinear().domain([0, 12]).range([0, 360])
      }
    ]);
    set(this, 'center', {x: radius, y: radius});
    run.scheduleOnce('render', this, this.drawClock);
  },

  timeChanged: Ember.observer('time', function () {
    let time = get(this, 'time');
    this.updateClock(time);
  }),

  updateClock(time){
    let handsData = get(this, 'handsData');
    let center = get(this, 'center');
    let hands = get(this, 'hands');
    let momentDate = moment(time);
    console.log(momentDate.seconds());
    // console.log(momentDate.minutes());
    // console.log(momentDate.hours());

    hands.selectAll('line')
      // .data(handsData)
      .transition()
      .attr('transform', d => {
        if(d.type === 'second'){
          let scale = d.scale;
          return `rotate(${scale(momentDate.seconds())}, ${center.x}, ${center.y})`;
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
