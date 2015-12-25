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
    let interPoint = document.getElementsByName('ts_route_intermediate_point['+ (numOfInterPoints - 1) + ']').item(numOfInterPoints - 1);
    let interPoints = [], router;

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

    interPoints.push(new RoutePoint({
        map: myMap,
        elem: interPoint,
        content: 'I ' + interPoints.length
    }));

    myMap.geoObjects.events.add('add', (e) => {

        let target = e.get('target');
        let last_added = target.get(target.getLength() - 1);
        if(!last_added.geometry) return;

        if(router) {
            router.interPoints = interPoints.filter(function(item) {
                return item.placemark;
            }).map(function(item) {
                return item.placemark;
            });
            router.render();
            return;
        }

        if(!startP.coords || !endP.coords) return;

        router = new Router({
            map: myMap,
            pointA: startP.placemark,
            pointB: endP.placemark,
            interPoints: interPoints.filter(function(item) {
                return item.placemark;
            }).map(function(item) {
                return item.placemark;
            })
        });


    });
}


