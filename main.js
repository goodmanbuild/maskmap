//new Date().getMilliseconds();
var map;
var markers;
var lat = 25;
var lng = 121.5;
var zoom = 12;
var homeMarker;
navigator.geolocation.getCurrentPosition(function (position) {
    map = L.map('map', {
        zoomControl: false,
        center: [position.coords.latitude, position.coords.longitude],
        zoom: 16
    });

    lat = position.coords.latitude;
    lng = position.coords.longitude
    zoom = 16;


    settingMap(function () {
        var zoomHome = new L.Control.zoomHome();
        zoomHome.addTo(map);
        homeMarker = L.marker([position.coords.latitude, position.coords.longitude], { icon: violetIcon });
        markers.addLayer(homeMarker);
        homeMarker.bindPopup("您所在的位置").openPopup();

    });
    loadData();

}, function () {
    map = L.map('map', {
        center: [25, 121.5],
        zoom: 12
    });



    settingMap(function () {
        var zoomHome = new L.Control.zoomHome();
        zoomHome.addTo(map);
    });
    loadData();
});


var settingMap = function (callback) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    markers = new L.MarkerClusterGroup().addTo(map);
    if (callback) {
        callback();
    }
}


var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var violetIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



var loadData = function () {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
    xhr.send();
    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText).features
        var mask_adult = 0;
        var mask_child = 0;
        for (var i = 0; data.length > i; i++) {
            mask_adult = data[i].properties.mask_adult;
            mask_child = data[i].properties.mask_child;
            if (mask_adult > 50) {
                markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: greenIcon }).bindPopup(bindContent(data[i].properties, mask_adult, mask_child)));
                continue;
            } else if (mask_adult > 20 && mask_adult <= 50) {
                markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: yellowIcon }).bindPopup(bindContent(data[i].properties, mask_adult, mask_child)));
                continue;
            } else if (mask_adult > 0 && mask_adult <= 20) {
                markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: redIcon }).bindPopup(bindContent(data[i].properties, mask_adult, mask_child)));
                continue;
            } else {
                markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: greyIcon }).bindPopup(bindContent(data[i].properties, mask_adult, mask_child)));
                continue;
            }



        }
        map.addLayer(markers);
    }
}




var bindContent = function (properties, mask_adult, mask_child) {
    var name = properties.name;
    var phone = properties.phone;
    var updated = properties.updated;
    var address = properties.address;
    var content = "<h2>" + name + "</h2>";
    content += "<div>成人口罩：" + mask_adult + "</div>";
    content += "<div>小孩口罩：" + mask_child + "</div>";
    content += "<div>資料更新：" + updated + "</div>";
    content += "<hr />";
    content += '<div>電話：<a href=tel:+886-' + Number( phone.substring(0,2)).toString() + '-' +  Number(phone.split('-')[1]).toString() + '>' + phone + "</a></div>";
    content += "<div>地址：<a target='_blank' href='https://www.google.com.tw/maps/place/" + address + "' >" + address + "</a></div>";
    return content;
}

// custom zoom bar control that includes a Zoom Home function
L.Control.zoomHome = L.Control.extend({
    options: {
        position: 'topright',
        zoomInText: '+',
        zoomInTitle: 'Zoom in',
        zoomOutText: '-',
        zoomOutTitle: 'Zoom out',
        zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
        zoomHomeTitle: 'Zoom home'
    },

    onAdd: function (map) {
        var controlName = 'gin-control-zoom',
            container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
            options = this.options;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
        controlName + '-in', container, this._zoomIn);
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
        controlName + '-home', container, this._zoomHome);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
        controlName + '-out', container, this._zoomOut);

        this._updateDisabled();
        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

        return container;
    },

    onRemove: function (map) {
        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
    },

    _zoomIn: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },

    _zoomOut: function (e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },

    _zoomHome: function (e) {
        map.setView([lat, lng], zoom);
        homeMarker.openPopup();
    },

    _createButton: function (html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, this)
            .on(link, 'click', this._refocusOnMap, this);

        return link;
    },

    _updateDisabled: function () {
        var map = this._map,
            className = 'leaflet-disabled';

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
        }
    }
});
