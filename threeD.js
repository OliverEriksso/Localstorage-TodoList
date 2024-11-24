import * as THREE from "three";
import WebGL from 'three/addons/capabilities/WebGL.js'; //THIS IS INCASE SOMEONE OPENS THIS ON AN OLDER BROWSER, AS RECOMMENDED BY THREEJS

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvasbg")
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(1);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Slight ambient glow
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);

scene.add(pointLight, ambientLight, directionalLight);

const backgroundImg = new THREE.TextureLoader().load("./image.png");
scene.background = backgroundImg;

const allBoxes = [];

function addBox() {
    const geometry = new THREE.BoxGeometry(5,5,5);
    const material = new THREE.MeshStandardMaterial({color: 0xf7f7f7});
    const box = new THREE.Mesh(geometry, material);

    let validPos = false;
    while (!validPos) {
        const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(100));
        
        box.position.set(x, y, z);

        const minBoxDistance = 6;
        const boxesAreFarEnough = allBoxes.every(otherBox => {
            const distance = box.position.distanceTo(otherBox.position);
            return distance > minBoxDistance;
        });

        const minCameraDistance = 10;
        const cameraIsFarEnough = box.position.distanceTo(camera.position) > minCameraDistance;
        validPos = boxesAreFarEnough && cameraIsFarEnough;
    }

    scene.add(box);
    allBoxes.push(box);
}
Array(200).fill().forEach(addBox);

let isAnimating = true;

function animate() {
    if (isAnimating) {
        requestAnimationFrame(animate);
        allBoxes.forEach(box => {
            box.rotation.x += 0.01;
            box.rotation.y += 0.01;
            box.rotation.z += 0.01;
        })
        camera.rotation.x += 0.001;
        camera.rotation.y += 0.001;
        camera.rotation.z += 0.001;
        renderer.render(scene, camera)
    }
}

document.getElementById("disable-anim").addEventListener("change", () => {
    isAnimating = !isAnimating
    if (isAnimating) animate();
})

if ( WebGL.isWebGL2Available() ) { //THIS IS FROM THE TOP, SO OLDER BROWSERS GET A WARNING
	animate();
} else {
	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}