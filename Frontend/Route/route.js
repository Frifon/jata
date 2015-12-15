'use strict';

export default class Router {

    constructor(options) {
        this.map = options.map;
        this.pointA = options.pointA;
        this.pointB = options.pointB;
        this._collection = this.map.geoObjects;
        this._startEditing = false;
        this._isButtonListening = false;
        this.render();
    }

    render() {
        let ctx = this;
        let coords = [];

        if(!this.points) this.points.push(this.pointA, this.pointB);

        this.points.each(function (elem, i) {
            coords[i] = elem.geometry.getCoordinates();
        });

        ymaps.route(coords)
            .then(
            function(route) {
                ctx.route = route;
                ctx._collection.removeAll();
                ctx.add();
            },
            function(error) {
                console.log('error: ' + error);
            }
        )
    }

    add() {
        // TODO: editbutton задавать через конструктор

        let editButton = document.getElementById('editor');
        let ctx = this;

        this._collection.add(this.route);

        if(!this._isButtonListening) {
            editButton.addEventListener('click', () => {
                if (this._startEditing = !this._startEditing) {
                    this.route.editor.start({ addWayPoints: true });
                    editButton.value = 'Отключить редактор маршрута';
                } else {
                    this.route.editor.stop();
                    editButton.value = 'Включить редактор маршрута';
                }
            });
            this._isButtonListening = true;
        }

        this.points = this.route.getWayPoints();
        this.points.options.set('preset', 'islands#redStretchyIcon');
        this.points.options.set('draggable', 'true');
        this.points.each( function(elem) {
            elem.events.add('dragend', (e) => ctx.onChange(e));
        });

    }

    onChange(e) {
        //let thisPoint = e.get('target');
        //let coords = thisPoint.geometry.getCoordinates();
        //thisPoint.geometry.setCoordinates(coords);
        this.render();
    }



}