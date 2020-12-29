let grid = [];
let particles = [];
let size = -1;
let dim = -1;
let noiseX = -1;
let noiseY = -1;
let noiseChange = 0.02;
let cSlider;

function setup(){
    createCanvas(2000,2000);
    background(255);
    colorMode(HSB,100);
    dim = 100;
    size = width / dim;
    noiseX = random(100);
    noiseY = random(100) + 100000;
    for(let row = 0; row < dim; row++){
        let row = [];
        for(let col = 0; col < dim; col++){
            row.push(map(noise(0.2 * noiseX, 0.2 * noiseY), 0, 1, 0, 2 * PI));
            noiseX += noiseChange;
        }
        grid.push(row);
        noiseY += noiseChange;
    }

    for(let num = 0; num < 250; num++){
        particles.push(createPoint());
    }

    cSlider = createSlider(0, 100, 0);
    cSlider.position(width - 200, height - 100);

}

function newNoise(){
    
}

function draw(){
    
    for(let p of particles){
        // Update according to grid information...
        let xMin = 0;
        let xMax = width;
        let yMin = 0;
        let yMax = height;
        // Check bounds...
        if(p.x > xMin && p.x < xMax && p.y > yMin && p.y < yMax){
            let cRow = Math.floor(p.y / dim);
            let cCol = Math.floor(p.x / dim);
            let changeDX = cos(grid[cRow][cCol]);
            let changeDY = sin(grid[cRow][cCol]);
            p.update(changeDX, changeDY, grid[cRow][cCol]);
        }
    }

    for(let p of particles){
        p.show();
    }
}

function keyPressed(){
    if(isLooping()){
        noLoop();
    }else{
        loop();
    }
}

function createPoint(){
    return {
        x : random(width),
        y : random(height),
        dx : random(4) - 8,
        dy : random(4) - 8,
        vector : -1,
        update: function(cVX, cVY, arrow){
            this.dx += 0.25 * cVX;
            this.dy += 0.25 * cVY;
            this.vector = arrow;
            this.x += this.dx;
            this.y = (this.y + this.dy) % height;
            if(this.x < 0){
                this.x = width - 1;
                this.y = random(height);
                this.dx = random(4) - 8;
                this.dy = random(4) - 8;
            }
            if(this.x > width){
                this.x = 1;
                this.y = random(height);
                this.dx = random(4) - 8;
                this.dy = random(4) - 8;
            }
        },
        show: function(){
            let hue = cSlider.value();
            // let hue = map(this.vector, 0, 2 * PI, 50, 100);
            // let sat = map(sqrt(pow(this.dx, 2) + pow(this.dy, 2)), 0, sqrt(2), 0, 100);
            let sat = 100;
            smooth();
            fill(hue, sat, 50);
            stroke(hue, sat, 50);
            ellipse(this.x, this.y, 1, 1);

            line(this.x, this.y, this.x - this.dx, this.y - this.dy);
        }
    }
}