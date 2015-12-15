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


    let start_elem = document.getElementById('ts_route_start');
    let end_elem = document.getElementById('ts_route_finish');
    let isRouterInitialized = false;

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

    myMap.geoObjects.events.add('add', (e) => {
        if(isRouterInitialized) return;
        let target = e.get('target');
        let last_added = target.get(target.getLength() - 1);
        if(!last_added.geometry) return;

        if(!startP.coords || !endP.coords) return;

        let router = new Router({
            map: myMap,
            pointA: startP.placemark,
            pointB: endP.placemark
        });

        isRouterInitialized = true;

    });
}


