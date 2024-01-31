let tg = window.Telegram.WebApp;

tg.expand();

class Main extends Phaser.Scene {
    constructor() {
        super({ key: "Main" });
    }
    preload() {

        this.gameData = this.cache.json.get("conf");
    }
    create() {
        this.LC = this.gameData["lettersCount"];
        this.answer = this.gameData["answerPosition"];
        this.letters = this.gameData["letters"];
        this.i_letters = this.gameData["letterPosition"];
        this.buttons = this.gameData["buttons"];
        this.light = this.gameData["answerErrOk"];
        this.image = this.gameData["image"];
        this.dataSended = false;
        this.currentPos = 0;
        this.answerLetters = [];
        this.Letters = [];
        this.ok = [];
        this.no = [];
        this.add.image(this.image.x, this.image.y, "rebus").setDisplaySize(this.image.l, this.image.h).setOrigin(0);
        for (let i = 0; i < this.LC; i++)
        {
            this.answerLetters.push(this.make.text({
            x: this.answer.x + this.answer.gap * i * 1.005, 
            y: this.answer.y,
            padding: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5
            },
            text: " ",
            style: {
                fontSize: '25px',
                fontFamily: 'font1',
                color: '#000000ff',
                align: 'center',
                fontWeight: '500',
            },
            add: true
            }).setOrigin(0.5));
            this.answerLetters[i].number = i;
            this.answerLetters[i].lock = false;
            this.answerLetters[i].setInteractive();
            this.answerLetters[i].on("pointerdown", (pointer) => {
                //this.currentPos = i;
            });
        }
        for (let i = 0; i < 12; i++)
        {
            console.log("newCreate");
            let i_ = i;
            if (i_ >= 7) {i_ = i + 1;}
            console.log("x:" + (this.i_letters.x + this.i_letters.gapX * i_) + " y:" + (this.i_letters.y + this.i_letters.gapY * Math.floor(i_ / 7)))
            let txt = this.make.text({
                x: this.i_letters.x + this.i_letters.gapX * i_ * 0.994 + (i_ >= 8 ? 3 : 0) - this.i_letters.gapX * (7 * Math.floor(i_ / 7)), 
                y: this.i_letters.y + this.i_letters.gapY * Math.floor(i_ / 7),
                padding: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5
                },
                text: this.letters[i],
                style: {
                    fontSize: '25px',
                    fontFamily: 'font1',
                    color: '#ffffffff',
                    align: 'center',
                    fontWeight: '500',
                },
                add: true
            }).setOrigin(0.5).setDepth(99);
            let temp = this.add.image(this.i_letters.x + this.i_letters.gapX * i_ * 0.994 + (i_ >= 8 ? 3 : 0) - this.i_letters.gapX * (7 * Math.floor(i_ / 7)),  this.i_letters.y + this.i_letters.gapY * Math.floor(i_ / 7), "WHITE").setInteractive().setDisplaySize(52,52).setAlpha(0.001);
            temp.letter = this.letters[i];
            temp.txt = txt;
            temp.use = false;
            temp.on("pointerdown", (pointer) => {
                console.log("CLC");
                if (this.currentPos < this.LC && !temp.use) {
                    this.temp = this.currentPos;
                    while (this.answerLetters[this.currentPos].lock) {this.currentPos++; if(this.currentPos > this.LC - 1) {this.currentPos = this.temp - 1; break;}}
                    if (this.answerLetters[this.currentPos].text != " ")
                    {
                        this.answerLetters[this.currentPos].text = " ";
                        this.tweens.add({
                            targets: this.answerLetters[this.currentPos].objBtn,
                            alpha: 0.001, 
                            duration: 500, 
                            ease: 'Linear', 
                        });
                        this.answerLetters[this.currentPos].objBtn.txt.setTint(0xffffff);
                        this.answerLetters[this.currentPos].objBtn.use = false;
                        this.tweens.add({
                            targets: this.ok[this.currentPos],
                            alpha: 0, 
                            duration: 500, 
                            ease: 'Linear', 
                        });
                        this.tweens.add({
                            targets: this.no[this.currentPos],
                            alpha: 0, 
                            duration: 500, 
                            ease: 'Linear', 
                        });
                    }
                    this.answerLetters[this.currentPos].text = temp.letter;
                    this.answerLetters[this.currentPos].objBtn = temp;
                    this.tweens.add({
                        targets: temp,
                        alpha: 1, 
                        duration: 200, 
                        ease: 'Linear', 
                    });
                    temp.txt.setTint(0x000000);
                    temp.use = true;
                    if (this.currentPos < this.LC - 1)
                    {this.currentPos++;}
                }
            });
            this.Letters.push(temp);
        }
        this.add.image(this.buttons.del.x, this.buttons.del.y, "VOID").setInteractive().on("pointerdown", (pointer) => {
            console.log("Pos:" + this.currentPos);
            if (this.currentPos - 1 >= 0) {
                while(this.answerLetters[this.currentPos].lock && this.currentPos > 0){this.currentPos--};
                console.log("Pos2:" + this.currentPos);
                if (this.answerLetters[this.currentPos].text == " " && !this.answerLetters[this.currentPos - 1].lock)
                {
                    this.answerLetters[this.currentPos - 1].text = " ";
                    this.tweens.add({
                        targets: this.answerLetters[this.currentPos - 1].objBtn,
                        alpha: 0.001, 
                        duration: 500, 
                        ease: 'Linear', 
                    });
                    this.answerLetters[this.currentPos - 1].objBtn.txt.setTint(0xffffff);
                    this.answerLetters[this.currentPos - 1].objBtn.use = false;
                    this.tweens.add({
                        targets: this.ok[this.currentPos - 1],
                        alpha: 0, 
                        duration: 500, 
                        ease: 'Linear', 
                    });
                    this.tweens.add({
                        targets: this.no[this.currentPos - 1],
                        alpha: 0, 
                        duration: 500, 
                        ease: 'Linear', 
                    });
                    this.temp = this.currentPos;
                    if (this.currentPos > 0) {this.currentPos--; while(this.answerLetters[this.currentPos].lock && this.currentPos > 0){this.currentPos--}; if (this.currentPos == 0 && this.answerLetters[this.currentPos].lock) this.currentPos = this.temp;}
                }
                else if (this.answerLetters[this.currentPos - 1].lock && this.answerLetters[this.currentPos].text == " " && this.currentPos != 1)
                {
                    console.log("while(this.answerLetters[this.currentPos - 1].lock && this.currentPos > 0){this.currentPos--};");
                    while(this.answerLetters[this.currentPos - 1].lock && this.currentPos > 0){this.currentPos--};
                    console.log("whilePos:" + this.currentPos);
                }
            }
            if (this.currentPos >= 0) 
                {
                    while(this.answerLetters[this.currentPos].lock && this.currentPos > 0){this.currentPos--};
                    if (this.answerLetters[this.currentPos].text != " " && !this.answerLetters[this.currentPos].lock)
                    {
                        this.answerLetters[this.currentPos].text = " ";
                        this.tweens.add({
                            targets: this.answerLetters[this.currentPos].objBtn,
                            alpha: 0.001, 
                            duration: 500, 
                            ease: 'Linear', 
                        });
                        this.answerLetters[this.currentPos].objBtn.txt.setTint(0xffffff);
                        this.answerLetters[this.currentPos].objBtn.use = false;
                        this.tweens.add({
                            targets: this.ok[this.currentPos],
                            alpha: 0, 
                            duration: 500, 
                            ease: 'Linear', 
                        });
                        this.tweens.add({
                            targets: this.no[this.currentPos],
                            alpha: 0, 
                            duration: 500, 
                            ease: 'Linear', 
                        });
                    }
                }            
        }).setDisplaySize(this.buttons.del.l, this.buttons.del.h);
        for (let i = 0; i < this.LC; i++)
        {
            this.no.push(this.add.image(this.light.x + i * this.light.gap, this.light.y, "NO").setDisplaySize(this.light.size, this.light.size).setAlpha(0));
            this.ok.push(this.add.image(this.light.x + i * this.light.gap, this.light.y, "OK").setDisplaySize(this.light.size, this.light.size).setAlpha(0));
        }
        this.add.image(this.buttons.ok.x, this.buttons.ok.y, "VOID").setInteractive().on("pointerdown", (pointer) => {
            this.goodAnsw = true;
            for (let i = 0; i < this.LC; i++)
            {
                console.log(this.answerLetters[i].text + " ?= " + this.answer.answer[i]);
                if (this.answerLetters[i].text == this.answer.answer[i] && this.answerLetters[i].text != " ") {
                    this.answerLetters[i].lock = true;
                    this.tweens.add({
                        targets: this.ok[i],
                        alpha: 1, 
                        duration: 500, 
                        ease: 'Linear', 
                    });
                } else {
                    if (this.answerLetters[i].text != " ")
                    {this.tweens.add({
                        targets: this.no[i],
                        alpha: 1,  
                        duration: 500,  
                        ease: 'Linear',  
                    });}
                    this.goodAnsw = false;
                    console.log("Fail");
                }
            }
            if (this.goodAnsw && !this.dataSended)
                {
                    if (this.hintOn){tg.sendData("Reward:2"); this.dataSended = true;}
                    else{tg.sendData("Reward:3"); this.dataSended = true;}
                }
            
        }).setDisplaySize(this.buttons.ok.l, this.buttons.ok.h);

        this.add.image(this.buttons.hint.x, this.buttons.hint.y, "VOID").setInteractive().on("pointerdown", (pointer) => {
            for (let i = 0; i < this.LC; i++) 
            {
                if (this.answerLetters[i].text == " ")
                {
                    this.hintOn = true;
                    this.currentPos = i;
                    for (let iq = 0; iq < 12; iq++)
                    {
                        if (this.Letters[iq].txt.text == this.answer.answer[i])
                        {
                            this.answerLetters[this.currentPos].text = this.Letters[iq].txt.text;
                            this.answerLetters[this.currentPos].objBtn = this.Letters[iq];
                            this.tweens.add({
                                targets: this.Letters[iq],
                                alpha: 1, 
                                duration: 200, 
                                ease: 'Linear', 
                            });
                            this.Letters[iq].txt.setTint(0x000000);
                            this.Letters[iq].use = true;
                            if (this.currentPos < this.LC - 1)
                            {this.currentPos++;}
                            break;
                        }
                    }
                    break;
                }
            }
        }).setDisplaySize(this.buttons.hint.l, this.buttons.hint.h);;
    }
    update()
    {
        
    }
}
class EndGame extends Phaser.Scene {
    constructor() {
        super({ key: "EndGame" });
    }
    create() {
      
        
    }
}

class Load extends Phaser.Scene {
    constructor() {
        super({ key: "Load" });
    }
    create() {
       
    }
}
class PreloadSC extends Phaser.Scene {
    preload() {
        this.load.image("rebus", "image/content/image.png");
        this.load.image("VOID", "image/VOID.png");
        this.load.image("WHITE", "image/WHITE.png");
        this.load.image("OK", "image/OK.png");
        this.load.image("NO", "image/NO.png");
        this.load.json("conf",  "gameConfig.json");
        this.load.image("light", "image/light.png");
    }
    create() {
        this.scene.start("Main");
    }
}
const config2 = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: !0,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.NO_CENTER , width: 470, height: 740, min: { width: 47, height: 74 }, max: { width: 4700, height: 7400 }, zoom: 1 },
    scene: [PreloadSC, Main, Load, EndGame],
};

let stopping = false;
const game = new Phaser.Game(config2);
