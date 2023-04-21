
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Attempt to take a picture thru the webcam to be displayed in the gallery, if supported (i.e. if on chrome)
(async () => {
    const webcamContainer = document.querySelector('#webcam-photo-container');
    const webcamImg = document.querySelector('#webcam-photo');
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && typeof ImageCapture !== 'undefined') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            const videoTrack = stream.getVideoTracks()[0];
            await new Promise(r => setTimeout(r, 500));
            const capture = new ImageCapture(videoTrack);
            const photo = await capture.takePhoto();
            videoTrack.stop();
            const uri = URL.createObjectURL(photo);
            webcamImg.src = uri;
            webcamImg.style.maxWidth = '300px';
            webcamImg.style.transform = 'scaleX(-1)';
            webcamContainer.style.display = null;
        } catch (err) {
            // oh well.
        }
    }
})();

// 3D squirrel
(async () => {
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: document.querySelector('#thostu')
    });
    renderer.setSize(512, 400);
    const scene = new THREE.Scene;
    const camera = new THREE.PerspectiveCamera(60, 512/400, 0.1, 100);
    const [group, texture] = await Promise.all([
        new Promise((resolve, reject) => (new OBJLoader).load('res/squirrel.obj', resolve, () => {}, reject)),
        new Promise((resolve, reject) => (new THREE.TextureLoader).load('res/squirrel.png', resolve, () => {}, reject))
    ]);
    for (const child of group.children) child.material.map = texture;
    group.position.y = -1;
    group.scale.multiplyScalar(0.5);
    scene.add(group);
    scene.add(new THREE.DirectionalLight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    camera.position.z = 4;
    let prevTime = performance.now();
    while (true) {
        const now = performance.now();
        const dt = (now - prevTime) / 1000;
        prevTime = now;
        group.rotation.y += dt;
        renderer.render(scene, camera);
        await new Promise(requestAnimationFrame);
    }
})();
