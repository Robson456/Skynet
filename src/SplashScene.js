gra.SplashScene = function(game) {};
gra.SplashScene.prototype = {
    create: function() {

        splashImage1 = this.add.sprite(this.world.width/2, this.world.height/2, 'splash1');
        splashImage1.anchor.setTo(0.5);
        
        splashImage1.alpha = 0;

        //animacja fading in a sprite, data roku
        tween = this.add.tween(splashImage1).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        //po 4 sekundach wlaczamy funkcje koniec animacji, ktora wylacza infinity loop powyzszej funkcji
        this.time.events.add(Phaser.Timer.SECOND * 4, this.koniecAnimacji, this);
    },
    update: function() {
    },
    koniecAnimacji: function(){
        //wylaczamy animacje i uruchamiamy kolejnego state'a
        tween.stop();
        this.startGame();
    },
    startGame:function(){
        this.state.start('Game');
    }
    
}