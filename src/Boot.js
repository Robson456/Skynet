var gra = {
    _WIDTH: 640,
    _HEIGHT: 1136
};

//tutaj zmienne
var bg;
var bg2;
var player;
var enemy;
var whiteSplash;
var universeSpeed = 5;
var enemySpeed = 10;
var score  = 0;
var cash = 0;
var parsecDistanceLabel;
var tapToStart;
var coin;
var g = 35;
var emitter;
var distanceParsecOld = 0;
var distanceParsecNew = 0;
//input memory, onDown and onUp
var downX;
var upX;
var wasScreenTapped = false;
var wasScreenTapped2 = false;//bufor dla tapniecia
//sound
var sound;//soundOn, soundOff sprite
var soundBuffor = 0; //1 gdy dzwiek wlaczony,0 gdy dzwiek wylaczony
var music;
//splashScene 
var splashImage1;
var tween;
//menu staff, czy wlaczone itp.
var menuWlaczone = true;
var checkIfEnemyCreated = false;//sprawdzamy czy wrog jest stworzony, funkcja wykonuje sie w update, w menu obiekt jest zabijany
var checkIfScreenWasTouchedInMenu = false;//zmiana na true powoduje wlaczenie gry wlasciwej
//do rakiet
var zwrotnosc = 300;//parametr szybkosci przesuniecia statku
gra.Boot = function(game) {};
gra.Boot.prototype = {

    create: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.state.start('Preload');
    }
};