const gameContainer = document.getElementById("game");
        const objects = [];
        const types = ["rock", "paper", "scissors"];
        const symbols = { rock: "🗿", paper: "📜", scissors: "✂️" };
        const targets = { rock: "scissors", scissors: "paper", paper: "rock" };
        
        

        
        function createObject() {
            const type = types[Math.floor(Math.random() * types.length)];
            const obj = document.createElement("div");
            obj.classList.add("object", type);
            obj.textContent = symbols[type];
            
            let x, y, validPosition;
            do {
                x = Math.random() * (gameContainer.clientWidth - 30);
                y = Math.random() * (gameContainer.clientHeight - 30);
                validPosition = objects.every(o => !isCollidingWithCoords(o.element, x, y));
            } while (!validPosition);
            
            obj.style.left = x + "px";
            obj.style.top = y + "px";
            gameContainer.appendChild(obj);
            objects.push({ element: obj, type, x, y});
        }

        function isCollidingWithCoords(el, x, y) {
            const rect = el.getBoundingClientRect();
            return !(rect.right < x || rect.left > x + 30 || rect.bottom < y || rect.top > y + 30);
        }
        
        function moveObjects() {
        objects.forEach(obj => {
            const target = objects
                .filter(o => o !== obj && o.type === targets[obj.type])
                .reduce((closest, o) => {
                    const distance = Math.hypot(o.x - obj.x, o.y - obj.y); 
                    return (!closest || distance < closest.distance) ? { object: o, distance } : closest;
                }, null)?.object;

            if (target) {
                let angle = Math.atan2(target.y - obj.y, target.x - obj.x);
                obj.dx = Math.cos(angle) * (Math.random() + 1);
                obj.dy = Math.sin(angle) * (Math.random() + 1);
            } else {
                obj.dx = (Math.random() - 0.5) * 2;
                obj.dy = (Math.random() - 0.5) * 2;
            }

            obj.x += obj.dx;
            obj.y += obj.dy;

            if (obj.x < 0 || obj.x > gameContainer.clientWidth - 30) obj.dx *= -1;
            if (obj.y < 0 || obj.y > gameContainer.clientHeight - 30) obj.dy *= -1;

            obj.element.style.left = obj.x + "px";
            obj.element.style.top = obj.y + "px";
        });

        checkCollisions();
    }


        function checkCollisions() {
            for (let i = 0; i < objects.length; i++) {
                for (let j = i + 1; j < objects.length; j++) {
                    const objA = objects[i];
                    const objB = objects[j];
                    if (isColliding(objA.element, objB.element)) {
                        verwandeln(objA, objB);
                    }
                }
            }
        }

        function isColliding(el1, el2) {
            const rect1 = el1.getBoundingClientRect();
            const rect2 = el2.getBoundingClientRect();
            return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
        }

        function verwandeln(objA, objB) {
            const rules = { rock: "scissors", scissors: "paper", paper: "rock" };
            if (rules[objA.type] === objB.type) {
                // Wenn objA gewinnt, ändern wir objB's Typ und stoßen sie ab
                objB.type = objA.type;
                objB.element.className = `object ${objA.type}`;
                if (objA.type === "rock") playSound("rock");
                if (objA.type === "scissors") playSound("scissors");
                if (objA.type === "paper") playSound("paper");
                objB.element.innerHTML = symbols[objA.type];
                repelObjects(objA, objB);
            } else if (rules[objB.type] === objA.type) {
                // Wenn objB gewinnt, ändern wir objA's Typ und stoßen sie ab
                objA.type = objB.type;
                objA.element.className = `object ${objB.type}`;
                if (objB.type === "rock") playSound("rock");
                if (objB.type === "scissors") playSound("scissors");
                if (objB.type === "paper") playSound("paper");
                objA.element.innerHTML = symbols[objB.type];
                repelObjects(objA, objB);
            }
        }

        function repelObjects(objA, objB) {
            // Berechnen, wie die Objekte sich abstoßen sollen
            const angle = Math.atan2(objB.y - objA.y, objB.x - objA.x);
            const repelSpeed = 10;
            objA.speedX += Math.cos(angle) * repelSpeed;
            objA.speedY += Math.sin(angle) * repelSpeed;
            objB.speedX -= Math.cos(angle) * repelSpeed;
            objB.speedY -= Math.sin(angle) * repelSpeed;
        }


        function playSound(type) {
            const audios = {
                rock: new Audio("stein.mp3"),
                scissors: new Audio("scissors.mp3"),
                paper: new Audio("papier.MP3")
            }

            const sound = new Audio(audios[type].src);

            sound.play();
        }


    

        //objekte spawnen
        document.getElementById("startButton").addEventListener("click", function() {
            this.style.display = "none"; // Button ausblenden
        
            for (let i = 0; i < 50; i++) createObject();

            setInterval(moveObjects, 50);
        });

