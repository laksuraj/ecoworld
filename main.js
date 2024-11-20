import { loadGLTF, loadVideo } from "./libs/loader.js";
import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    // Hide splash screen once everything is ready
    const splash = document.getElementById('splash');
    splash.style.display = 'none'; // Hide splash screen

    // Get the register button element
    const registerBtn = document.getElementById('register-btn');

    const mindarThree = new MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets/targets.mind',
    });
    const { renderer, scene, camera } = mindarThree;

    const video = await loadVideo("./Assets/videos/evohomes.mp4");
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      // Try to play video and ensure it works on all mobile browsers
      video.play().catch((error) => {
        console.error("Video autoplay failed", error);
        video.muted = true; // Mute the video to allow autoplay on some browsers
        video.play(); // Try again
      });
    };

    anchor.onTargetLost = () => {
      video.pause();
    };

    // Show the registration button after the video starts playing
    video.addEventListener('play', () => {
      video.currentTime = 6; // Start from the 6-second mark
      registerBtn.style.display = 'block'; // Show the registration button
    });

    // Optional: Handle button click (for example, open a registration form)
    registerBtn.addEventListener('click', () => {
      alert('Registration clicked!');
      // Here you could open a form, redirect to another page, etc.
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };
  start();
});
