gra.Game = function(game) {};
gra.Game.prototype = {
    //console.log("To jest funkcja create wywolywana tylko raz po wczytaniu strony");
    create: function() {
    //wlaczamy fizyke arkadowa
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = g;
    //poczatkowe ustawienia dla tla
        bg = this.add.sprite(this.world.width/2, this.world.height/2, 'bg');
        bg.anchor.setTo(0.5, 0); 
        
        bg2 = this.add.sprite(this.world.width/2, (bg.y - bg.height), 'bg');
        bg2.anchor.setTo(0.5, 0);

    //guziki od dzwieku
        sound = this.add.sprite((this.world.width*6)/7, this.world.height - 70, 'soundOff');
        sound.anchor.setTo(0.5);
        sound.scale.setTo(0.35);
        sound.inputEnabled = true;
  
    
    //poczatkowe ustawienia dla obiektu wroga
    /*
        enemy = this.add.sprite(160, -100, 'enemy');
        this.physics.arcade.enable(enemy);
        enemy.enableBody = true;
        enemy.body.immovable = true;
        enemy.scale.setTo(0.2);
        enemy.anchor.setTo(0.5);

    */    

    //ustawienia dla coina
        coin = this.add.sprite(160, 100,'coin');
        this.physics.arcade.enable(coin);
        //enemy.enableBody = true;
        coin.scale.setTo(0.1);
        coin.anchor.setTo(0.5);
        
    //poczatkowe ustawienia dla gracza
        player = this.add.sprite(160,900,'player');//x,y,nazwa z preolod
        this.physics.arcade.enable(player);
        player.enableBody = true;
        player.body.gravity.y = - this.physics.arcade.gravity.y;//antygrawitacja- zeby nie przyspieszal, jak asteroidy
        player.body.immovable = true;//immovable, zeby asteroidy nie spychaly statku
        player.scale.setTo(0.6);
        player.anchor.setTo(0.5);
        flying = player.animations.add('flying');
        player.animations.play('flying', 21 , true);
    //napis w menu- tap to start the game
        tapToStart = this.add.sprite(this.world.width/2, this.world.height/2, 'tapToStart');
        tapToStart.anchor.setTo(0.5);
    //wyswietlnie punktow- txt label
        text = this.add.text(this.world.width/2, 80);
        text.text = score;
        text.anchor.setTo(0.5);
        text.font = 'Impact';
        text.fontSize = 60;

        text.fill = '#FFFFFF';
        text.setShadow(2, -2, 'rgba(0,0,0,0.75)', 0);
    //music
        music = this.add.audio('musicUniverse');
        music.stop();
        //wlaczenie i wylaczenie dzwieku
        sound.events.onInputDown.add(this.listener, this);
    },
    
    update: function() {   
        
        this.physics.arcade.collide(enemy, player, this.collisionHandler, null, this);    
        this.poruszanieTla(bg); 
   

        //sprawdzamy, czy podczas gdy menu jest wlaczone, zostalo wykonanie tapniecie, jesli tak, to wychodzimy z menu
        if(menuWlaczone === true && this.game.input.pointer1.isDown === true || this.input.activePointer.leftButton.isDown === true){
            menuWlaczone = false;//i zaczynamy grac w gre wlasciwa
        }

        //sprawdzamy czy menu jest wlaczone, czy nie i wykonujemy odpowiednie operacje
        if (menuWlaczone === false){//kiedy menu nie jest wlaczone, czyli gra wlasciwa juz dziala
//wylaczamy niektore elementy, ktore maja byc widoczne tylko w menu, zamienic na funkcje
            tapToStart.visible = false;// wylaczamu widocznosc napisu z menu "Tap to start the game"
            sound.visible = false;
                    

            this.zbieranieCoina(coin);

            //glowne funkcje gry
            this.playerMove(player);    
            this.wyswietlaniePunktow(score);
            this.createEnemy();//wykonuje sie tylko gdy obiekt nie istnieje
            this.enemiesMove(enemy);//tworzy nowe obiekty asteroidy po losowych stronach ekranu   
        } else {//kiedy menu jest wlaczone i gra wlasciwa nie jest wlaczona
//wlaczamy niektore elementy, ktore maja byc widoczne tylko w menu, zamienic na funkcje
            tapToStart.visible = true;//wlaczamy napis "Tap to start the game"" w menu
            sound.visible = true;
        }
        
    },

    render: function(){
        //this.game.debug.soundInfo(music, 20, 32);
    },

    enemiesMove: function(sprite){
        sprite.y += enemySpeed;
        if(sprite.y >= this.world.height){
            this.losowaniePozycjiWroga(sprite);//kiedy jestesmy nizej, niz wysokosc ekranu, to pojawia sie u gory jeszcze raz(asteroida) 
            score += 1;
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
            sprite.x = 160;//zamienic na ease funkction
        }else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            sprite.x = 480;
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
                sprite.x = 480;//zamienic na ease function
            }else if(downX - upX > 0){//wtedy idziemy w lewo
                sprite.x = 160;
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
    wyswietlaniePunktow: function(pkt){
       text.text = pkt;
    },
    collisionHandler: function(){//tutaj przechodzimy do menu zmieniajac zmienna menuWlaczone na true i wlaczajac odpowiednie animacje, oraz resetujac inne parametry
        this.camera.shake(0.025, 100);
        //nisczymy obiekt wroga i wlaczamy menu
        this.destroyEnemy(enemy);
        menuWlaczone = true;

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
            score = 0; //zerujemy wynik z ewentualnej poprzedniej rozgrywki, dlatego tutaj, bo ta funkcja wlacza sie raz, zaraz po rozpoczeciu rozgrywi od nowa

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
        if(menuWlaczone === true && checkIfEnemyCreated === true){
            sprite.destroy();
            checkIfEnemyCreated = false;
         }
    },
    zbieranieCoina: function(coin){
        coin.body.velocity.y = 500;
        if (coin.y >= player.y && coin.x == player.x || coin.y >= this.world.height){
            coin.y = 0-coin.height/2;//nowa wylosowana pozycja y jest zawsze nad canvasem, tak, ze nas nie widac
            coin.x = this.rnd.integerInRange(0+coin.width/2, this.world.width-coin.width/2);//funkcja losujaca
            if (coin.x <= this.world.width/2){
                coin.x = 160;
            }else{
                coin.x = 480;
            }
        }
    }
}