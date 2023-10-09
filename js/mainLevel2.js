import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Moon variables 
var angle = 0;

//Astronaut variables
var accelX = 0.3;
var accelY = 0.2;
var limitAstroX = 32.0;
var limitAstroY = 12.0;

//Randoms
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
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
    if (document.getElementById("playAgain").onclick) {
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

//Creation of the moon and change of material
const moonGeometry = new THREE.SphereGeometry(2, 60, 60);
const moonTexture = new THREE.TextureLoader().load("images/moon_map.jpg");
const moonMaterial = new THREE.MeshPhongMaterial();
moonMaterial.map = moonTexture;
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

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

//Making the sphere for the astronaut 
const astroGeometry = new THREE.SphereGeometry(3, 7, 3);
const astroMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: false, opacity: 0.0, wireframe: true });
const astroSphere = new THREE.Mesh(astroGeometry, astroMaterial);
scene.add(astroSphere);

//Making the sky with stars
const quantStars = [];
let n = 100;
let m = 100;

for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
        let s = i / (m - 15.0);
        let t = j / (n - 15.0);

        let x = (Math.random() * 100) * s - 50.0;
        let y = (Math.random() * 200) * t - 20.0;
        let z = -5;

        quantStars.push(new THREE.Vector3(x, y, z));
    }
}

const geometry = new THREE.BufferGeometry().setFromPoints(quantStars);
geometry.scale(2, 2, 8);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const stars = new THREE.Points(geometry, material);

scene.add(stars);

//Geisinha aqui
class simulable {
    limitX = 20;
    limitY = 10;
    limitZ = 20;
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
        this.moonFigures.position.z = this.limitZ;
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
            octah.visible = false;

            openPopup();

        }
    }

    //Collision
    hitTarget() {
        var deltaX = this.moonFigures.position.x - astroSphere.position.x;
        var deltaY = this.moonFigures.position.y - astroSphere.position.y;
        var deltaZ = this.moonFigures.position.z - astroSphere.position.z;
        var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        return dist < 4;
    }
}

var objetos = [];

for (var i = 0; i < 4; i++) {
    const geometryOctah = new THREE.OctahedronGeometry(1);
    const materialOctah = new THREE.MeshBasicMaterial({ color: "Oxb2bec3" });
    const octah = new THREE.Mesh(geometryOctah, materialOctah);
    scene.add(octah);

    const octahs = new simulable(octah, getRandomArbitrary(0.01, 0.05));
    objetos.push(octahs);
}

//Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(-1, 0, 0);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x0000ff, 1000, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x0000ff, 0.03);
scene.add(ambientLight);

camera.position.z = 20;

var animate = function () {
    requestAnimationFrame(animate);

    for (var i in objetos)
        objetos[i].simule();
    // /objetos[i].hitTarget();

    //Light on the astronaut
    pointLight.position.set(astroSphere.position.x, astroSphere.position.y, astroSphere.position.z);

    //Starting the moon on the left
    moon.position.x = -15 * (Math.cos(angle));
    moon.position.y = 6 * Math.sin(angle);

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