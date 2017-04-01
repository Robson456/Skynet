//laduje pliki multimedialne do pamieci
gra.Preload = function(game) {};
gra.Preload.prototype = {
    preload: function() {
        //sprite statyczne(nie animowane)
        this.load.image('enemy', 'img/stone.png');
        this.load.image('bg', 'img/bg.png');  
        this.load.image('bg2', 'img/bg2.png');
        this.load.image('splash1', 'img/splashImage1.png');
        this.load.image('soundOn','img/soundOn.png');
        this.load.image('soundOff','img/soundOff.png');
        this.load.image('tapToStart','img/tapToStartTheGame.png');
        //animacje
        this.load.spritesheet('coin','img/coinAnimation.png', 400 , 400 , 4);
        this.load.spritesheet('player','img/shipAnimation.png', 102 , 284 , 3);
        //dzwieki
        this.load.audio('musicUniverse', 'assets/sound.mp3');
},
    create: function() {
        this.state.start('Game');
    }

};