let tg = window.Telegram.WebApp;

tg.expand();

class Main extends Phaser.Scene {
    constructor() {
        super({ key: "Main" });
    }
    preload() {
        this.gameData = this.cache.json.get("conf");
        this.areaSize = this.gameData["levelSize"];
        for (let i = 1; i < Math.pow(this.areaSize, 2) + 1; i++)
        {
            this.load.image("P" + i, "image/content/" + i + ".png");
        }
    }
    create() {
        this.pointer = this.input.activePointer;
        this.hintUse = false;
        this.gameData = this.cache.json.get("conf");
        console.log(this.gameData);
        this.pazleSize = this.gameData["pazleSize"];
        this.corrector = this.gameData["microCorretorMultipy"];
        this.tray = this.gameData["trayPazleSize"];
        this.HintDelay = this.gameData["HintDelay"];
        this.lightplus = this.gameData["HintLightYPlus"];
        this.sence = this.gameData["ScrollToPullSence"];
        this.trayPos = this.gameData["trayPos"];
        this.FPP = this.gameData["firstPaslePos"];
        this.HiXY = this.gameData["hintPos"];
        this.MagnetR = this.gameData["magnetRadius"];
        this.dataBeSended = false;
        this.PullOrScrol = -1;
        this.scrolControl = {
            FY: 0,
            SY: 0,
            Counter: 0,
            go: false
        };
        this.pazles = [];
        this.hintProgress = false;
        this.extracted = [];
        let selectedValues = [];
        let toLocked = [];
        for (let i = 1; i < Math.pow(this.areaSize, 2) + 1; i++) {
            let sel;
            do {
                sel = Phaser.Math.Between(1, Math.pow(this.areaSize, 2));
            } while (selectedValues.includes(sel));
        
            selectedValues.push(sel);
            console.log(this.trayPos + "-> x:" + this.trayPos[0] + " y:" + this.trayPos[1] + ", targetSize: " + this.pazleSize);
            let temp = this.add.image(this.trayPos[0] + this.tray / 2 + this.tray * (i - 1) + 5 * (i - 1), this.trayPos[1] + this.tray / 2, "P" + sel).setOrigin(0.5);
            temp.pos = [this.trayPos[0] + this.tray / 2 + this.tray * (i - 1) + 5 * (i - 1), this.trayPos[1] + this.tray / 2]
            this.pazles.push(temp);
            temp.number = sel;
            temp.setDisplaySize(this.tray, this.tray);
            temp.setInteractive();
            temp.scaled = false;
            temp.locked = false;
            temp.lock = false;
            let isMagnetized = false;
            temp.on("pointerdown", (pointer) => {
                if (this.extracted.includes(temp.number))
                {
                    this.PullOrScrol = 1;
                }
                isMagnetized = true;
            });
            this.input.on("pointerup", (pointer) => {
                this.PullOrScrol = -1;
                this.scrolControl.Counter = 0;
                isMagnetized = false;
                console.log("UP");
                let absCountEnd = 0;
                this.pazles.forEach(item => {
                    if (item.locked)
                    {
                        absCountEnd++;
                    }
                    if (item.lock && !item.locked) {console.log(Phaser.Math.Distance.Between(item.pos[0], item.pos[1], item.POSL.x, item.POSL.y));}
                    if (item.lock && !item.locked && Phaser.Math.Distance.Between(item.pos[0], item.pos[1], item.POSL.x, item.POSL.y) < this.MagnetR) {
                        console.log("CENTERING///");
                        item.locked = true;
                        this.tweens.add({
                            targets: item,
                            x: item.POSL.x,
                            y: item.POSL.y,
                            duration: 200,
                            ease: 'Linear',
                        });
                    }
                });
                if (absCountEnd == Math.pow(this.areaSize, 2))
                {
                    console.log("END");
                    if (this.hintUse && !this.dataBeSended)
                    {tg.sendData("Reward:2"); this.dataBeSended = true;}
                    else if (!this.dataBeSended)
                    {tg.sendData("Reward:3"); this.dataBeSended = true;}
                }
                for (let i3 = 0; i3 < Math.pow(this.areaSize, 2); i3++)
                {
                    if (!this.extracted.includes(this.pazles[i3].number))
                    {
                        console.log("find");
                        if (this.pazles[i3].pos[0] > this.trayPos[0] + this.tray / 2 + 5)
                        {
                            console.log("NotGodPos");
                            let difference = this.pazles[i3].pos[0] - (this.trayPos[0] + this.tray / 2 + 5);
                            for (let i4 = 0; i4 < Math.pow(this.areaSize, 2); i4++)
                            {               
                                if (!this.extracted.includes(this.pazles[i4].number))
                                {
                                    this.tweens.add({
                                        targets: this.pazles[i4],
                                        x: this.pazles[i4].pos[0] - difference,
                                        duration: 600,
                                        ease: 'Cubic.inOut',
                                    });
                                    this.pazles[i4].pos = [this.pazles[i4].pos[0] - difference, this.pazles[i4].pos[1]];
                                }  
                            }
                        }
                        break;
                    }
                }
                if (Math.pow(this.areaSize, 2) - this.extracted.length > 7)
                {
                    for (let ij = Math.pow(this.areaSize, 2) - 1; ij >= 0; ij--)
                        {
                            if (!this.extracted.includes(this.pazles[ij].number))
                            {
                                if (this.pazles[ij].pos[0] < this.trayPos[2] - this.tray / 2 + 5)
                                {
                                    console.log("this.pazles[ij].pos[0] = " + this.pazles[ij].pos[0]);
                                    let difference2 = this.pazles[ij].pos[0] - (this.trayPos[2] - this.tray / 2 + 5);
                                    for (let i4 = 0; i4 < Math.pow(this.areaSize, 2); i4++)
                                    {
                                        if (!this.extracted.includes(this.pazles[i4].number))
                                            {
                                                this.tweens.add({
                                                    targets: this.pazles[i4],
                                                    x: this.pazles[i4].pos[0] - difference2,
                                                    duration: 600,
                                                    ease: 'Cubic.inOut',
                                                });
                                                this.pazles[i4].pos = [this.pazles[i4].pos[0] - difference2, this.pazles[i4].pos[1]];
                                            }  
                                    }
                                }
                                break;
                            }
                        }
                }
                else
                {
                    for (let i3 = 0; i3 < Math.pow(this.areaSize, 2); i3++)
                        {
                            if (!this.extracted.includes(this.pazles[i3].number))
                            {
                                if (this.pazles[i3].pos[0] != this.trayPos[0] + this.tray / 2 + 5)
                                {
                                    let difference = this.pazles[i3].pos[0] - (this.trayPos[0] + this.tray / 2 + 5);
                                    for (let i4 = 0; i4 < Math.pow(this.areaSize, 2); i4++)
                                    {               
                                        if (!this.extracted.includes(this.pazles[i4].number))
                                        {
                                            this.tweens.add({
                                                targets: this.pazles[i4],
                                                x: this.pazles[i4].pos[0] - difference,
                                                duration: 600,
                                                ease: 'Cubic.inOut',
                                            });
                                            this.pazles[i4].pos = [this.pazles[i4].pos[0] - difference, this.pazles[i4].pos[1]];
                                        }  
                                    }
                                }
                                break;
                            }
                        }
                    }
            });
            if (!this.timerEvent)
            {
                this.timerEvent = this.time.addEvent({
                    delay: this.HintDelay * 1000,
                    callback: function () {
                        console.log("Hi!");
                        this.t = this.add.particles(this.HiXY[0] + this.HiXY[2] / 2, this.HiXY[1] + this.HiXY[3] / 2 - this.lightplus, "light", {
                            speed: 0,
                            lifespan: 1000,
                            quantity: 1,
                            frequency: 1000,
                            gravityY: 0,
                            alpha: { start: 0.5, end: 0 },
                            scale: 2,
                        });
                    },
                    callbackScope: this,
                    loop: false
                });
            }
            this.input.on("pointermove", (pointer) => {    

                if (this.timerEvent) {
                    this.timerEvent.destroy();
                }
                this.timerEvent = this.time.addEvent({
                    delay: this.HintDelay * 1000,
                    callback: function () {
                        console.log("Hi!");
                        this.t = this.add.particles(this.HiXY[0] + this.HiXY[2] / 2, this.HiXY[1] + this.HiXY[3] / 2 - this.lightplus, "light", {
                            speed: 0,
                            lifespan: 1000,
                            quantity: 1,
                            frequency: 1000,
                            gravityY: 0,
                            alpha: { start: 0.5, end: 0 },
                            scale: 2,
                        });
                    },
                    callbackScope: this,
                    loop: false
                });
                if (this.t)
                {this.t.stop();}
                //////////////////////////
                //console.log("+");
                if (this.scrolControl.Counter == 0)
                {
                    this.scrolControl.FY = pointer.y;
                }
                if (this.scrolControl.Counter >= 10 && this.PullOrScrol == -1 && isMagnetized)
                {
                    console.log("MouseMoveProcessing");
                    this.scrolControl.SY = pointer.y;
                    this.scrolControl.go = true;
                    for (let i = 0; i < Math.pow(this.areaSize, 2); i++)
                    {
                        this.pazles[i].MouseCord = pointer.x - this.pazles[i].pos[0];
                    }
                }
                //console.log("1:" + this.scrolControl.FY + " 2:" + this.scrolControl.SY);
                if (this.scrolControl.Counter <= 10 && this.PullOrScrol == -1 && isMagnetized)
                {
                    this.scrolControl.Counter += 1;
                    console.log(this.scrolControl.FY + ", " + this.scrolControl.SY + ": " + this.scrolControl.Counter);
                }

                if(isMagnetized && this.scrolControl.go)
                {
                    this.scrolControl.go = false;
                    if (this.scrolControl.SY - this.scrolControl.FY < -this.sence)
                    {
                        this.PullOrScrol = 1;
                        console.log("Pull: " + (this.scrolControl.SY - this.scrolControl.FY));
                    }
                    else
                    {
                        this.PullOrScrol = 0;
                        console.log("Scroll: " + (this.scrolControl.SY - this.scrolControl.FY));
                    }
                    this.scrolControl.FY = 0;
                    this.scrolControl.SY = 0;
                }
                if (this.PullOrScrol == 0)
                {
                    //console.log("MOVE");
                    for (let i2 = 0; i2 < Math.pow(this.areaSize, 2); i2++)
                    {
                        if (!this.extracted.includes(this.pazles[i2].number)) {this.pazles[i2].setPosition(pointer.x - this.pazles[i2].MouseCord, this.pazles[i2].pos[1]); this.pazles[i2].pos = [pointer.x - this.pazles[i2].MouseCord, this.pazles[i2].pos[1]];};
                        /*this.tweens.add({
                            targets: this.pazles[i2],
                            X: pointer.x,
                            duration: 200,
                            ease: 'Linear',
                        });*/
                    }
                }
                else if (this.PullOrScrol == 1 && isMagnetized) {
                    if (!temp.scaled)
                    {
                        this.extracted.push(temp.number);
                        console.log(this.pazleSize + "; " + this.tray + "; = " + this.pazleSize / this.tray);
                        this.tweens.add({
                            targets: temp,
                            scaleX: 0.5 * this.pazleSize / this.tray,
                            scaleY: 0.5 * this.pazleSize / this.tray,
                            duration: 200,
                            ease: 'Linear',
                        });
                        temp.scaled = true;
                        let pos = -1;
                        for (let i = 0; i < Math.pow(this.areaSize, 2); i++) {
                            console.log("X");
                            if (this.pazles[i].number == temp.number) {
                                pos = i;
                                break;
                            }
                        }
                        if ((pos === -1)) {
                            return;
                        }
                        for (let j = pos + 1; j < Math.pow(this.areaSize, 2); j++) {
                            console.log("J: " + j + " pos: " + pos);
                            if (!this.extracted.includes(this.pazles[j].number))
                            {
                                this.tweens.add({
                                    targets: this.pazles[j],
                                    x: this.pazles[j].pos[0] - this.tray - 5,
                                    duration: 200,
                                    ease: 'Linear',
                                });
                                this.pazles[j].pos[0] = this.pazles[j].pos[0] - this.tray - 5;
                            }
                        }
                    }
                    let closestPoint = null;
                    let minDistance = Number.MAX_SAFE_INTEGER;
            
                    for (let i = 0; i < this.areaSize; i++) {
                        for (let j = 0; j < this.areaSize; j++) {
                            let gridX = this.FPP[0] + this.pazleSize * (this.corrector) * i;
                            let gridY = this.FPP[1] + this.pazleSize * (this.corrector) * j;
                            let distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, gridX, gridY);
                            if (distance < 20 && distance < minDistance) {
                                minDistance = distance;
                                if ((i + j * this.areaSize + 1 == temp.number))
                                { 
                                    console.log(temp.lock + ": " + temp.lock != true);
                                    if ((temp.lock !== true))
                                    {
                                        closestPoint = { x: gridX, y: gridY };
                                        console.log("-" + temp.lock);
                                        temp.lock = true;
                                        temp.POSL = closestPoint;
                                    }
                                }
                            }
                        }
                    }
                    if (!temp.locked){
                        temp.pos = [pointer.x, pointer.y];
                        temp.x = pointer.x;
                        temp.y = pointer.y;
                    }
                    else 
                    {
                        if ((temp.x != temp.POSL.x) || (temp.y != temp.POSL.y))
                        {
                            temp.lock = false;
                            temp.locked = false;
                        }
                    }
                }
            });
        }
        this.H = this.add.image(this.HiXY[0], this.HiXY[1], "VOID").setOrigin(0);
        this.H.setDisplaySize(this.HiXY[2], this.HiXY[3]);
        this.H.setInteractive();
        this.H.on("pointerdown", (pointer) => {
            console.log("Hinting in " + stopping);
            if (stopping == false)
            {
                let izFindToHint = false;
                for (let i = 0; i < Math.pow(this.areaSize, 2); i++)
                {
                    if (!this.pazles[i].locked && this.extracted.includes(this.pazles[i].number))
                    {
                        izFindToHint = true;
                        this.hintUse = true;
                        let x = (this.pazles[i].number - 1) % this.areaSize + 1;
                        let y = Math.ceil(this.pazles[i].number / this.areaSize);
                        console.log("this.FPP[0]:" + this.FPP[0] + " this.FPP[1]:" + this.FPP[1] + " X:" + x + " Y:" + y + " = " + Math.floor(this.pazles[i].number / this.areaSize) * this.areaSize);
                        this.tweens.add({
                            targets: this.pazles[i],
                            x: this.FPP[0] + (x-1) * this.pazleSize * (this.corrector),
                            y: this.FPP[1] + (y-1) * this.pazleSize * (this.corrector),
                            duration: 200,
                            ease: 'Linear',
                        });
                        this.pazles[i].locked = true;
                        break;
                    }
                }
                if (!izFindToHint && this.hintProgress == false)
                {
                    for (let i = 0; i < Math.pow(this.areaSize, 2); i++)
                    {
                        if (!this.pazles[i].locked && !this.extracted.includes(this.pazles[i].number))
                        {
                            this.pazles[i].locked = true;
                            if (!this.pazles[i].scaled)
                                {
                                    this.extracted.push(this.pazles[i].number);
                                    console.log(this.pazleSize + "; " + this.tray + "; = " + this.pazleSize / this.tray);
                                    this.tweens.add({
                                        targets: this.pazles[i],
                                        scaleX: 0.5 * this.pazleSize / this.tray,
                                        scaleY: 0.5 * this.pazleSize / this.tray,
                                        duration: 200,
                                        ease: 'Linear',
                                    });
                                    this.pazles[i].scaled = true;
                                    let pos = -1;
                                    for (let i = 0; i < Math.pow(this.areaSize, 2); i++) {
                                        console.log("X");
                                        if (this.pazles[i].number == this.pazles[i].number) {
                                            pos = i;
                                            break;
                                        }
                                    }
                                    if ((pos === -1)) {
                                        return;
                                    }
                                    for (let j = pos + 1; j < Math.pow(this.areaSize, 2); j++) {
                                        console.log("J: " + j + " pos: " + pos);
                                        if (!this.extracted.includes(this.pazles[j].number))
                                        {
                                            this.tweens.add({
                                                targets: this.pazles[j],
                                                x: this.pazles[j].pos[0] - this.tray - 5,
                                                duration: 200,
                                                ease: 'Linear',
                                                onComplete: function(tween, targets) {
                                                    stopping = false;
                                                },
                                                onCompleteScope: this
                                            });
                                            this.pazles[j].pos[0] = this.pazles[j].pos[0] - this.tray - 5;
                                        }
                                    }
                                }
                            this.hintUse = true;
                            let x = (this.pazles[i].number - 1) % this.areaSize + 1;
                            let y = Math.ceil(this.pazles[i].number / this.areaSize);
                            console.log("this.FPP[0]:" + this.FPP[0] + " this.FPP[1]:" + this.FPP[1] + " X:" + x + " Y:" + y + " = " + Math.floor(this.pazles[i].number / this.areaSize) * this.areaSize);
                            this.tweens.add({
                                targets: this.pazles[i],
                                x: this.FPP[0] + (x-1) * this.pazleSize * (this.corrector),
                                y: this.FPP[1] + (y-1) * this.pazleSize * (this.corrector),
                                duration: 200,
                                ease: 'Linear',
                            });
                            this.pazles[i].locked = true;
                            break;
                        }
                    }
                }
            }
        });
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
        //this.load.image("GUI", "image/BG.svg", { width: 419, height: 613 });
        this.load.image("VOID", "image/VOID.png");
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
