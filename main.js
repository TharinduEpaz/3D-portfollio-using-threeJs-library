import './style.css'

import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import * as THREE from 'three';
import {assign, color, log} from "three/nodes";


const scene = new THREE.Scene();

//scene is like a container that holds all the objects, camera and lights
//perspective camera = human eyes
//perspective_Camera (field of view, aspect ratio , view frustum)

const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);

//renderer is used to render out the actual scene. It needs to know which DOM element

const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight); //make the canvas full screen

camera.position.setZ(30);

renderer.render(scene,camera); //renderer means draw

//--------------------  add object  -------------------------------

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({color:0xFF6347});
const torus = new THREE.Mesh(geometry,material);
scene.add(torus);

//add lighting

//point light works as a typical light bulb
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,20)

//ambient light lights up the entire scene
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight,ambientLight);

// add helpers for the lights
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200,50)
// scene.add(lightHelper,gridHelper);

//add orbit controls
const control = new OrbitControls(camera,renderer.domElement)

//add random starts to the scene
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25,24,24);
    const material  = new THREE.MeshStandardMaterial({color: 0xffffff});
    const star = new THREE.Mesh(geometry,material);

    const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

    star.position.set(x,y,z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

//add space texture
const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture;

//map my image into a cube texture

const tharinduTexture = new THREE.TextureLoader().load('./tharindu.jpeg');
const tharindu = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE .MeshBasicMaterial({map: tharinduTexture})
);

scene.add(tharindu)

//create a moon
const moonTexture = new THREE.TextureLoader().load('./moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./normal.jpg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3,32,32),
    new THREE.MeshStandardMaterial({
        map:moonTexture,
        normalMap:normalTexture
    })
)
scene.add(moon)

moon.position.z = 30;
moon.position.setX(-10)


//move the camera when scrolling

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    console.log(t)

    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    tharindu.rotation.y += 0.01;
    tharindu.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

//create a recursive function to animate like a infinite game loop
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;

    control.update()
}

animate();

