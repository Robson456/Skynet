gra.Game = function(game) {};
gra.Game.prototype = {
    //console.log("create function is invoke only once, after first loading the game");
    create: function() {
    //turn on arcade physics engine(ofc from a phaser lib)
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = g;
    //default bg settings 
        bg = this.add.sprite(this.world.width/2, this.world.height/2, 'bg');
        bg.anchor.setTo(0.5, 0); 
        
        bg2 = this.add.sprite(this.world.width/2, (bg.y - bg.height), 'bg');
        bg2.anchor.setTo(0.5, 0);

    //sound button
        // sound = this.add.sprite(100, this.world.height - 70, 'soundOff');
        sound = this.add.sprite(this.world.width - 70, 70, 'soundOff');
        sound.anchor.setTo(0.5);
        sound.scale.setTo(0.35);
        sound.inputEnabled = true;  
    //coin icon(which is next to coin counter)
        smallCoinIcon = this.add.sprite(60,76, 'smallCoin')
        smallCoinIcon.anchor.setTo(0.5);
        smallCoinIcon.scale.setTo(0.08)

    //load player with default settings 
        this.createNewPlayer();
    //game text- "tap to start the game"
        tapToStart = this.add.sprite(this.world.width/2, (this.world.height/10)*7, 'tapToStart');
        tapToStart.anchor.setTo(0.5);
    //score txt label
        parsecDistanceLabel = this.add.text(440, 80);
        parsecDistanceLabel.text = "distance in parsec: 0";
        parsecDistanceLabel.anchor.setTo(0.5);
        parsecDistanceLabel.font = 'Arial';
        parsecDistanceLabel.fontSize = 30;
        parsecDistanceLabel.fill = '#FFFFFF';
    //coins amount text settings
        coinAmountLabel = this.add.text(120, 80);
        coinAmountLabel.text = cash;
        coinAmountLabel.anchor.setTo(0.5);
        coinAmountLabel.font = 'Arial';
        coinAmountLabel.fontSize = 30;
        coinAmountLabel.fill = '#FFFFFF'
    //music&sounds
        music = this.add.audio('musicUniverse');
        music.stop();
        
        coinPicking = this.add.audio('coinPicking');
        coinPicking.stop();

        //turning on/off the sound 
        sound.events.onInputDown.add(this.listener, this);
    


        //magneses group
        magneses = this.add.group()
        
        //coins spawning
        coins = this.add.group();
	    // this.time.events.loop(300, this.spawnCoin, this);
	    this.time.events.loop(300, this.startSpawning, this);
        
        //particle coins emitter 
        emitter = this.add.emitter(0, 0, 100);
        emitter.makeParticles('goldParticle');
        emitter.gravity = 2000;

        //particle emitter (asteriod collision)
        whiteEmitter = this.add.emitter(0, 0, 100);
        whiteEmitter.makeParticles('whiteParticle');
        whiteEmitter.gravity = 1000;

        redEmitter = this.add.emitter(0, 0, 100);
        redEmitter.makeParticles('redParticle');
        redEmitter.gravity = 1000;

        blackEmitter = this.add.emitter(0,0, 100);
        blackEmitter.makeParticles('blackParticle');
        blackEmitter.gravity = 300;

        blueEmitter = this.add.emitter(0, 0, 100)
        blueEmitter.makeParticles('blueParticle')
        // blueEmitter.gravity = 1000

    //text labels of game over screen
        distanceLabelGameOverScreen = this.add.text(this.world.width/2, this.world.height/2);
        distanceLabelGameOverScreen.text = "GameOver";
        distanceLabelGameOverScreen.anchor.setTo(0.5);
        distanceLabelGameOverScreen.font = 'Arial';
        distanceLabelGameOverScreen.fontSize = 40;
        distanceLabelGameOverScreen.fill = '#000000'
        
        distanceLabelGameOverScreen.alpha = 0;
            //tutaj jeszcze text label z coinami

//dodaje tajmer co ile ma sie wykonac funkcja spawnMagnes
        // timer = this.time.create(false);
        // timer.loop(6000, this.spawnMagnes, this);
        // timer.start();

        
    },
    
    update: function() {   
        
        this.physics.arcade.collide(enemy, player, this.collisionHandler, null, this);    
        this.physics.arcade.collide(player, coins, this.coinCollisionHandler);
        this.physics.arcade.collide(player, magneses, this.magnesCollisionHandler);        
        this.poruszanieTla(bg); 
   
        //sprawdzamy, czy podczas gdy menu jest wlaczone,
        //zostalo wykonanie tapniecie, jesli tak, to wychodzimy
        //z menu
        //we check if while the menu is on, and tap event was emitted by user, then we're quiting menu and the game is starting 

        //    //->    //should I change to starting the game just if tap,
        //    //->    // or the small text with label "tap to start the 
        //    //->    //game" was clicked 

        if(menuTurnedOn === true && this.game.input.pointer1.isDown === true  ||  this.input.activePointer.leftButton.isDown === true){
            menuTurnedOn = false;//main game started
        }

        //sprawdzamy czy menu jest wlaczone, czy nie i wykonujemy odpowiednie operacje
        if (menuTurnedOn === false && isGameOverScreenOn === false){//kiedy menu nie jest wlaczone, czyli gra wlasciwa juz dziala
//wylaczamy niektore elementy, ktore maja byc widoczne tylko w menu, zamienic na funkcje?
            tapToStart.visible = false;// wylaczamu widocznosc napisu z menu "Tap to start the game"
            sound.visible = false;
            parsecDistanceLabel.visible = true;
            coinAmountLabel.visible = true;
            smallCoinIcon.visible = true;


            

//main game functions running every time once again after update function is invoked

            //glowne funkcje gry
            this.playerMove(player);    
            this.wyswietlaniePrzebytejOdleglosci();
            this.createEnemy();//invoking only then, when an enemy object is not existing(after death of pre exisiting one, because always there will be one enemy in game )
            this.enemiesMove(enemy);//tworzy nowe obiekty asteroidy po losowych stronach ekranu   
            this.destroyCoins();
            this.iloscMonet(cash);

         } else {//when menu is on and main game is not running
            //turning on visibility of some elements, which should be visible only in menu
            tapToStart.visible = true;//wlaczamy napis "Tap to start the game"" w menu
            sound.visible = true;
            parsecDistanceLabel.visible = false;
            coinAmountLabel.visible = false;
            smallCoinIcon.visible = false;
            
        }
        
    },

    render: function(){
        //this.game.debug.soundInfo(music, 20, 32);
    },

    enemiesMove: function(sprite){
        sprite.y += enemySpeed;
        if(sprite.y >= this.world.height){
            this.losowaniePozycjiWroga(sprite);//kiedy jestesmy nizej, niz wysokosc ekranu, to pojawia sie u gory jeszcze raz(asteroida) 
            score +=  1;
        }
    },
    losowaniePozycjiWroga: function(sprite){
        sprite.body.velocity.y = g;
        sprite.y = 0-sprite.height/2;//nowa wylosowana pozycja y jest zawsze nad canvasem, tak, ze nas nie widac
        sprite.x = this.rnd.integerInRange(0+sprite.width/2, this.world.width-sprite.width/2);//funkcja losujaca
        //upgrade losownia pozycji wroga (przygotowanie do opsługi mobilnej)
        if (score >= 9){
            g += 10
        }
        if (sprite.x <= this.world.width/2){
            sprite.x = 160;
        }
        else{
            sprite.x = 480;
        }    
    
    },
    playerMove: function(sprite){
        //obsluga dla komputera(sterowanie)
        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            if(sprite.x === 480){
                movingShipLeft = this.add.tween(sprite).to( { x: 160 }, zwrotnosc,  Phaser.Easing.Linear.None, true);
            }

        }else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            if(sprite.x === 160){
                movingShipRight = this.add.tween(sprite).to( { x: 480 }, zwrotnosc, Phaser.Easing.Linear.None, true);
            }
        }

        //obsluga urzadzen mobilnych
        if(wasScreenTapped == false && this.game.input.pointer1.isDown){
            downX = this.game.input.x;
            wasScreenTapped = true;//zapobiega ponownemu wywolaniu kodu w tym warunku, jesli jeszcze nie "puscilismy" ekranu
            wasScreenTapped2 = true;//pozwala wlaczyc kod w warunku onUp(nizej)
        }
        if(wasScreenTapped2 === true && this.game.input.pointer1.isUp){
            upX = this.game.input.x;
            //tutaj przemieszczenie(zamienic na ease function)
            if(downX - upX < 0){//wtedy minus->czyli idziemy w prawo
                if(sprite.x === 160){
                    movingShipRight = this.add.tween(sprite).to( { x: 480 }, zwrotnosc, Phaser.Easing.Linear.None, true);
                }
            }else if(downX - upX > 0){//wtedy idziemy w lewo
                if(sprite.x === 480){
                    movingShipLeft = this.add.tween(sprite).to( { x: 160 }, zwrotnosc,  Phaser.Easing.Linear.None, true);
                }
            }

            wasScreenTapped = false;
            wasScreenTapped2 = false;
        }
    },
    poruszanieTla: function(sprite){
        bg.y += universeSpeed; 
        bg2.y += universeSpeed;  

        if (bg.y >= this.world.height){
            bg.y = -bg.y;
        }

        if (bg2.y >= this.world.height){
            bg2.y = -bg2.y;
        }
    },
    wyswietlaniePrzebytejOdleglosci: function(){
        distanceParsecNew += 1;
        var pointsTween = this.add.tween(this);
		pointsTween.to({ distanceParsecOld: distanceParsecNew }, 1000, Phaser.Easing.Linear.None, true, 500);
		
        pointsTween.onUpdateCallback(function(){
			parsecDistanceLabel.setText('distance in parsec: ' + Math.floor(distanceParsecNew));
		}, this);

        distanceParsecOld = distanceParsecNew;
    },
    iloscMonet: function(ilosc){
        coinAmountLabel.text =  ilosc;
    },
    collisionHandler: function(){//tutaj przechodzimy do menu zmieniajac zmienna menuTurnedOn na true i wlaczajac odpowiednie animacje, oraz resetujac inne parametry
        whiteEmitter.x = player.x;
        whiteEmitter.y = player.y;

        redEmitter.x = player.x;
        redEmitter.y = player.y;

        this.camera.shake(0.025, 100);
        whiteEmitter.start(true, 400, null, 30);
        redEmitter.start(true, 400, null, 10);
        
        //nisczymy obiekt wroga i wlaczamy menu
        player.destroy();

        this.destroyEnemy(enemy);
        menuTurnedOn = true;
        
        this.gameOverScreen();
    },
    magnesCollisionHandler: function(player, magneses) {
        redEmitter.x = magneses.x
        redEmitter.y = magneses.y

        blueEmitter.x = magneses.x
        blueEmitter.y = magneses.y

        magneses.destroy();
        // this.camera.shake(0.025, 100);

        // this.camera.shake(0.01, 50);
        redEmitter.start(true, 1000, null, 50)
        blueEmitter.start(true, 1000, null, 50)
        
    },
    listener: function(){//ta funkcja "slucha" czy nie zostal klkniety guzik od wyciszania i wlaczania dzwiekow
      if(soundBuffor === 1){//muzyka wlaczona
           sound.loadTexture('soundOff');
           soundBuffor = 0;
           music.stop();
           
      }else if(soundBuffor === 0){//muzyka wylaczona
           sound.loadTexture('soundOn');
           soundBuffor = 1;
           music.play('', 0, 1, true);
      }     
    },
    createEnemy: function(){//tworzymy obiekt wroga, kiedy wyjdziemy z menu po uderzeniu w ekran
        if(checkIfEnemyCreated === false){
            //score = 0; //zerujemy wynik z ewentualnej poprzedniej rozgrywki, dlatego tutaj, bo ta funkcja wlacza sie raz, zaraz po rozpoczeciu rozgrywi od nowa
            cash = 0 ;

            enemy = this.add.sprite(160, -100, 'enemy');
            this.physics.arcade.enable(enemy);
            enemy.enableBody = true;
            enemy.body.immovable = true;
            enemy.scale.setTo(0.2);
            enemy.anchor.setTo(0.5);

            checkIfEnemyCreated = true;//ta wartosc zmieniamy na false podczas kolizji z obiektem i wlaczeniem spowrotem menu
        }
    },
    destroyEnemy: function(sprite){//niszczymy obiekt wroga przy uruchomieniu menu
        if(menuTurnedOn === true && checkIfEnemyCreated === true){
            sprite.destroy();
            checkIfEnemyCreated = false;
         }
    },
    spawnCoin: function(){
        if(menuTurnedOn === false){
            let random = this.rnd.integerInRange(0, 1);
      
            if(random >= magnesMinChance && 
            random <= magnesMaxChance)
                coin = this.add.sprite(160, -100 ,'coin', 0);
            else
                coin = this.add.sprite(480, -100 ,'coin', 0);
                
            
            
            this.physics.arcade.enable(coin);
            coin.enableBody = true;
            coin.scale.setTo(0.1);
            coin.anchor.setTo(0.5);
            rotating = coin.animations.add('rotating');
            coin.animations.play('rotating',10, true);
            coin.body.gravity.y = universeSpeed;

            coins.add(coin);
        }
   },
    spawnMagnes: function(){      
        let magnes;
        if(menuTurnedOn === false){
            let random = this.rnd.integerInRange(0, 1);
            if(random === 0)
                magnes = this.add.sprite(160, -100 ,'magnes', 0);
            else
                magnes = this.add.sprite(480, -100 ,'magnes', 0);

        }    

        this.physics.arcade.enable(magnes);
        magnes.enableBody = true;
        magnes.scale.setTo(0.1);
        magnes.anchor.setTo(0.5, 1);
        magnes.body.gravity.y = universeSpeed;

        magneses.add(magnes);
    },
    startSpawning: function() {
        let random = this.rnd.integerInRange(1, 100)
        
        let magnesChance = 1;
        //spawning every object which is falling from up to bottom, e.g. coins, magnes etc.

        if (random === magnesChance)
            this.spawnMagnes(this)
        else//otherwise spown most probably item, which is a coin   
            this.spawnCoin(this)
    },
    destroyCoins: function(){//destroyin' coins which get to the bottom border of the screen, to prevent stack overflow
        coins.forEach(function(object) {
            if(object.y >= this.world.height) {
                object.destroy();
            }
        }, this);
    },
    destroyMagneses: function() {
        magneses.forEach(function(object) {
            if(object.y >= this.world.height) {coins.add(coin);
                object.destroy();
            }
        }, this);
    },
    coinCollisionHandler: function(player, coins){//wykrywa kolizje gracza z coinami
        //dzwiek podnoszenia coina
        coinPicking.play('', 0, 1, false);
        
        //particle emission while collecting coins 
        emitter.x = coins.x; 
        emitter.y = coins.y; 
        
        coins.destroy();
        emitter.start(true, 1000, null, 20);
        
        let increasingValue = 1;
        
        //coin amount increase by 1
        //maybe should add something(insntead of just shop from IAP)
        //to increase amount by more than just 1 

        cash += increasingValue;
//tutaj animacje znikania coinow i dzwieki ich podnoszenia
    },
    gameOverScreen: function(){
        isGameOverScreenOn = true;


        //white splash
        whiteSplash = this.add.sprite(this.world.width/2, this.world.height/2, 'whiteSplash');
        whiteSplash.anchor.setTo(0.5);
        
        whiteSplash.alpha = 0;
        
        //whiteSplasha animation
        var tween = this.add.tween(whiteSplash).to({alpha:1}, 2000, Phaser.Easing.Linear.None, true, 0);
        
        tween.onComplete.addOnce(function(){
            this.zapiszIWyswietlWynik();
        }, this);//po wykonaniu tween wywolujemy raz funkcje zapiszIwyswietlWynik()


//uruchamiac przed startem gry?
//this.resetZmiennychPoPrzegranej();//resetujemy zmienne tutaj, bo beda one jeszcze potrzebne w ekranie po przegranej


        //mozna ladowac nowy state? tylko co z muzyka, ktora sie przeladuje, chyba ze uzyje kodu od mazura

//tutaj kod podliczania punktow i tworzenia obiektu player na nowo po przegranej

    },
    resetZmiennychPoPrzegranej: function(){
        distanceParsecOld = 0;
        distanceParsecNew = 0;
        cash = 0;
        g = 300;
    },
    zapiszIWyswietlWynik: function(){
        //localStorage, zostawiamy zmienne rekordow w telefonie
        //distance in parsec record
        if(localStorage.getItem('highscore') === null){
            localStorage.setItem('highscore', distanceParsecNew);    
        }
        else if(distanceParsecNew > localStorage.getItem('highscore')){
            localStorage.setItem('highscore', distanceParsecNew);
            //info czy nowy rekord
            console.log("nowy rekord!");
         }  
         //coins coin amount
        if(localStorage.getItem('money') === null){
            localStorage.setItem('money', cash);    
        }
        else if(localStorage.getItem('money')!= null){//mozna zmienic na else?
            var money = cash + localStorage.getItem('money'); 
            localStorage.setItem('money', money);
         }  
           

        //tworze text label, wktorym bedzie wyswietlany text po skonczeniu animacji
        distanceEndGameLabel = this.add.text(this.world.width/2, this.world.height/2);
        distanceEndGameLabel.anchor.setTo(0.5);
        distanceEndGameLabel.font = 'Arial';
        distanceEndGameLabel.fontSize = 50;
        distanceEndGameLabel.fill = '#000000'

        coinAmountGameOverScreenLabel = this.add.text((this.world.width/2), (this.world.height/2)+100);
        coinAmountGameOverScreenLabel.anchor.setTo(0.5);
        coinAmountGameOverScreenLabel.font = 'Arial';
        coinAmountGameOverScreenLabel.fontSize = 50;
        coinAmountGameOverScreenLabel.fill = '#000000'

        //pocztakowa ilosc punktow, od ktorej zaczyna sie tween wyswietlania przebytej odleglosci
        var x = 0;//od tej wartosci zaczynamy tweenowac wynik
        
        //tworzymy tweena
        var distanceTween = this.add.tween(this);
        distanceTween.to({ x: distanceParsecNew }, 2000, Phaser.Easing.Linear.None, true, 500);

        //wyswietlanie zmian twena w trakcie jego trwania
        distanceTween.onUpdateCallback(function(){
            distanceEndGameLabel.setText('You flew: '+ Math.floor(this.x) +' parsecs');
        }, this);
        

        distanceTween.onComplete.addOnce(function(){//po zakonczeniu tweenu z przebyta odlegloscia
        //emitujemy strzal black square
            blackEmitter.x = distanceEndGameLabel.x;
            blackEmitter.y = distanceEndGameLabel.y;

            this.camera.shake(0.025, 200);
            blackEmitter.start(true, 400, null, 15);
            

//tutaj kwadratowy emitter po zakonczniu wyswietlania punktow, albo nizej?

            var littleCoin = this.add.sprite((this.world.width/2)-100, (this.world.height/2)+100, 'littleCoin');
            littleCoin.scale.setTo(0.2);
            littleCoin.anchor.setTo(0.5);
//tutaj dzwiek pojawiajacej sie monety
            var coin_amount = 0;
            //tworzymy tween
            var coinAmountTween = this.add.tween(this);
            coinAmountTween.to({coin_amount: cash }, 2000, Phaser.Easing.Linear.None, true, 500);
       
            //wyswietlanie zmian twena w trakcie jego trwania
            coinAmountTween.onUpdateCallback(function(){
                coinAmountGameOverScreenLabel.setText(Math.round(this.coin_amount));
            }, this);

//play again, or menu?
//wyrzucic? 
                coinAmountTween.onComplete.addOnce(function(){
                var retry = this.add.text((this.world.width/2), (this.world.height/2)+300);
                retry.anchor.setTo(0.5);
                retry.text = "Do you want to play again?"
                retry.font = 'Arial';
                retry.fontSize = 45;
                retry.fill = '#000000';
//wait till choice will be made
                retry.destroy();
                littleCoin.destroy();
                coinAmountGameOverScreenLabel.destroy();
                distanceEndGameLabel.destroy();//niszczymy napis z przebyta odlegloscia
                this.add.tween(whiteSplash).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true, 0);
//ponizzszye linie wywolac po okreslonym czasie, lub po kliknieciu
                this.createNewPlayer();
                this.resetZmiennychPoPrzegranej();
                isGameOverScreenOn = false;//wychdzimy z ekranu gameOverScreen
            }, this);
        }, this);


    },
    createNewPlayer: function(){
        player = this.add.sprite(160,900,'player');//x,y,nazwa z preoload
        this.physics.arcade.enable(player);
        player.enableBody = true;
        player.body.gravity.y = - this.physics.arcade.gravity.y;//antygrawitacja- zeby nie przyspieszal, jak asteroidy
        player.body.immovable = true;//immovable, zeby asteroidy nie spychaly statku
        player.scale.setTo(0.6);
        player.anchor.setTo(0.5, 0);
        flying = player.animations.add('flying');
        player.animations.play('flying', 21 , true);
    }
    //koniec
}