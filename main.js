import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Randoms
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor() {
    return '#' + parseInt((Math.random() * 0xFFFFFF)).toString(16).padStart(6, '0');
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

//Creation of the astronaut 3D model
var astronaut;
const loader = new GLTFLoader();
loader.load('models/cosmonaut.glb',
    function (gltf) {
        astronaut = gltf.scene;
        astronaut.position.set(0, -100, -1000);
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

//Making the sphere for the astronaut
const astroGeometry = new THREE.SphereGeometry(3.3, 2, 3);
const astroMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: false, opacity: 0.0, wireframe: true });
const astroSphere = new THREE.Mesh(astroGeometry, astroMaterial);
scene.add(astroSphere);

//Making the sky with stars
class sky {
    limiteX = 20.0;
    limiteY = 10.0;
    limiteZ = 1.0;
    constructor(stars) {
        this.stars = stars;

        //Appear randomly
        this.stars.position.x = getRandomArbitrary(-this.limiteX, this.limiteX);
        this.stars.position.y = getRandomArbitrary(-this.limiteY, this.limiteY);
        this.stars.position.z = getRandomArbitrary(-this.limiteZ, this.limiteZ);
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

//Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(-1, 0, 0);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 10000, 10000);
pointLight.position.set(150, 100, -900);
scene.add(pointLight);

//Camera position
camera.position.z = 20;

//Variables
var velX = 0.01;
var velY = 0.07;
var limitX = 10.0;
var limitY = 15.0;
var vel = 0.11;
var angle = 0;
var travel = 0;
var accel = getRandomArbitrary(0, 0.7);
var posicaoX = 0;
var posicaoY = -100;
var posicaoZ = -1000;

var animate = function () {
    requestAnimationFrame(animate);

    //Starting the moon on the left
    moon.position.x = -15 * (Math.cos(angle));
    moon.position.y = 6 * Math.sin(angle);

    //Limiting the area of the moon (arc)
    if (moon.position.x > limitX || moon.position.x < -limitX) {
        velX = -velX;
    }

    if (moon.position.y > limitY || moon.position.y < -limitY) {
        velY = -velY;
    }

    //Making the astronaut spin
    astronaut.rotation.x = travel + accel;
    astroSphere.rotation.x = astronaut.rotation.x;

    astronaut.rotation.y = travel + accel;
    astroSphere.rotation.y = astronaut.rotation.y;

    astronaut.rotation.z = travel + accel;
    astroSphere.rotation.z = astronaut.rotation.z;

    //astroSphere.position.x = posicaoX;

    renderer.render(scene, camera);
}

//User interaction
document.onkeydown = function (event) {
    console.log(event);
    if (event.key == "ArrowRight") {
        angle += vel;
    }

    if (event.key == ' ') {
        travel += accel;

        astronaut.position.x = accel;
        astronaut.position.y = accel;
        astronaut.position.z = -1000;


        astroSphere.position.x = astronaut.position.x;
        astroSphere.position.y = astronaut.position.y;
        astroSphere.position.z = -1000;

        astronaut.rotation.x = accel;
        astronaut.rotation.y = accel;
        astronaut.rotation.z = accel;
    
        astroSphere.rotation.x = astronaut.rotation.x;
        astroSphere.rotation.y = astronaut.rotation.y;
        astroSphere.rotation.z = astronaut.rotation.z;

        posicaoX = astronaut.position.x;
        posicaoY = astronaut.position.y;
        posicaoZ = astronaut.position.z;

        astroSphere.position.x = posicaoX;
        astroSphere.position.y = posicaoY;
        astroSphere.position.z = posicaoZ;
        
    }
}

document.onkeyup = function (event) {
    console.log(event);
    if (event.key == ' ') {
        travel += accel;
    }
}

animate();
