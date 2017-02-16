/**
 * Скрипты для телевизионного табло //ksk1.ru
 */

const default_timeouts = { // Периоды обновления панелей в секундах
    ".board-main": 5,
    ".board-yummie": 42,
    "#clock, #date": 10,
    ".track-data-text": 15,
    ".board-weather": 20 * 60,
    ticker: 15 * 60,
    retry_on_error: 5
};

var timers = {};
var radio_player="";
// <editor-fold desc="LoadJS & LoadCSS">
window.libsAvail = [];
window.libsLoading = [];
function LoadRes(src, type, callback) {
    var resName = src.split("/").reverse()[0];
    if (libsAvail.indexOf(resName) != -1) {
        console.log("Available already: «" + resName + "» " + src +
            ((typeof (callback) == "function") ? ", running callback" : ""));
        if (typeof (callback) == "function") callback();
    } else if (libsLoading.indexOf(resName) != -1) {
        console.log("Still loading, retry: «" + resName + "» " + src);
        window.setTimeout(function () {
            LoadRes(src, type, callback)
        }, 100);
    } else {
        window.libsLoading.push(resName);
        console.log("Loading «" + resName + "» " + src);
        var e = document.createElement(type);
        if (type == 'script') {
            e.type = "text/javascript";
            e.src = src;
            e.async = true;
        } else {
            e.type = "text/css";
            e.href = src;
            e.rel = "stylesheet";
        }
        e.onerror = function () {
            console.error("Error loading " + src);
            window.libsLoading.splice(window.libsLoading.indexOf(resName), 1);
        };
        e.onload = function () {
            resName = src.split("/").reverse()[0];
            console.log("Loaded «" + resName + "» " + src +
                ((typeof (callback) == "function") ? ", running callback" : ""));
            window.libsAvail.push(resName);
            window.libsLoading.splice(window.libsLoading.indexOf(resName), 1);
            if (typeof (callback) == "function") callback();
        };
        document.getElementsByTagName("head")[0].appendChild(e);
    }
}
function LoadJS(src, onload) {
    LoadRes(src, 'script', onload)
}
function LoadCSS(src, onload) {
    LoadRes(src, 'link', onload)
}
// </editor-fold>

/**
 * Обновить часы в селектор
 * @param {string} selector jQuery selector for 2 elements
 */
function updateClock(selector) {
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();

    const nameMonth = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentHours = ( currentHours < 10 ? "0" : "" ) + currentHours;

    // Update the time display
    jQuery(selector).first().text(currentTime.getDate() + " " + nameMonth[currentTime.getMonth()]);
    jQuery(selector).last().text(currentHours + ":" + currentMinutes);
}


/**
 * Получить текущий трек в селектор
 * @param {string} selector jQuery selector
 */
function GetNowPlaying(selector) {
    jQuery.get("https://ksk1.ru/nowplaying.xml", function (data) {
        var track = jQuery(data).find("TRACK").first();
        if (track.attr("ARTIST")) {
            var track_text = track.attr("ARTIST") + " — " + track.attr("TITLE");
        }
        else if (track.attr("TITLE")) {
            track_text = track.attr("TITLE");
        } else  track_text = "";
        jQuery(selector).html(track_text.replace(/\[.*\]/, ""));
    });
}

function UpdateBlock(selector, seconds) {
    // Взять стандартный таймаут, если не передан параметром
    if (typeof (seconds) == 'undefined'){
        seconds = default_timeouts[selector];
    }

    var url_or_function = urls_or_functions[selector];

    if (typeof (url_or_function) == 'function') {
        // Вызвать функцию ...
        url_or_function(selector);
    } else if (typeof (url_or_function) == 'string') {
        // ... или загрузить url
        //jQuery(selector).load(url_or_function);
        jQuery.get( url_or_function )
            .done(function( content ) {
                jQuery(selector).html( content );
                var customized = "";
                if (jQuery(selector).find('[data-duration]').length) {
                    seconds = jQuery(selector).find('[data-duration]').data('duration');
                    customized = " (new timeout "+seconds+"s from banner)";
                    UpdateTimer(selector, seconds);
                }
                if  (document.getElementsByTagName('iframe')) {radio_player.jPlayer("pause");
                   UpdateTimer(".board-main", '1757'); console.log("radio ="+radio_player);}
                else radio_player.jPlayer("play");
                console.log ("Zone «"+selector+"» loaded «"+url_or_function+"»" + customized);
                console.log("selector"+selector);
            })
            .fail(function( error ) {
                seconds = default_timeouts['retry_on_error'];
                console.warn ("Zone «"+selector+"» failed loading «"+url_or_function+"». Retry in "+seconds+"s");
                UpdateTimer(selector, seconds);
            });
            //.always(function() {});
    } else {
        console.log ("Unknown url_or_function for '"+selector+": "+url_or_function);
    }
    UpdateTimer(selector, seconds);
}

function UpdateTimer(selector, seconds) {
    // Очистить (если есть) предыдущий таймер
    if (typeof (timers[selector]) != 'undefined') {
        clearTimeout(timers[selector]);
    }
    // Задать новый таймер и сохранить его
    timers[selector] = setTimeout(function () {
        UpdateBlock(selector);
    }, seconds * 1000);

    //console.log ("New timeout for «"+selector+"»: "+seconds+"s");
}

//LoadJS("//ksk1.ru/bootstrap-3c/js/bootstrap.min.js");

const urls_or_functions = {
    ".board-main": "https://ksk1.ru/yummies/ksk1.ru/main/",
    ".board-yummie": "https://ksk1.ru/yummies/ksk1.ru/side/",
    ".board-weather": "https://ksk1.ru/weather/conditions.html",
    ".track-data-text": GetNowPlaying,
    "#clock, #date": updateClock
};

LoadJS("https://ksk1.ru/js/jquery-1.js", function () {

// Инициализировать все блоки
    for (var block in urls_or_functions) {
        UpdateBlock(block);
    }

// Запускает бегущую строку  //jonmifsud.com/open-source/jquery/jquery-webticker/
    LoadJS('/tv/news-ticker.js', function () {
        jQuery('#webticker').webTicker({
            speed: 100,
            rssurl: '//krufimsk.ru/feed/',
            rssfrequency: default_timeouts['ticker'] / 60,
            hoverpause: false
        });
    });

// Радио плеер
    LoadJS("//jplayer.org/latest/dist/jplayer/jquery.jplayer.min.js", function () {
        radio_player = jQuery("#jquery_jplayer_1");
        radio_player.jPlayer({
            ready: function () {
                radio_player.parent().parent().removeClass("jp-loading").addClass("jp-ready");
                jQuery(this).jPlayer("setMedia", {
                    m4a: "//radio.ksk66.ru:8000/aac",
                    mp3: "//radio.ksk66.ru:8000/mp3"
                });
                radio_player.jPlayer("play");
            },
            play: function (/*event*/) {
                //jQuery(".play-radio i.fa-play").addClass('hidden');
                //jQuery(".play-radio i.fa-pause").removeClass('hidden');

            //    if (typeof(video_player) != 'undefined') {
            //        video_player.stopVideo();
             //   }
            },
            error: function (event) {
                //jQuery(".play-radio i.fa-play").removeClass('hidden');
                //jQuery(".play-radio i.fa-pause").addClass('hidden');
                console.warn("Ошибка: " + event.jPlayer.error.message + ". Пробую повторно через 2с");
                console.warn(event.jPlayer.error);
                console.error(event.jPlayer.error);
                setTimeout(function () {
                    radio_player.jPlayer("play");
                }, default_timeouts['retry_on_error'] * 1000);
            },
            swfPath: "js",
            supplied: "mp3, m4a"
        });
    });

});