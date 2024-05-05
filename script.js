$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // scroll-up button show/hide script
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // typing text animation script
    var typed = new Typed(".typing", {
        strings: ["an Engineer", "a Developer", "a Student"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    var typed = new Typed(".typing-2", {
        strings: ["an Engineer", "a Developer", "a Student"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
            1000:{
                items: 3,
                nav: false
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector('.message')) {
        swal("Thank you!", "Your message has been sent !", "success");
        }
    });


        class FlowField {
                settings = {
                    // Defaults:
                    frequency: 0.2,
                }

                constructor(w, h, settings = {}) {
                    this.settings = { ...this.settings, ...settings };
                    this.w = w || 10;
                    this.h = h || 10;
                    this.time = 0;

                    this.build();
                }

                build() {
                    this.cols = Math.ceil(this.w);
                    this.rows = Math.ceil(this.h);

                    // Prepare columns
                    this.field = new Array(this.cols);
                    for (let x = 0; x < this.cols; x++) {
                        // Prepare rows
                        this.field[x] = new Array(this.rows);
                        for (let y = 0; y < this.rows; y++) {
                            // Prepare data
                            this.field[x][y] = new Vector(0, 0);
                        }
                    }
                }

                update(delta) {
                    this.time += delta;

                    const updateTime = this.time * this.settings.frequency / 1000;
                    for (let x = 0; x < this.field.length; x++) {
                        for (let y = 0; y < this.field[x].length; y++) {
                            // Update field
                            const angle = noise.simplex3(x / 20, y / 20, updateTime) * Math.PI * 2;
                            const length = noise.simplex3(x / 10 + 40000, y / 10 + 40000, updateTime);
                            this.field[x][y].setAngle(angle);
                            this.field[x][y].setLength(length);

                            // Manipulate vector
                            if (typeof this.manipulateVector === 'function') {
                                this.manipulateVector(this.field[x][y], x, y);
                            }

                            // Render field
                            if (typeof this.onDraw === 'function') {
                                this.onDraw(this.field[x][y], x, y);
                            }
                        }
                    }
                }
            }

            const settings = {
                frequency: 0.1,
            }
            const tileSize = 40; // Pixel width of tiles
            const tileRatio = 2; // y/x ratio

            // Setup
            const canvas = document.getElementById('flowfield');
            const ctx = canvas.getContext('2d');
            const box = canvas.getBoundingClientRect();
            const container = canvas.parentElement;

            // Set up height to match full container size
            canvas.height = box.width * (container.clientHeight / container.clientWidth);
            canvas.width = box.width;

            // Flowfield setup
            const cols = Math.ceil(container.clientWidth / tileSize);
            const rows = Math.ceil(container.clientHeight / (tileSize * tileRatio));

            const ctxScale = {
                x: canvas.width / cols,
                y: canvas.height / rows,
            }
            const widthColorScaling = 255 / cols;
            const heightColorScaling = 255 / rows;

            // Mouse manip setup
            const mouse = new Vector(0, 0);

            // Init flowfield
            const ff = new FlowField(cols, rows, settings);

            // Custom draw function to display flowfield
            ff.onDraw = (vector, x, y) => {
                // Clear canvas
                if (x === 0 && y === 0) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                const xmove = vector.getLength() * Math.abs(vector.x);
                const ymove = vector.getLength() * Math.abs(vector.y);
                const red = Math.round((20 * xmove) + (230 * ymove) + 5 + (0.6 * y * heightColorScaling));
                const green = Math.round((100 * xmove) - (60 * ymove));
                const blue = Math.round((200 * xmove) + (60 * ymove) + (60 - (0.4 * y * heightColorScaling)));

                ctx.save();

                // Draw tile
                ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.8)`;
                ctx.fillRect(x * ctxScale.x, y * ctxScale.y, ctxScale.x, ctxScale.y);

                // Close
                ctx.restore();
            }

            // Custom added vector to add mouse interaction
            ff.manipulateVector = (vector, x, y) => {
                // Get root position of drawn element
                const pos = new Vector(
                    (x * ctxScale.x) + (0.5 * ctxScale.x),
                    (y * ctxScale.y) + (0.5 * ctxScale.y),
                );

                // Get the distance to mouse in from 0 to 1 (1+ actually if you go outside the canvas)
                const mouseEffect = new Vector(
                    (mouse.x - pos.x) / canvas.width,
                    (mouse.y - pos.y) / canvas.height,
                );

                vector.addTo(mouseEffect);
                // Cap to max 1
                if (vector.getLength() > 1) vector.setLength(1);
            }

            // Animate
            let lastStep = 0;
            function step(time) {
                ff.update(time - lastStep || 0);
                lastStep = time;
                window.requestAnimationFrame(step);
            }
            step();

            function updateMouse(e) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }
            document.addEventListener('mousemove', updateMouse);
    