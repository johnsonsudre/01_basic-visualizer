import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js";

class App {
  constructor() {
    const container = document.createElement("div");
    document.body.appendChild(container);
    
    const aspectRatio = window.innerWidth/window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    this.camera.position.set(0,1.65,5);
    
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.scene.background = new THREE.Color(0xBBBBBB);
    
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(this.render.bind(this));

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {}

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
