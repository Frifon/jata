'use strict';

import RoutePoint from './routepoint.js';
import Router from './route.js';

export default function init() {



    let myMap = new ymaps.Map('map', {
        center: [59.95, 30.2],
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });

    let numOfInterPoints = 1;


    let start_elem = document.getElementById('ts_route_start');
    let end_elem = document.getElementById('ts_route_finish');
    let initPoint = document.getElementsByName('ts_route_intermediate_point['+ (numOfInterPoints - 1) + ']').item(numOfInterPoints - 1);
    let isRouterInitialized = false;
    let initPointsArr = [];

    let startP = new RoutePoint({
        map: myMap,
        elem: start_elem,
        content: 'A'
    });

    let endP = new RoutePoint({
        map: myMap,
        elem: end_elem,
        content: 'B'
    });

    initPointsArr.push(new RoutePoint({
        map: myMap,
        elem: initPoint,
        content: 'I ' + initPointsArr.length
    }));

    myMap.geoObjects.events.add('add', (e) => {
        console.log('added');
        if(isRouterInitialized) return;
        let target = e.get('target');
        let last_added = target.get(target.getLength() - 1);
        if(!last_added.geometry) return;

        if(!startP.coords || !endP.coords) return;

        console.log('lets route');

        let router = new Router({
            map: myMap,
            pointA: startP.placemark,
            pointB: endP.placemark,
            interPoints: initPointsArr.map(function(item) {
                return item.placemark || 1;
            })
        });

        isRouterInitialized = true;

    });
}


