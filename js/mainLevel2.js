import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Astronaut variables
var accelX = 0.3;
var accelY = 0.2;
var limitAstroX = 32.0;
var limitAstroY = 12.0;

//Randoms
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor() {
    return '#' + parseInt((Math.random() * 0xFFFFFF)).toString(16).padStart(6, '0');
}

function getRandomImages() {
    return parseInt((Math.random() * 3) + 1);
}

//Popup
const modal = document.querySelector("dialog");

function openPopup() {
    modal.showModal();
}

//Change of scene
function change() {
    if(document.getElementById("playAgain").onclick){
        window.location.href = "homePage.html"
    } else {
        //NECESSITA DE VERIFICAÇÃO (tratar depois)
        modal.close();
    }
}

//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

//Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Audio
const listener = new THREE.AudioListener();
camera.add(listener);

//Sound of the universe
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/universe.ogg', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.2);
    sound.play();
});

const listenerCollision = new THREE.AudioListener();
camera.add(listenerCollision);

//Sound when collision happens
const soundCollision = new THREE.Audio(listener);
const audioLoaderCollision = new THREE.AudioLoader();
audioLoaderCollision.load('sounds/bomb.mp3', function (bufferCollision) {
    soundCollision.setBuffer(bufferCollision);
});

//Creation of the astronaut 3D model
var astronaut;
const loader = new GLTFLoader();
loader.load('models/cosmonaut.glb', function (gltf) {
    astronaut = gltf.scene;
    astronaut.position.z = -20
    astronaut.scale.set(0.02, 0.02, 0.02);
    scene.add(gltf.scene);
},
    undefined, function (error) {
        console.error(error);
    }
);

//Creation of the explosion 3D model
var collision;
const loader2 = new GLTFLoader();
loader2.load('models/collision.glb', function (gltf) {
    collision = gltf.scene;
    collision.scale.set(30, 30, 30)
    scene.add(gltf.scene);
    collision.visible = false;
},
    undefined, function (error) {
        console.error(error);
    }
);

//Making the sphere for the astronaut 
const astroGeometry = new THREE.SphereGeometry(3, 7, 3);
const astroMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: false, opacity: 0.0, wireframe: true });
const astroSphere = new THREE.Mesh(astroGeometry, astroMaterial);
scene.add(astroSphere);

//Making the sky with stars
class sky {
    limitX = 32.0;
    limitY = 12.0;
    limitZ = 1.0;
    constructor(stars) {
        this.stars = stars;

        //Appear randomly
        this.stars.position.x = getRandomArbitrary(-this.limitX, this.limitX);
        this.stars.position.y = getRandomArbitrary(-this.limitY, this.limitY);
        this.stars.position.z = getRandomArbitrary(-this.limitZ, this.limitZ);
    }
}

//Creation the stars
var quantStars = [];
for (var i = 0; i < 100; i++) {
    const starGeometry = new THREE.OctahedronGeometry(0.1, 0);
    var paint = getRandomColor();
    const starMaterial = new THREE.MeshStandardMaterial({ color: paint, wireframe: false });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(star);

    const stars = new sky(star);
    quantStars.push(stars)
}

//Creation the moons
class simulable {
    limitX = 20;
    limitY = 10;
    limitZ = 1;
    constructor(moonFigures, velZ) {
        this.moonFigures = moonFigures;
        this.velX = 0;
        this.velY = 0;
        this.velZ = velZ;
        this.rotX = getRandomArbitrary(0.01, 0.02);
        this.rotY = getRandomArbitrary(0.01, 0.02);
        this.rotZ = getRandomArbitrary(0.01, 0.02);
        this.moonFigures.position.x = getRandomArbitrary(-this.limitX, this.limitX);
        this.moonFigures.position.y = getRandomArbitrary(-this.limitY, this.limitY);
        this.moonFigures.position.z = -this.limitZ;
    }

    simule() {
        this.moonFigures.rotation.x += this.rotX;
        this.moonFigures.rotation.y += this.rotY;
        this.moonFigures.rotation.z += this.rotZ;
        this.moonFigures.position.x += this.velX;
        this.moonFigures.position.y += this.velY;
        this.moonFigures.position.z -= this.velZ;


        //Events when collision is detected
        if (astroSphere != null && this.hitTarget()) {
            soundCollision.setVolume(1.5);
            soundCollision.play(true);
            //moonSphere.visible = false;
            collision.visible = true;
            astronaut.visible = false;
            collision.position.set(astronaut.position.x, astronaut.position.y, astronaut.position.z);
            setTimeout(() => {
                soundCollision.pause();
            }, "3500");

            openPopup();

        }
    }

    hitTarget() {
        var deltaX = this.moonFigures.position.x - astroSphere.position.x;
        var deltaY = this.moonFigures.position.y - astroSphere.position.y;
        var deltaZ = this.moonFigures.position.z - astroSphere.position.z;
        var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        return dist < 2;
        // var med = insert / 27
        // if(dist <= med){
        //     console.log(med)
        //     return med
        // } else {
        //     console.log(1)
        //     return 1
        // }

        //return dist < med;
    }
}

var objetos = [];
var quantRadius = [];

for (var i = 0; i < 27; i++) {
    const geometry = new THREE.SphereGeometry(getRandomArbitrary(0.1, 1), 60, 60);
    const moonTexture = new THREE.TextureLoader().load("../images/moon" + getRandomImages() + ".jpg");
    const material = new THREE.MeshBasicMaterial();
    material.map = moonTexture;
    const moonSphere = new THREE.Mesh(geometry, material);
    scene.add(moonSphere);

    var rad = moonSphere.geometry.parameters.radius;
    quantRadius.push(rad);
    console.log(rad);

    const obj1 = new simulable(moonSphere, getRandomArbitrary(0.01, 0.05));
    objetos.push(obj1);
}

var insert = 0;
for (let count = 0; count < quantRadius.length; count++) {
    insert = insert + rad;
}

//Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x0000ff, 1000, 5);
scene.add(pointLight);

camera.position.z = 20;

var animate = function () {
    requestAnimationFrame(animate);

    for (var i in objetos)
        objetos[i].simule();
    objetos[i].hitTarget();

    //Light on the astronaut
    pointLight.position.set(astroSphere.position.x, astroSphere.position.y, astroSphere.position.z);

    //Creating a gravity
    if (astronaut) {
        astronaut.position.x += 0.001;
        astronaut.position.y += 0.001;
        astronaut.position.z += 0.001;
    }

    //Making the astronaut spin
    if (astronaut && astroSphere) {
        astroSphere.position.x = astronaut.position.x;
        astroSphere.position.y = astronaut.position.y;
        astroSphere.position.z = astronaut.position.z;

        if (astronaut.position.x > limitAstroX || astronaut.position.x < -limitAstroX) {
            if (astronaut.position.x > 0) {
                astronaut.position.x = astronaut.position.x - 1.5;
            } else {
                astronaut.position.x = astronaut.position.x + 1.5;
            }
        }

        if (astronaut.position.y > limitAstroY || astronaut.position.y < -limitAstroY) {
            if (astronaut.position.y > 0) {
                astronaut.position.y = astronaut.position.y - 1.5;
            } else {
                astronaut.position.y = astronaut.position.y + 1.5;
            }
        }
    }

    renderer.render(scene, camera);
}

//User interaction
document.onkeydown = function (event) {
    if (event.key == "ArrowUp") {
        astronaut.position.y += accelY;
    }
    else if (event.key == "ArrowDown") {
        astronaut.position.y -= accelY;
    }
    else if (event.key == "ArrowRight") {
        astronaut.position.x += accelX;
    }
    else if (event.key == "ArrowLeft") {
        astronaut.position.x -= accelX;
    }
}

document.onkeyup = function (e) {
    console.log(e)
    if (e.key == "ArrowUp") {
        velY = 0
    }
    else if (e.key == "ArrowDown") {
        velY = 0
    }
    else if (e.key == "ArrowRight") {
        velX = 0
    }
    else if (e.key == "ArrowLeft") {
        velX = 0
    }
}

document.getElementById("playAgain").onclick = function () { change() }

animate();