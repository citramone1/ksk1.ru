/**
 * Основные функции общего шаблона
 */

// Поисковая строка
(function () {
    const meta_generator = jQuery("meta[name='generator']").attr("content");
    if (meta_generator && meta_generator.substring(0, 9) == "WordPress") {
        // Пусто. У сайтов на WordPress свой поиск
    } else {
        if (document.location.href.match(/^[htp:\/]+ob/)) { // Поиск по объявлениям
            var cx = '003704283744183876190:qchgmzsmjkc';
        } else { // Поиск по новостям
            cx = '003704283744183876190:woiuqgnl_eg';
        }
        var client_width = document.documentElement.clientWidth;
        if (client_width > 768)
            jQuery('.navbar-right .searchbox-container .search-form-header').append('<gcse:searchbox></gcse:searchbox>');
        else jQuery('.menu-sidenav-aux .search-container .search-form-header').append('<gcse:searchbox></gcse:searchbox>');
        jQuery('.searchbox').append('<div id="searchbox-lazy"><div class="form-group clearfix"><i class="fa fa-search"></i><input type="text" placeholder="Поиск..." class="form-control" size="40"></div></div>');
        jQuery('#searchbox-lazy').hover(function () {
            const searchbox_lazy = jQuery(this);
            LoadJS('//www.google.com/cse/cse.js?cx=' + cx, function () {
                window.setTimeout(function () {
                    searchbox_lazy.remove();
                }, 500);
            });
        });
        // по щелчку кнопки поиска
        if (client_width > 768)
            jQuery(".btn-search").click(function () {
                jQuery(".searchbox-container").addClass("search-show");

                LoadJS('//www.google.com/cse/cse.js?cx=' + cx);

            });
        else {
            LoadJS('//www.google.com/cse/cse.js?cx=' + cx);
        }
        jQuery(".close").click(function () {
            jQuery(".searchbox-container").removeClass("search-show");
        });
        //TODO: Уничтожить поиск Google, он весит больше мегабайта
    }
})();


//  Openstat
// FIXME: загружать, только если есть подходящий элемент.
var openstat = {
    counter: 2173092, image: 5088, color: "828282", next: openstat,
    part: jQuery('body').prop('class').split(' ')[0]
};
LoadJS('//openstat.net/cnt.js');


// Yandex.Metrika counter
/*
 (w[c] = w[c] || []).push(function () {
 try {
 w.yaCounter5036764 = new Ya.Metrika({id: 5036764,
 webvisor: true,
 clickmap: true,
 trackLinks: true,
 accurateTrackBounce: true});
 } catch (e) {}
 });
 LoadJS('//mc.yandex.ru/metrika/watch.js');
 */

// noscript: <img src="//mc.yandex.ru/watch/5036764" style="position:absolute; left:-9999px;" alt=""/>


// Обнаруживаем плохих мальчиков / девочек
function markAs( isNaughty ) {
    clearTimeout(naughtyTimer);
    jQuery('body').toggleClass('is-naughty', isNaughty)
                  .toggleClass('is-nice',   !isNaughty);
    console.log("User is " + (isNaughty ? 'naughty' : 'nice'));
}

var naughtyTimer = setTimeout( function(){ markAs(true) }, 10000);

var fuckAdBlock = undefined;
LoadJS('//ksk1.ru/vendor/fsck-ablock.js', function() {
    if(typeof fuckAdBlock === 'undefined') {
        markAs(true);
    } else {
        fuckAdBlock.onDetected(   function(){ markAs(true); } )
                   .onNotDetected(function(){ markAs(false); } );
        //FuckAdBlock = fuckAdBlock = undefined;
        fuckAdBlock.onDetected(   function(){ console.error('oh!'); } );
        fuckAdBlock.onNotDetected(function(){ console.log('wow!'); } );

    }
});


// Отключаем правую панель на сайте news-old
var disable_panels = document.body.className.match('news-old') ? 'right' : 'none';

// Включаем Snap.js
var snapper = new Snap({
    element: document.getElementById('content'),
    disable: disable_panels
});
jQuery('#menu-button').on('click', function () {
    if (snapper.state().state == "left") {
        snapper.close();
    } else {
        snapper.open('left');
    }
});
// Автоматическое скрытие snap.js на больших экранах
jQuery(window).resize(function () {
    if (jQuery(this).width() < 768) {
        snapper.enable();
    } else {
        snapper.close();
        snapper.disable();
    }
}).trigger('resize');


// Разворачивание меню по щелчку
jQuery('.menu-item-has-children > a').click(function (event) {
    event.preventDefault();
    var thisParent = jQuery(this).parent();
    if (thisParent.hasClass('current-page-parent')) {
        thisParent.removeClass('current-page-parent');
    } else {
        thisParent.addClass('current-page-parent');
        jQuery('.menu-item-has-children > a').parent().not(thisParent).removeClass('current-page-parent');
    }
});


/*  поповер по hover
 jQuery('.wide-header .popover-weather').popover({
 content: "<h1 style='padding: 50px 50px;'>Загрузка...</h1>",
 title: "Прогноз погоды на 3 дня",
 //        template: '<div class="popover popover-weather-temp"><div class="arrow"></div><div class="popover-header">\
 //<button type="button" class="close" aria-hidden="true">&times;</button>\
 //<h3 class="popover-title"></h3></div><div class="popover-content"></div></div>',
 html: true,
 placement: "bottom",
 trigger:"hover"
 }).one('show.bs.popover', function(event){
 jQuery.ajax({
 url: "http://ob.ksk66.ru/weather/forecast.html",
 timeout: 2000,
 success: function (data) {
 // Надо обновить уже висящую подсказку и изменить options.content для новых подсказок
 var popover = jQuery('.wide-header .popover-weather').data('bs.popover');
 popover.tip().find(".popover-content").html(data);
 popover.options.content = data;
 },
 error: function(msg){
 result = msg.responseText ? msg.responseText : msg.statusText;
 jQuery('.popover-weather + .popover > .popover-content').html("<p>Ошибка: "+result+"<br>Посмотрите на Яндекс.Погода<br> <a class='ya-weather-forecast' href='https://pogoda.yandex.ru/krasnoufimsk/details' target='_blank'><img alt='Погода' src='//info.weather.yandex.net/krasnoufimsk/2_white.ru.png?domain=ru'></a></p>");
 }

 });
 });*/

jQuery('.dropdown-weather').one('mouseenter', function () {
    jQuery.ajax({
        url: "http://ksk1.ru/weather/forecast.html",
        crossDomain: true,
        timeout: 2000,
        success: function (data) {
            jQuery('.dropdown-weather').find('.dropdown-menu').html(data);
        },
        error: function (msg) {
            result = msg.status + ' ' + msg.statusText;
            jQuery('.dropdown-weather').find('.dropdown-menu').html("<div class='alert alert-danger'>Ошибка: <b>" + result + "</b><br>Вот погода от Яндекса:</div> <a class='ya-weather-forecast' href='https://pogoda.yandex.ru/krasnoufimsk/details' target='_blank'><img alt='Погода' src='//info.weather.yandex.net/krasnoufimsk/2_white.ru.png?domain=ru'></a>");
        }

    });
});

// Загрузить срочные объявления при наведении на панель Объявления
/*
jQuery(".menu-main-ads").one("mouseenter", function () {
    jQuery(".ob-promo-body").load("http://ob.ksk66.ru/core/vip_ajax_block.php", function () {
        jQuery('.vip-poster').each(function () {
            jQuery(this).popover({
                content: jQuery('#content-' + jQuery(this)[0].id).html(),
                html: true,
                placement: "bottom",
                trigger: 'hover',
                container: '.vip-margin',
                viewport: 'body'
            });
        });
    });
})
*/


// Загрузить главную новость при наведении на панель Новости
jQuery(".menu-main-news").one("mouseenter", function () {
    // jQuery(".news-main").load("http://ksk66.ru/main-news/");
    jQuery(".important-info").load("http://ksk66.ru/main-info/");
});


// Загружаем события и сегодняшние сеансы
jQuery(".menu-main-agenda").one("mouseenter", function () {
    jQuery(".menu-main-agenda-events").load("http://ksk66.ru/menu-main-agenda-events/");
    jQuery(".menu-main-agenda-movies").load("http://ksk66.ru/menu-main-agenda-movies/");
});

// <editor-fold desc="Видео и аудиоплееры">

var radio_player = "";
var video_player = "";

// При наведении мыши на панель Радио
jQuery(".menu-main-radio").mouseenter(function () {

    // Получить текущий трек
    jQuery.get("http://ksk1.ru/nowplaying.xml", function (data) {
        var track = jQuery(data).find("TRACK").first();
        if (track.attr("ARTIST")) {
            var track_text = "<span class='track-info-air'>&#1042;&#32;&#1101;&#1092;&#1080;&#1088;&#1077;: </span>" + track.attr("ARTIST") + " — " + track.attr("TITLE");
        }
        else if (track.attr("TITLE")) {
            track_text = "<span class='track-info-air'>&#1042;&#32;&#1101;&#1092;&#1080;&#1088;&#1077;: </span>" + track.attr("TITLE");
        } else  track_text = "";
        jQuery(".track-info").html(track_text.replace(/\[.*\]/, ""));
        jQuery(".listeners").text(track.attr("LISTENERS").replace(/\[.*\]/, ""));
        jQuery("#listen-text").removeClass("hidden");

    });
});
jQuery(window).load(function () {
    if (getCookie("player_state")) {
        jQuery(".menu-main-radio").trigger('mouseenter');
    }
});


jQuery(".menu-main-radio").one('mouseenter', function () {

    // Радио плеер
    LoadJS("http://jplayer.org/latest/dist/jplayer/jquery.jplayer.min.js", function () {
        radio_player = jQuery("#jquery_jplayer_1");
        radio_player.jPlayer({
            ready: function () {
                radio_player.parent().removeClass("jp-loading").addClass("jp-ready");
                jQuery(this).jPlayer("setMedia", {
                    // aac: "http://radio.ksk66.ru:8000/aac",
                    m4a: "http://radio.ksk66.ru:8000/mp3"
                });
                if (getCookie("player_state")) {
                    deleteCookie("player_state");
                    radio_player.jPlayer("play");
                }
            },
            ended: function () {
                jQuery(this).jPlayer("setMedia", {
                 //   aac: "http://radio.ksk66.ru:8000/aac",
                    m4a: "http://radio.ksk66.ru:8000/mp3"
                }).jPlayer("play");
                jQuery(".jp-progress").addClass("hidden");
                jQuery(".jp-current-time").addClass("hidden");
                jQuery(".jp-duration").addClass("hidden");
                jQuery(".track-info").removeClass("hidden");
                jQuery("#on_air").click();
            },
            swfPath: "js",
             supplied: "m4a"
            //supplied: "mp3, m4a"
        });


        jQuery(".play_btn ").click(function () {
            var id = jQuery(this).prop("id");
            if (id == "last_news") {
                radio_player.jPlayer("setMedia", {
                    m4a: "http://ksk1.ru/radio-news/news.mp3"
                }).jPlayer("play");
                jQuery(".jp-progress").removeClass("hidden");
                jQuery(".jp-current-time").removeClass("hidden");
                jQuery(".jp-duration").removeClass("hidden");
                jQuery(".track-info").addClass("hidden");
            }
            if (id == "on_air") {
                radio_player.jPlayer("setMedia", {
                   // aac: 'http://radio.ksk66.ru:8000/aac',
                    m4a: 'http://radio.ksk66.ru:8000/mp3'
                }).jPlayer("play");
                jQuery(".jp-progress").addClass("hidden");
                jQuery(".jp-current-time").addClass("hidden");
                jQuery(".jp-duration").addClass("hidden");
                jQuery(".track-info").removeClass("hidden");
            }
            if (id == "last_comment") {
                radio_player.jPlayer("setMedia", {
                    m4a: 'http://ksk1.ru/radio-news/comment.mp3'
                }).jPlayer("play");
                jQuery(".jp-progress").removeClass("hidden");
                jQuery(".jp-current-time").removeClass("hidden");
                jQuery(".jp-duration").removeClass("hidden");
                jQuery(".track-info").addClass("hidden");
            }
            if (id == "itogiDnya") {
                radio_player.jPlayer("setMedia", {
                    m4a: 'http://ksk1.ru/radio-news/itogi.mp3'
                }).jPlayer("play");
                jQuery(".jp-progress").removeClass("hidden");
                jQuery(".jp-current-time").removeClass("hidden");
                jQuery(".jp-duration").removeClass("hidden");
                jQuery(".track-info").addClass("hidden");
            }
            jQuery(".play-radio #play").addClass('hidden');
            jQuery(".play-radio #pause").removeClass('hidden');
        });
        jQuery(".play-radio div").bind("click", function () {
            if (jQuery(this).prop("id") == "play") {
                radio_player.jPlayer({
                   // aac: "http://radio.ksk66.ru:8000/aac",
                    m4a: 'http://radio.ksk66.ru:8000/mp3'
                }).jPlayer("play");
                jQuery(".play-radio #play").addClass('hidden');
                jQuery(".play-radio #pause").removeClass('hidden');
            }
            if (jQuery(this).prop("id") == "pause") {
                radio_player.jPlayer({
                  //  aac: "http://radio.ksk66.ru:8000/aac",
                    m4a: 'http://radio.ksk66.ru:8000/mp3'
                }).jPlayer("pause");
                jQuery(".play-radio #play").removeClass('hidden');
                jQuery(".play-radio #pause").addClass('hidden');
            }
        });
        // при окончании трека уже есть выше ended
        /* radio_player.bind(jQuery.jPlayer.event.ended , function(event) {
         jQuery(".play-radio i.fa-play").removeClass('hidden');
         jQuery(".play-radio i.fa-pause").addClass('hidden');


         });*/
        radio_player.bind(jQuery.jPlayer.event.pause, function (event) {
            jQuery(".play-radio #play").removeClass('hidden');
            jQuery(".play-radio #pause").addClass('hidden');
        });
        radio_player.bind(jQuery.jPlayer.event.error, function (event) {
            jQuery(".play-radio #fa-play").removeClass('hidden');
            jQuery(".play-radio #pause").addClass('hidden');
            jQuery(".track-info").html("<span class='error'><strong>Ошибка:</strong> " + event.jPlayer.error.message + "</span>");
            console.log("Ошибка: " + event.jPlayer.error.message);
            console.log(event.jPlayer.error);
            console.error(event.jPlayer.error);
        });
        radio_player.bind(jQuery.jPlayer.event.play, function (event) {
            jQuery(".play-radio #play").addClass('hidden');
            jQuery(".play-radio #pause").removeClass('hidden');
            if (video_player) {
                video_player.stopVideo();
            }
        });

    });


});

jQuery(".menu-main-tv").one('mouseenter', function () {

    // Видео плеер
    LoadJS("https://www.youtube.com/iframe_api", function () {
    });

});
// Callback-функции для Youtube API должны бфть объявлены глобально
/*function onYouTubeIframeAPIReady() {
 video_player = new YT.Player('player-youtube', {
 height: '390',
 width: '400',
 videoId: 'watch?list=PLQl3YfO6YBrinuwe9JkZuqJLZj0U9TZH_',
 events: {
 'onStateChange': onPlayerStateChange
 }
 });
 }*/
function onYouTubePlayerAPIReady() {
    video_player = new YT.Player("player-youtube", {
        height: "390",
        width: "400",
        playerVars: {
            listType: "playlist",
            list: "PLQl3YfO6YBrg3j78sOmPSV-SAtB_JWpeL", 
            color: "white",
            modestbranding: 1,
            theme: "light",
            controls: 2,
            fs: 1,
            showinfo: 0,
            index:0
        },
        events: {
            "onStateChange": onPlayerStateChange
        }
    });
   /* video_player2 = new YT.Player("player-youtube2", {
        height: "390",
        width: "400",
        playerVars: {
            listType: "playlist",
            list: "PLQl3YfO6YBrinuwe9JkZuqJLZj0U9TZH_",
            color: "white",
            modestbranding: 1,
            theme: "light",
            controls: 2,
            fs: 1,
            showinfo: 0
        },
        events: {
            "onStateChange": onPlayerStateChange
        }
    });*/
}
function onYouTubePlayerAPIReadyTwo() {
    video_player2 = new YT.Player("player-youtube2", {
        height: "390",
        width: "400",
        playerVars: {
            listType: "playlist",
            list: "PLQl3YfO6YBrinuwe9JkZuqJLZj0U9TZH_",
            color: "white",
            modestbranding: 1,
            theme: "light",
            controls: 2,
            fs: 1,
            showinfo: 0
        },
        events: {
            "onStateChange": onPlayerStateChange
        }
    });
}

// Не работает сейчас
function onPlayerReady(event) {
    event.target.playVideo();
}

// Останавливать радио, когда начинает играть видео
function onPlayerStateChange(event) {

    if (radio_player && event.data == YT.PlayerState.PLAYING) {
        radio_player.jPlayer("pause");
    }
}


// Функции для работы с cookies
function deleteCookie(key) {
    setCookie(key, null, 0);
}
function setCookie(key, value, time) {
    var expires = new Date();
    expires.setTime(expires.getTime() + time);
    document.cookie = key + '=' + encodeURIComponent(value || '') + ';expires=' + expires.toUTCString();
}
function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? decodeURIComponent(keyValue[2]) : null;
}

// Сохранить на N сек. состояние плеера радио при закрытии вкладки или браузера
window.onbeforeunload = function () {
    if (jQuery(".play-radio #play.hidden").length) {
        setCookie("player_state", "live", 30000);
    }
};

// </editor-fold>


/* <editor-fold desc="Карта leaflet"> */
/*
var map, layersControl;
// Подгоняем высоту карты
function setMapHeight() {
    //FIXME: ОТКЛЮЧЕНО!
    return;

    //FIXME: Не устанавливать высоту для мобильных устройств!
    jQuery('.navpanel-info > .subpanel').not('.panel-map').each(function () {
        const this_height = jQuery(this).height();
        const panel_map = jQuery('.panel-map');
        if (this_height > panel_map.height()) {
            const panel_map_map = jQuery('#panel-map');
            panel_map_map.css('height',
                this_height - (panel_map_map.offset().top - panel_map.offset().top));
        }
    });
    if (map) { // Уведомить leaflet, что высота поменялась. Несколько раз (костыль)
        map.invalidateSize();
        window.setTimeout(map.invalidateSize, 300);
        window.setTimeout(map.invalidateSize, 800);
    }
}
// кнопкa "Карта" на панели в Городе
//jQuery('.map-feature').click( function() {jQuery('#btn-feature-services').click();});*/

// Кнопки НавПанели и выдвижные панельки
jQuery('.triggers-weather').click(function () {
    jQuery('#btn-feature-info').click();
    jQuery("#panel-movies").appendTo(".panel_movie_weather");
});

jQuery('.btn-feature').not('.cat-feature , .map-feature').click(function () {
    const was_active = jQuery(this).hasClass('active'),
        potential_cond_active = jQuery('.potential-cond-active');
    jQuery('.navpanel, .btn-feature').removeClass('active');
    potential_cond_active.removeClass('cond-active');
    if (!was_active) {
        if (jQuery(this).attr("id") == "btn-feature-info") {  // панель с погодой внизу
            jQuery("#weather-panel").appendTo(".panel_movie_weather");
        }
        jQuery(this).addClass('active');
        jQuery('.' + jQuery(this)[0].id.replace('btn-feature', 'navpanel'))
            .removeClass('hidden').addClass('active').trigger('first-load');
    } else {
        potential_cond_active.addClass('cond-active');
    }
});

jQuery('.btn-collapse').click(function () {
    jQuery('.navpanel, .btn-feature').removeClass('active');
    jQuery('.potential-cond-active').addClass('cond-active');
});

jQuery('#navpanel-info').one('first-load', function () {
    // загружаем кнопку категории вместо кнопки другие категории
    jQuery("#category-other").load("http://ksk1.ru/cat-menu.html");
    var tmp = new Date();
    var t = tmp.getDay();
    var week = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    jQuery('.list-days-ajax [data-toggle]').each(function () {
        var res = jQuery(this).attr('data-day');
        if (res > 2) {
            t = new Date();
            n = new Date(t.setDate(t.getDate() + parseInt(res - 1)));
            jQuery(this).text(week[n.getDay()]);
        }

    });

    jQuery('.list-days-ajax a[data-toggle="tab"]').one('shown.bs.tab', function () {

        var day_num = jQuery(this).data('day');
        jQuery("#day" + day_num).load("http://ksk66.ru/movies-block/", {"day_week": day_num}, function () {
            if (day_num > 1 && day_num < 7)
                jQuery('.list-days-ajax a[data-day="' + (day_num + 1) + '"]').trigger('shown.bs.tab');
        });
    });

    jQuery('.list-days-ajax a[href="#day1"]').trigger('shown.bs.tab'); //загрузка закладки "Сегодня в кино"


    // Загружаем афишу
    jQuery("#panel-agenda").load("http://ksk66.ru/agenda-block/", setMapHeight);

});

function AddGeosearch() {
    LoadJS('http://ksk1.ru/vendor/leaflet-geosearch/src/js/l.control.geosearch.js', function () {
        L.GeoSearch.Provider.OpenStreetMapKsk = L.Class.extend({
            initialize: function (options) {
                options = L.Util.setOptions(this, options);
            },
            /** @return {string} Service URL */
            GetServiceUrl: function (qry) {
                var parameters = L.Util.extend({q: "Красноуфимск " + qry, format: 'json'}, this.options);
                return 'http://nominatim.openstreetmap.org/search' + L.Util.getParamString(parameters);
            },
            ParseJSON: function (data) {
                if (data.length == 0) return [];
                var results = [];
                for (var i = 0; i < data.length; i++)
                    results.push(new L.GeoSearch.Result(data[i].lon, data[i].lat, data[i].display_name));
                return results;
            }
        });

        new L.Control.GeoSearch({
            provider: new L.GeoSearch.Provider.OpenStreetMapKsk(),
            country: 'ru',
            searchLabel: 'Найти на карте…',
            notFoundMessage: 'К сожалению, ничего не найдено',
            zoomLevel: 17
        }).addTo(map);
    });
}
function AddLayerGoogle() {
    var tiles_OpenMapSurfer_hybrid = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/hybrid/x={x}&y={y}&z={z}', {
        minZoom: 8,
        maxZoom: 20,
        attribution: 'Карта: <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
        'плитки: <a href="http://giscience.uni-hd.de/">GIScience</a>'
    });
    LoadJS('http://ksk1.ru/vendor/leaflet-plugins/layer/tile/Google.js', function () {
        layersControl.addBaseLayer(L.layerGroup([new L.Google(), tiles_OpenMapSurfer_hybrid]), 'Спутник Google');
    });
}

function AddLayerBing() {
    var tiles_OpenMapSurfer_hybrid = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/hybrid/x={x}&y={y}&z={z}', {
        minZoom: 8,
        maxZoom: 20,
        attribution: 'Карта: <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
        'плитки: <a href="http://giscience.uni-hd.de/">GIScience</a>'
    });

    LoadJS('http://ksk1.ru/vendor/leaflet-plugins/layer/tile/Bing.js', function () {
        layersControl.addBaseLayer(L.layerGroup([new L.BingLayer("AqYQy-mMupdP9Y5Ig8rx374e1-Rai_sBWOwD_FuUDp9b1exLtRRbMYxIcTmGZe2Z"),
            tiles_OpenMapSurfer_hybrid]), "Спутник Bing");
    });
}

function AddLayerYandex() {
    LoadJS('http://api-maps.yandex.ru/2.0/?load=package.map&lang=ru-RU', function () {
        LoadJS('http://ksk1.ru/vendor/leaflet-plugins/layer/tile/Yandex.js', function () {
            layersControl.addBaseLayer(new L.Yandex('map'), "Карта Яндекс");
        });
    });
}
function AddLayerTravel() {
    var Thunderforest_OpenCycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    layersControl.addBaseLayer(L.layerGroup([new L.TileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {maxZoom: 18}),
        Thunderforest_OpenCycleMap]), "Туристическая");

}

function AddOverlayHills() {
    var tiles_OpenMapSurfer_hills_hybrid = L.tileLayer('http://129.206.74.245:8004/tms_hs.ashx?x={x}&y={y}&z={z}', {
        opacity: 0.3
//        minZoom: 8,
//        maxZoom: 20
// TODO: attribution http://korona.geog.uni-heidelberg.de/contact.html
    });

    layersControl.addOverlay(tiles_OpenMapSurfer_hills_hybrid, "Рельеф")
}

function AddButtonFullScreen() {
    LoadCSS('http://ksk1.ru/vendor/leaflet-fullscreen-brunob/Control.FullScreen.css');
    LoadJS('http://ksk1.ru/vendor/leaflet-fullscreen-brunob/Control.FullScreen.js', function () {
        L.control.fullscreen({
            position: 'topleft',
            title: 'Развернуть на весь экран',
            content: "<i class='fa fa-expand'></i>",
            forceSeparateButton: true
        }).addTo(map);

    });
}
function AddControlLoading() {
    LoadCSS('http://ksk1.ru/vendor/leaflet-loading/src/Control.Loading.css');
    LoadJS('http://ksk1.ru/vendor/leaflet-loading/src/Control.Loading.js', function () {
        var loadingControl = L.Control.loading({
            separate: true
        });
        map.addControl(loadingControl);
    });
}
function AddButtonHome() {
    LoadCSS('http://ksk1.ru/vendor/leaflet-defaultextent/dist/leaflet.defaultextent.css');
    LoadJS('http://ksk1.ru/vendor/leaflet-defaultextent/dist/leaflet.defaultextent.js', function () {
        L.control.defaultExtent({title: 'Возврат к первоначальному виду'}).addTo(map);
    });
}
function AddButtonLocate() {
    LoadCSS('http://ksk1.ru/vendor/leaflet-locatecontrol/dist/L.Control.Locate.min.css');
    LoadJS('http://ksk1.ru/vendor/leaflet-locatecontrol/dist/L.Control.Locate.min.js', function () {
        L.control.locate({strings: {title: "Где я нахожусь"}}).addTo(map);
    });
}
function AddRoutingMachine() {
    LoadCSS('http://ksk1.ru/vendor/leaflet-routing-machine/dist/leaflet-routing-machine.css');
    LoadJS('http://ksk1.ru/vendor/leaflet-routing-machine/dist/leaflet-routing-machine.js', function () {
        L.Routing.control({
            waypoints: [
                L.latLng(map.getCenter().lat, map.getBounds().getEast() * .25 + map.getBounds().getWest() * .75),
                L.latLng(map.getCenter().lat, map.getBounds().getEast() * .75 + map.getBounds().getWest() * .25)
            ],
            routeWhileDragging: true
        }).addTo(map);
        jQuery(".leaflet-marker-icon").css('z-index', '200');
    });
}

function AddButtonRouting() {
    LoadJS("http://ksk1.ru/vendor/leaflet-easybutton/easy-button.js", function () {
        L.easyButton('fa-exchange', function () {
                //TODO: Скрывать навигацию, если она есть (сделать кнопку-переключатель)
                //TODO: Помечать кнопку как активную (не очень нужно)
                if (jQuery('img').is('.leaflet-marker-icon') == false) {
                    AddRoutingMachine();
                }
                else {
                    jQuery('img.leaflet-marker-icon').remove();
                    jQuery('.leaflet-routing-container').remove();
                    jQuery('.leaflet-clickable').remove();
                }
            },
            'Проложить маршрут по карте'
        );
    });
}

function AddMeasureControl() {
    var drawnItems = new L.FeatureGroup();
    map.addLayer(tiles_OpenMapSurfer_hybrid);
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: tiles_OpenMapSurfer_hybrid
        }
    });
    map.addControl(drawControl);
    map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;
        if (type === 'marker') {
            // Do marker specific actions
        }
        // Do whatever else you need to. (save to db, add to map etc)
        map.addLayer(layer);
    });
}
function AddMap(name_id, map_height) {
    jQuery('#' + name_id).css('height', map_height);
    LoadCSS('http://ksk1.ru/vendor/leaflet/dist/leaflet.css');
    LoadCSS('http://ksk1.ru/vendor/leaflet-addon.css');
// TODO: загружать локальный leaflet
    LoadJS('http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js', function () {

        map = L.map(name_id, {drawControl: true});
        map.setView([56.6132, 57.7689], 13);
        layersControl = new L.Control.Layers(null, null, {'collapsed': false}).addTo(map);
        /*var tiles_OpenMapSurfer = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
         minZoom: 8,
         maxZoom: 20,
         attribution: 'Карта: <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
         'плитки: <a href="http://giscience.uni-hd.de/">GIScience</a>'
         });
         tiles_OpenMapSurfer.addTo(map);*/
        // layersControl.addBaseLayer( tiles_OpenMapSurfer, 'Карта OpenStreetMap');
        var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Карта OpenStreetMap</a>'
        });
        OpenStreetMap_Mapnik.addTo(map);
        layersControl.addBaseLayer(OpenStreetMap_Mapnik, 'Карта OpenStreetMap');
        AddControlLoading();
        AddButtonFullScreen();
        AddButtonRouting();
        AddButtonHome();

        AddGeosearch();

        AddButtonLocate();

        LoadJS("https://raw.githubusercontent.com/vogdb/Leaflet.ActiveLayers/master/dist/leaflet.active-layers.min.js");

        window.setTimeout(function () {
            //  AddLayerESRI();
            AddLayerGoogle();
            AddLayerBing();
            AddLayerYandex();
            //AddOverlayHills();
            AddLayerTravel();
        }, 100)
    });
}
/* </editor-fold> */


// Кнопка «Наверх»
(function () {
    const topOffsetToShowBtn = 1000;
    if (top.location.pathname !== '/service/') {
        if (jQuery('.btn-scroll-up').length) {
            // У нас уже есть кнопка «Наверх», ничего делать не надо
        } else {
            var btn_home = jQuery('<a/>', {
                href: '#header',
                class: 'btn-home inactive text-center',
                title: 'К верху страницы',
                html: '<div><svg baseProfile="basic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 70"><path fill="#999" d="M44.546 60.295l-2.251 2.251c-.273.273-.634.454-1.038.454-.362 0-.766-.181-1.039-.454l-17.718-17.718-17.718 17.718c-.273.273-.677.454-1.039.454s-.766-.181-1.039-.454l-2.251-2.251c-.272-.273-.453-.677-.453-1.038 0-.362.181-.766.454-1.039l21.007-21.008c.273-.273.677-.454 1.039-.454s.766.181 1.039.454l21.008 21.008c.272.273.453.677.453 1.039 0 .361-.181.765-.454 1.038z"/></svg></div> <div>&#1053;&#1040;&#1042;&#1045;&#1056;&#1061;</div>'
            }).click(function (event) {
                jQuery('html,body,#content').animate({scrollTop: 0}, 'slow');
                btn_home.blur();
                event.preventDefault();
            });
            var url = document.location.href;
            if (url.match(/ob.ksk66/))
                btn_home.appendTo('body');
            else {
                btn_home.appendTo('body');
            }
            jQuery(window).scroll(ShowHideBtnHome);
            jQuery('#content').scroll(ShowHideBtnHome);
        }
    }
    function ShowHideBtnHome() {
        if (jQuery(this).scrollTop() > topOffsetToShowBtn)
            btn_home.removeClass("inactive");
        else
            btn_home.addClass("inactive");
    }
})();


// FIXME: понять, что это за фигня, и удалить
jQuery('span.our-projects').on('mouseenter', function () {
    jQuery(this).addClass('active');
}).on('mouseleave', function () {
    jQuery(this).removeClass('active');
});


// Browser-update
/*
var $buoop = {
    text: "Ваш браузер (%s) <b>устарел</b>. Он <b>небезопасен</b> и <b>не показывает все возможности</b> этого и других сайтов. \
<a%s>Узнайте, как обновить ваш браузер</a>"
};
LoadJS('//browser-update.org/update.js');
*/

