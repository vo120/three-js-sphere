import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const ThreeSphere = () => {
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Create a scene
    const scene = new THREE.Scene();

    // Create the sphere
    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: "#646cff",
      roughness: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Creating Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 10);
    light.intensity = 2;
    scene.add(light);

    // Create a camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
    camera.position.z = 10;
    scene.add(camera);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 5;
    controlsRef.current = controls;

    // Adding a timeline
    const tl = gsap.timeline({ defaults: { duration: 1 } });
    tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }, "+=1");
    tl.fromTo("nav", { y: "-100%" }, { y: "0%" }, "-=1");
    tl.fromTo(".title", { opacity: 0 }, { opacity: 1 }, "-=1");

    // Mouse Animation
    let mouseDown = false,
      rgb = [];
    window.addEventListener("mousedown", () => {
      mouseDown = true;
    });
    window.addEventListener("mouseup", () => {
      mouseDown = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (mouseDown) {
        mesh.rotation.y = -e.clientX * 0.0001;
        mesh.rotation.x = -e.clientY * 0.0001;
        rgb = [
          Math.round((e.clientX / sizes.width) * 255),
          Math.round((e.clientY / sizes.height) * 255),
          150,
        ];
        // Animate color
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);

        gsap.to(mesh.material.color, {
          r: newColor.r,
          g: newColor.g,
          b: newColor.b,
          duration: 1,
        });
      }
    });

    // Animate the scene
    const animate = () => {
      requestAnimationFrame(animate);
      controlsRef.current.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize canvas on window resize
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      sizes.width = innerWidth;
      sizes.height = innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default ThreeSphere;
