import "./styles/style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";
import { gsap } from "gsap";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { MathUtils } from "three";
import { Vector3 } from "three";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const gltfLoader = new GLTFLoader();
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(
  10,
  sizes.width / sizes.height,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance",
});

const effect = new OutlineEffect(renderer, {
  defaultThickness: 0.00085,
  defaultColor: [0, 0, 0],
  defaultAlpha: 0.5,
  defaultKeepAlive: true,
  defaultVisible: true,
});

const fixedYPosition = 0;
const controls = new OrbitControls(camera, canvas);
const minPan = new THREE.Vector3(-1, -1, -1);
const maxPan = new THREE.Vector3(1, 1, 1);
const clock = new THREE.Clock(),
  clockFF = new THREE.Clock();
let vampireMixer, vampireAnimations;
let animations,
  animation01,
  animation02,
  animation03,
  mixer04,
  mixer01,
  mixer02,
  mixer03,
  stake,
  isPlaying01 = false,
  isPlaying02 = false,
  candleISO,
  coffinMarker = null,
  isCoffinClickable = false,
  isDragging = false,
  isStakeRisen = false,
  stakeMesh = null,
  isStakeHovered = false,
  isCoffinMarkerVisible = false,
  dragControls = null,
  vampire2,
  chart,
  chestMarker = null;

const getCamera = () => {
  camera.position.x = 80;
  camera.position.y = 50;
  camera.position.z = 80;
  scene.add(camera);
};

const getRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
};

const getControls = () => {
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.minDistance = 50;
  controls.maxDistance = 180;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minAzimuthAngle = -Math.PI * 0.1;
  controls.maxAzimuthAngle = Math.PI * 0.5;
};
const sky = new Sky();
sky.scale.setScalar(450000); // Sky dome size

// Adjust the sun's position to simulate a night scene
const phi = MathUtils.degToRad(180); // Sun below horizon (for night)
const theta = MathUtils.degToRad(0); // Position for midnight (straight down)
const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

sky.material.uniforms.sunPosition.value = sunPosition;

// Adjust the atmosphere for a dark night sky
sky.material.uniforms.turbidity.value = 1; // Low turbidity for clear sky
sky.material.uniforms.rayleigh.value = 0.05; // Low Rayleigh scattering for less atmospheric effect
sky.material.uniforms.mieCoefficient.value = 0.0001; // Low Mie scattering for smoother sky
sky.material.uniforms.mieDirectionalG.value = 0.3; // Atmospheric haze

scene.add(sky);

// Set the background color to a dark midnight blue
renderer.setClearColor(new THREE.Color(0x0a0a23)); // Dark midnight blue

const getLights = () => {
  // scene.add(new THREE.AmbientLight(0xffffff, .025))
  scene.add(new THREE.AmbientLight(0x4b2e2a, 0.12));

  const window1 = new THREE.PointLight(0xffffff, 4, 5);
  window1.position.set(-5.5, 4, -5);
  scene.add(window1);

  const window2 = new THREE.PointLight(0xffffff, 4, 5);
  window2.position.set(-8, 4, -2);
  scene.add(window2);

  const window3 = new THREE.PointLight(0xffffff, 2, 4);
  window3.position.set(6, 4, -5);
  scene.add(window3);

  const lgBottom = new THREE.PointLight(0xff0000, 5, 8, 2);
  lgBottom.position.set(0, -6, -2);
  scene.add(lgBottom);

  const lgChest = new THREE.PointLight(0xe9c46a, 2, 2);
  lgChest.position.set(0, -6.5, 1);
  scene.add(lgChest);

  const lgCandelabra01 = new THREE.PointLight(0xffffff, 1, 5, 2);
  lgCandelabra01.position.set(6, -3, -4.5);
  scene.add(lgCandelabra01);

  const lgCandelabra02 = new THREE.PointLight(0xffffff, 2, 5, 2);
  lgCandelabra02.position.set(6.5, 3.5, 0);
  scene.add(lgCandelabra02);

  const lgCandelabra04 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra04.position.set(-7, -6, 4);
  scene.add(lgCandelabra04);

  const lgCandelabra05 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra05.position.set(-7, -4, 2);
  scene.add(lgCandelabra05);

  const lgCandelabra06 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra06.position.set(-7, -2, 0);
  scene.add(lgCandelabra06);

  const lgCandelabra07 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra07.position.set(-7, 0, -2);
  scene.add(lgCandelabra07);

  const lgCandelabra08 = new THREE.PointLight(0xffffff, 2.5, 12, 3);
  lgCandelabra08.position.set(-1, 4, -4);
  scene.add(lgCandelabra08);

  const lgCandelabra09 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra09.position.set(-7, -2, 2);
  scene.add(lgCandelabra09);

  const lgCandelabra10 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra10.position.set(-7, 0, 0);
  scene.add(lgCandelabra10);

  const lgCandelabra11 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra11.position.set(-7, 2, -2);
  scene.add(lgCandelabra11);

  const lgFire01 = new THREE.PointLight(0xf4a261, 0.75, 5, 2);
  lgFire01.position.set(-2, -5.5, -4.5);
  scene.add(lgFire01);

  const lgFire02 = new THREE.PointLight(0xf4a261, 0.75, 5, 2);
  lgFire02.position.set(2, -5.5, -4.5);
  scene.add(lgFire02);

  const lgFire03 = new THREE.PointLight(0xf4a261, 2.5, 7, 2);
  lgFire03.position.set(5, 3.5, -4.5);
  scene.add(lgFire03);

  const lgFire04 = new THREE.PointLight(0xf4a261, 2.5, 4, 2);
  lgFire04.position.set(-5, 2.5, -4.5);
  scene.add(lgFire04);

  const lgFire05 = new THREE.PointLight(0xf4a261, 2.5, 4, 2);
  lgFire05.position.set(-5, 2.5, 1);
  scene.add(lgFire05);

  const lgFire06 = new THREE.PointLight(0xf4a261, 1.45, 5, 2);
  lgFire06.position.set(0, -6, 3);
  scene.add(lgFire06);

  const lgFire07 = new THREE.PointLight(0xffffff, 0.5, 2, 1);
  lgFire07.position.set(6, -4.75, 4);
  scene.add(lgFire07);
};

const candleMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe9c46a,
  emissiveIntensity: 1,
});

const candleISOMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe63946,
  emissiveIntensity: 1,
});

const fireMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe36414,
  emissiveIntensity: 1,
});

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: 0xffe2d1,
  roughness: 0.35,
  metalness: 0.1,
});

const loader = new THREE.TextureLoader();
const heart = loader.load("heart.png");
const heartMaterial = new THREE.MeshStandardMaterial({
  map: heart,
  transparent: true,
});

const noise = loader.load("noise.jpg");
const noiseMaterial = new THREE.MeshStandardMaterial({
  map: noise,
  transparent: true,
});


const getModel = () => {
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.src =
    "https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room14/a50f65020e8781fc118b6626a3bd6044482dd478/static/video.mp4";
  video.play();
  video.setAttribute("crossorigin", "anonymous");

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.crossOrigin = "anonymous";

  const videoMaterial = new THREE.MeshStandardMaterial({
    map: videoTexture,
    side: THREE.FrontSide,
    toneMapped: false,
  });

  gltfLoader.load("room.glb", (gltf) => {
    gltf.scene.traverse((child) => {
      //    child.material = concreteMaterial
      child.material = noiseMaterial;
    });
    scene.add(gltf.scene);
    scene.add(camera);
  });

  gltfLoader.load("items.glb", (gltf) => {
   
    scene.add(gltf.scene);
  });

  gltfLoader.load("coffin.glb", (gltf) => {
    animations = gltf.animations;
    mixer01 = new THREE.AnimationMixer(gltf.scene);
    animation01 = mixer01.clipAction(animations[0]);
    scene.add(gltf.scene);
  });

  gltfLoader.load("chart.glb", (gltf) => {
    chart = gltf.scene;

    chart.scale.set(0.7, 0.7, 0.7); // Final size
    chart.position.set(0, 12, -10); // Coffin position
    // chart.rotation.set(0, Math.PI, 0);

    scene.add(chart);
  });

  // Load vampire2 separately outside the vampire loader
  gltfLoader.load("vampire2.glb", (gltf) => {
    vampire2 = gltf.scene;

    vampire2.scale.set(100, 100, 100); // Final size
    vampire2.position.set(4, -26.3, 2); // Coffin position
    vampire2.rotation.set(0, Math.PI, 0); // Adjust rotation to match
    vampire2.visible = false; // Initially hidden

    scene.add(vampire2); // Add vampire2 to the scene
  });

  // Then in the Yes button handler
  const handleYesButton = () => {
    vampire.visible = false; // Hide the original vampire
    vampire2.visible = true; // Show the hurt vampire
  };
  gltfLoader.load(
    "vampire.glb",
    (gltf) => {
      const vampire = gltf.scene;
      vampireAnimations = gltf.animations;

      vampire.scale.set(1.1, 1.1, 1.1);
      vampire.position.set(0.2, -6.0, -11.1);
      vampire.rotation.set(0, Math.PI, 0);

      vampireMixer = new THREE.AnimationMixer(vampire);

      // Helper function to remove the first keyframe from each track
      const removeFirstKeyframe = (clip) => {
        clip.tracks.forEach((track) => {
          track.times = track.times.slice(1);
          track.values = track.values.slice(track.getValueSize());
        });
        clip.resetDuration();
      };

      const idleClip = vampireAnimations.find((anim) => anim.name === "idle");
      const walkClip = vampireAnimations.find((anim) => anim.name === "Walk");
      const attackClip = vampireAnimations.find(
        (anim) => anim.name === "attack"
      );

      if (!idleClip || !walkClip || !attackClip) {
        console.error("Error: Missing one or more animations.");
        return;
      }

      // Remove the first keyframe from each clip
      removeFirstKeyframe(idleClip);
      removeFirstKeyframe(walkClip);
      removeFirstKeyframe(attackClip);

      const idleAction = vampireMixer.clipAction(idleClip);
      const walkAction = vampireMixer.clipAction(walkClip);
      const attackAction = vampireMixer.clipAction(attackClip);

      attackAction.setLoop(THREE.LoopRepeat, 2);
      attackAction.clampWhenFinished = true;

      // Play the base idle animation first
      idleAction.play();

      // Function to smoothly switch animations
      const switchAnimation = (fromClip, toClip) => {
        console.log("Switching animation:", { fromClip, toClip });
        fromClip.fadeOut(1); // Fade out the current clip
        toClip.reset().fadeIn(1).play(); // Fade in the new clip
      };

      // Move vampire forward and slightly down during Walk animation
      const moveVampireForwardAndDown = () => {
        const moveSpeed = 0.02; // Adjust for forward movement speed
        const downSpeed = 0.003; // Adjust for downward movement speed
        const intervalId = setInterval(() => {
          vampire.position.z += moveSpeed; // Move forward
          vampire.position.y -= downSpeed; // Move slightly down

          // Stop the movement when the vampire has moved a certain distance
          if (vampire.position.z >= -8.2) {
            clearInterval(intervalId); // Stop moving forward
            switchAnimation(walkAction, attackAction); // Start the attack animation
          }
        }, 16); // Runs approximately every frame (60fps)
      };

      // Function to handle No button click
      const handleNoButton = () => {
        console.log("No button was clicked"); // Ensure this gets logged

        // Remove the popup
        const popupBox = document.getElementById("popupBox");
        if (popupBox) {
          popupBox.remove();
        }

        // Switch animation and move the vampire after a delay
        setTimeout(() => {
          console.log("Switching vampire animation"); // Log the animation switch
          switchAnimation(idleAction, walkAction);
          moveVampireForwardAndDown();
        }, 1000); // Adjust the delay for testing
      };

      // Event listener for when the animation finishes
      vampireMixer.addEventListener("finished", () => {
        console.log("Vampire attack complete");
        fadeToRedAndShowDeathMessage(); // Show the death message and red overlay
      });

      // Function to fade the screen to red and show the death message
      const fadeToRedAndShowDeathMessage = () => {
        const deathOverlay = document.getElementById("deathOverlay");
        const deathTextBox = document.getElementById("deathTextBox");

        // Show the red overlay with a fade-in effect
        deathOverlay.style.display = "block";
        gsap.to(deathOverlay, {
          opacity: 1,
          duration: 1,
          onComplete: () => {
            // After the fade-in, show the death message
            deathTextBox.style.display = "block";
            gsap.to(deathTextBox, { opacity: 1, duration: 1 }); // Fade in the text box
          },
        });
      };

      // Event listener to trigger animation on coffin click
      const onCoffinClick = (event) => {
        if (!isCoffinClickable) {
          console.log("Coffin is not clickable yet!");
          return; // Exit if the coffin is not clickable yet
        }

        const coords = new THREE.Vector2(
          (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
          -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
        );

        raycaster.setFromCamera(coords, camera);
        const intersections = raycaster.intersectObjects(scene.children, true);

        if (intersections.length > 0) {
          const selectedObject = intersections[0].object;

          if (
            selectedObject.name === "Plane001" ||
            selectedObject.name === "Plane001_1"
          ) {
            console.log("Coffin clicked! Opening it...");

            // Play the coffin opening animation
            if (animation01) {
              animation01.repetitions = 1;

              if (!isPlaying01) {
                mixer01.timeScale = 1;
                animation01.reset().play(); // Play the coffin opening animation
                isPlaying01 = true;
                animation01.clampWhenFinished = true;

                // Vampire in idle animation (if not already playing)
                if (vampireMixer) {
                  idleAction.play(); // Play the idle animation
                }

                // Show a pop-up box after 2 seconds
                setTimeout(() => {
                  showStakePopup(); // Call the function to display the new popup
                }, 2000); // Wait 2 seconds before showing the popup
              }
            }
          }
        }
      };
      const handleYesButton = () => {
        console.log("Yes button was clicked");

        const popupBox = document.getElementById("popupBox");
        if (popupBox) {
          popupBox.remove();
        }

        const vampireChestPosition = {
          x: vampire.position.x + 0.1, // Adjust to be slightly in front of vampire
          y: vampire.position.y + 2.2, // Adjust slightly higher to hit the chest
          z: vampire.position.z + 6.9, // Adjust z-axis to be slightly in front
        };
        gsap.to(stakeMesh.position, {
          duration: 1,
          x: vampireChestPosition.x,
          y: vampireChestPosition.y,
          z: vampireChestPosition.z,
          ease: "power1.inOut",
          onComplete: () => {
            console.log("Stake placed into the vampire's chest.");
            vampire.visible = false;

            loadVampireHurtModel(); // Call to load the hurt vampire
            vampire2.visible = true;
          },
        });
        gsap.to(stakeMesh.rotation, {
          duration: 1, // Adjust the duration as desired
          x: Math.PI / 4, // Rotate 90 degrees on the X axis
          y: Math.PI / 2, // Keep the Y axis the same or adjust as needed
          z: Math.PI / 4, // Rotate 45 degrees on the Z axis (adjust as needed)
          ease: "power2.inOut", // Easing function for smooth rotation
          onComplete: () => {
            console.log("Stake rotation completed.");
          },
        });
      };

      const loadVampireHurtModel = () => {
        if (!vampire2) {
          gltfLoader.load("vampire2.glb", (gltf) => {
            vampire2 = gltf.scene;
            vampire2.scale.set(100, 100, 100);
            vampire2.position.set(4, -26.3, 2);
            vampire2.rotation.set(0, Math.PI, 0);

            vampire2.visible = true; // Ensure it's visible
            scene.add(vampire2);
            console.log("Vampire in hurt pose loaded and displayed.");
          });
        } else {
          vampire2.visible = true;
          vampire2.position.set(4, -26.3, 2);
          console.log("Vampire in hurt pose displayed.");
        }
        // Remove the glow by resetting the emissive properties
        stakeMesh.material.emissive = new THREE.Color(0x000000); // Set emissive to black
        stakeMesh.material.emissiveIntensity = 0; // Set emissive intensity to 0 to remove glow
        console.log("Glow removed from stake.");
      };
      // Add event listener to trigger animation on click
      document.addEventListener("mousedown", onCoffinClick);

      // Add vampire to the scene
      scene.add(vampire);

      // Event listener for the No button click inside the vampire loader
      document.addEventListener("mousedown", (event) => {
        const noButton = event.target.closest("button");
        if (noButton && noButton.textContent === "No") {
          handleNoButton();
        }
      });
      document.addEventListener("mousedown", (event) => {
        const yesButton = event.target.closest("button");
        if (yesButton && yesButton.textContent === "Yes") {
          handleYesButton();
        }
      });
    },
    undefined,
    (error) => {
      console.error("An error occurred while loading the vampire:", error);
    }
  );
  gltfLoader.load("chest.glb", (gltf) => {
    animations = gltf.animations;
    mixer02 = new THREE.AnimationMixer(gltf.scene);
    animation02 = mixer02.clipAction(animations[0]);
    scene.add(gltf.scene);
  });

  gltfLoader.load("stake.glb", (gltf) => {
    stake = gltf.scene; // Assign the whole scene of the stake model
    scene.add(gltf.scene); // Add the model to the scene

    // Traverse the stake object to find the actual stake mesh
    stake.traverse((child) => {
      if (child.isMesh) {
        stakeMesh = child; // Assign the actual mesh to stakeMesh

        // Now initialize and set up drag controls after the stake mesh is ready
        dragControls = new DragControls(
          [stakeMesh],
          camera,
          renderer.domElement
        );
        setupDragControls(); // Call this function after initializing dragControls
      }
    });
  });
  gltfLoader.load("fire.glb", (gltf) => {
    // gltf.scene.traverse((child) => (child.material = fireMaterial));
    animations = gltf.animations
    console.log('--s', gltf)
    mixer04 = new THREE.AnimationMixer(gltf.scene)
    animations.forEach( clip => mixer04.clipAction(clip).play())
    scene.add(gltf.scene);
  });


 

  gltfLoader.load("maryGLB.glb", (gltf) => {
    gltf.scene.scale.set(3.5, 3.5, 3.5);
    gltf.scene.position.x = 5.5;
    gltf.scene.position.z = -6.5;
    gltf.scene.position.y = 2;
    gltf.scene.rotation.y = 0.5;
    scene.add(gltf.scene);
  });

  gltfLoader.load("heart.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = heartMaterial));
    scene.add(gltf.scene);
  });

  const video2 = document.createElement("video");
  video2.src = "./vortex.mp4"; // Path to your video file
  video2.muted = true;
  video2.loop = true;
  video2.play();

  const videoTexture2 = new THREE.VideoTexture(video2);

  gltfLoader.load("laptop.glb", (gltf) => {
    const laptop = gltf.scene;
    laptop.scale.set(0.05, 0.05, 0.05);
    laptop.position.set(0.25, 2.25, -4);

    laptop.traverse((child) => {
      if (child.isMesh && child.name === "Screen_ComputerScreen_0") {
        // Apply the video texture to the laptop screen
        child.material = new THREE.MeshBasicMaterial({ map: videoTexture2 });
      }
    });

    scene.add(laptop);
  });

  gltfLoader.load("chair.glb", (gltf) => {
    const chair = gltf.scene;
    chair.scale.set(0.41, 0.41, 0.41);
    chair.position.z = -1.5;
    chair.position.x = 1;
    chair.rotation.y = Math.PI / 4; // Rotate 45 degrees

    // Traverse through the chair parts and change their material colors
    chair.traverse((child) => {
      if (child.isMesh) {
        switch (child.name) {
          case "Object_4": // Change the color of part 1
            child.material.color.set(0xff0000); // Red color
            break;
          case "Object_5": // Change the color of part 2
            child.material.color.set(0xff0000);
            break;
          case "Object_6": // Change the color of part 3
            child.material.color.set(0x000000); // Blue color
            break;
          default:
            break;
        }
      }
    });

    scene.add(chair);
  });

  gltfLoader.load("candle.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = candleMaterial));
    scene.add(gltf.scene);
  });

  gltfLoader.load("candleISO.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = candleISOMaterial));
    candleISO = gltf.scene;
    scene.add(gltf.scene);
    gltf.scene.position.y = -1000;
  });

  gltfLoader.load("screen01.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen02.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen03.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen04.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen05.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen06.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
};

// Hovering function with smooth up-and-down animation
const animateHover = (riseHeight, hoverHeight, hoverDuration) => {
  gsap.to(stakeMesh.position, {
    y: riseHeight + hoverHeight,
    duration: hoverDuration,
    // repeat: -1, // Infinite repeat for continuous hovering
    // yoyo: true, // Smooth back-and-forth movement
    ease: "none", // Constant ease for smooth animation
  });
};

// Spin animation
const animateSpin = () => {
  gsap.to(stakeMesh.rotation, {
    // rotate: 3, // 360 degrees in radians
    duration: 3, // Duration for one full rotation
    repeat: -1, // Infinite repeat
    ease: "none", // Constant ease for smooth spinning
  });
};

// Function to initialize drag controls for the stake
const setupDragControls = () => {
  dragControls.addEventListener("dragstart", (event) => {
    console.log("Drag started on the stake");
    isDragging = true;
    controls.enabled = false; // Disable OrbitControls while dragging
    gsap.killTweensOf(stakeMesh.position); // Stop hover animation
    gsap.killTweensOf(stakeMesh.rotation); // Stop spin animation

    // Ensure stakeMesh is valid before proceeding
    if (stakeMesh && isStakeHovered && !isCoffinMarkerVisible) {
      isCoffinMarkerVisible = true; // Prevent creating the marker multiple times
      setTimeout(() => {
        console.log("Displaying coffin marker");
        createCoffinMarker(); // Create the coffin marker after the drag starts
      }, 500); // Add a slight delay for effect
    }
  });

  // Allow free movement in the X and Z directions but lock the Y axis
  dragControls.addEventListener("drag", (event) => {
    if (stakeMesh) {
      stakeMesh.position.x = event.object.position.x;
      stakeMesh.position.z = event.object.position.z;
    } else {
      console.warn("stakeMesh is undefined during drag event");
    }
  });

  // Event listener for when the drag ends
  dragControls.addEventListener("dragend", () => {
    console.log("Drag ended on the stake");
    isDragging = false;
    controls.enabled = true; // Re-enable OrbitControls after dragging

    // Restart hover and spin animations
    animateSpin();
  });
};
const createChestMarker = () => {
  if (chestMarker) return;

  // Create the main chest marker (black circle with 50% transparency)
  const markerGeometry = new THREE.CircleGeometry(0.2, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000, // Black color
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide, // Render both sides of the circle
  });
  chestMarker = new THREE.Mesh(markerGeometry, markerMaterial);
  chestMarker.name = "chestMarker";
  chestMarker.position.set(-1.3, -6, 2); // Adjust position as needed
  scene.add(chestMarker);

  // // Add a hitbox for easier click detection
  // const hitboxGeometry = new THREE.SphereGeometry(0.75, 16, 16);
  // const hitboxMaterial = new THREE.MeshBasicMaterial({
  //   transparent: true,
  //   opacity: 0, // Invisible hitbox
  // });
  // const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
  // chestMarker.add(hitbox);

  // Create a white border around the chest marker
  const borderGeometry = new THREE.CircleGeometry(0.25, 16);
  const borderMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, // White border
    side: THREE.DoubleSide,
  });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.position.set(0, 0, -0.01); // Slightly behind the marker
  chestMarker.add(border);

  // Create a canvas for the number
  const markerCanvas = document.createElement("canvas");
  const context = markerCanvas.getContext("2d");
  markerCanvas.width = 128; // Increase resolution for better clarity
  markerCanvas.height = 128;

  // Style the number
  context.font = "bold 60px Arial"; // Bigger font for clearer text
  context.fillStyle = "#ffffff"; // White text
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("1", markerCanvas.width / 2, markerCanvas.height / 2); // Center the number

  // Create texture from the canvas and add it to a sprite
  const texture = new THREE.CanvasTexture(markerCanvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const numberSprite = new THREE.Sprite(spriteMaterial);

  numberSprite.scale.set(0.5, 0.5, 1); // Adjust the scale to fit the marker
  numberSprite.position.set(0, 0, 0.01); // Place the number on top of the marker
  chestMarker.add(numberSprite);
};
// Function to handle clicking the chest marker
const onChestMarkerClick = (event) => {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length > 0) {
    let selectedObject = intersections.find(
      (intersect) => intersect.object.name === "chestMarker"
    );

    if (selectedObject && chestMarker) {
      console.log("Chest marker clicked!");

      // gsap.to(camera.position, {
      //   duration: 5,
      //   x: chestMarker.position.x + 0, // Check that chestMarker is not null before accessing position
      //   y: chestMarker.position.y - 100,
      //   z: chestMarker.position.z + 1,
      //   onUpdate: () => {
      //     if (chestMarker) {
      //       camera.lookAt(chestMarker.position);
      //       controls.update();
      //     } else {
      //       console.warn("chestMarker is no longer in the scene.");
      //     }
      //   },
      //   onComplete: () => {
      //     console.log("Camera zoomed in on the chest marker.");
      //   },
      // });


      gsap.timeline()
        .to(camera.position, {
          duration: 2,
          // x: chestMarker.position.x + 0, 
          x: chestMarker.position.x = 0,
          y: chestMarker.position.y - 2,
        })
        .to(camera.position,{
          duration: 2,
          y: chestMarker.position.y - 2,
          onUpdate: () => {
            if (chestMarker) {
              camera.lookAt(chestMarker.position);
              controls.update();
            } else {
              console.warn("chestMarker is no longer in the scene.");
            }
          },
          onComplete: () => {
            console.log("Camera zoomed in on the chest marker.");
          },
        })
      



      // Remove the chest marker from the scene after it is clicked
      scene.remove(chestMarker);
      chestMarker = null;
      showInstructionText("A locked chest? Open it to see what's inside."); // Show instruction text
    } else {
      console.log(
        "No chest marker found in the intersections or marker already removed."
      );
    }
  }
};

// Function to display a styled text box in the center of the screen
const showInstructionText = (text) => {
  let messageBox = document.getElementById("messageBox");

  // Check if the messageBox already exists, if not create it
  if (!messageBox) {
    messageBox = document.createElement("div");
    messageBox.id = "messageBox";
    document.body.appendChild(messageBox);

    // Apply styles to the messageBox
    messageBox.style.position = "fixed";
    messageBox.style.top = "50%";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translate(-50%, -50%)";
    messageBox.style.padding = "20px";
    messageBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
    messageBox.style.color = "#fff"; // White text
    messageBox.style.fontFamily = "Arial, sans-serif";
    messageBox.style.fontSize = "18px";
    messageBox.style.textAlign = "center";
    messageBox.style.border = "2px solid white"; // White border
    messageBox.style.borderRadius = "10px";
    messageBox.style.maxWidth = "80%";
    messageBox.style.zIndex = "1000"; // Make sure it's on top of other elements
  }

  // Set the text and show the message box
  messageBox.innerHTML = text;

  // Automatically hide the message box after 5 seconds
  setTimeout(() => {
    messageBox.remove();
  }, 5000); // Adjust the timeout value as needed
};

const createCoffinMarker = () => {
  if (coffinMarker) return;

  const markerGeometry = new THREE.CircleGeometry(0.2, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000, // Black color
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide, // Render both sides of the circle
  });

  // Create the coffin marker
  coffinMarker = new THREE.Mesh(markerGeometry, markerMaterial);
  coffinMarker.name = "coffinMarker";
  coffinMarker.position.set(-1.5, -3, -4); // Position the marker near the coffin
  scene.add(coffinMarker);

  // Create a white border around the coffin marker
  const borderGeometry = new THREE.CircleGeometry(0.25, 16); // Slightly larger for border effect
  const borderMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, // White border color
    side: THREE.DoubleSide,
  });

  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.position.set(0, 0, 0); // Set on the same plane as the marker
  coffinMarker.add(border);

  // Add number or text inside the marker
  const markerCanvas = document.createElement("canvas");
  const context = markerCanvas.getContext("2d");
  markerCanvas.width = 128;
  markerCanvas.height = 128;
  context.font = "bold 60px Arial";
  context.fillStyle = "#ffffff"; // White text color
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("2", markerCanvas.width / 2, markerCanvas.height / 2); // Number '2'

  const texture = new THREE.CanvasTexture(markerCanvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const numberSprite = new THREE.Sprite(spriteMaterial);

  numberSprite.scale.set(0.5, 0.5, 1);
  numberSprite.position.set(0, 0, 0.01); // Move the number slightly forward in Z-axis
  coffinMarker.add(numberSprite);
};

const onCoffinMarkerClick = (event) => {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;

    if (selectedObject.name === "coffinMarker") {
      console.log("Coffin marker clicked!");
      const coffin = scene.getObjectByName("Plane001"); // Assuming 'Plane001' is the coffin's name

      if (coffin) {
        // Zoom the camera towards the coffin
        gsap.to(camera.position, {
          duration: 2,
          x: coffin.position.x + 0, // Adjust the camera position relative to the coffin
          y: coffin.position.y + 0,
          // z: coffin.position.z + -2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (coffinMarker) {
              // Ensure coffinMarker still exists
              camera.lookAt(coffinMarker.position);
              controls.update();
            }
          },
          onComplete: () => {
            console.log("Camera zoomed in on the coffin.");
          },
        });
      } else {
        console.error("Coffin (Plane001) not found in the scene!");
      }

      // Show the new message "Open the coffin, if you dare."
      setTimeout(() => {
        showInstructionText("Do you dare open it?");

        // Set the flag to true, allowing the coffin to be opened
        isCoffinClickable = true;
        scene.remove(coffinMarker); // Remove the coffin marker from the scene
        coffinMarker = null; // Set it to null to avoid future reference
      }, 500); // Slight delay to match the camera zoom

      // Move the stake closer to the coffin
      if (stakeMesh) {
        gsap.to(stakeMesh.position, {
          x: coffinMarker?.position.x - 0,
          y: coffinMarker?.position.y - 1,
          z: coffinMarker?.position.z + 1,
          duration: 2,
          ease: "power1.out",
          onComplete: () => {
            console.log("Stake moved near the coffin.");
          },
        });
      }
    }
  }
};

const showStakePopup = () => {
  let popupBox = document.getElementById("popupBox");

  // Check if the popupBox already exists, if not create it
  if (!popupBox) {
    popupBox = document.createElement("div");
    popupBox.id = "popupBox";
    document.body.appendChild(popupBox);

    // Apply styles to the popupBox and initially hide it
    popupBox.style.position = "fixed";
    popupBox.style.top = "50%";
    popupBox.style.left = "50%";
    popupBox.style.transform = "translate(-50%, -50%)";
    popupBox.style.padding = "20px";
    popupBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
    popupBox.style.color = "#fff"; // White text
    popupBox.style.fontFamily = "Arial, sans-serif";
    popupBox.style.fontSize = "18px";
    popupBox.style.textAlign = "center";
    popupBox.style.border = "2px solid white"; // White border
    popupBox.style.borderRadius = "10px";
    popupBox.style.maxWidth = "80%";
    popupBox.style.zIndex = "1000"; // Ensure it's on top of other elements
    popupBox.style.visibility = "hidden"; // Initially hidden

    // Add the message and buttons with a 3-second delay
    setTimeout(() => {
      // Make the popupBox visible after delay
      popupBox.style.visibility = "visible";

      const message = document.createElement("p");
      message.textContent =
        "Do you want to stake your tokens to slay the vampire?";
      popupBox.appendChild(message);

      // Add the "Yes" button
      const yesButton = document.createElement("button");
      yesButton.textContent = "Yes";
      yesButton.style.margin = "10px";
      yesButton.style.padding = "10px";
      yesButton.style.backgroundColor = "#4CAF50";
      yesButton.style.color = "#fff";
      yesButton.style.border = "none";
      yesButton.style.borderRadius = "5px";
      yesButton.style.cursor = "pointer";

      yesButton.onclick = () => {
        console.log("User clicked Yes!");
        handleYesButton(); // Handle the action when user clicks "Yes"
        popupBox.remove(); // Remove the popup after clicking
      };
      popupBox.appendChild(yesButton);

      // Add the "No" button
      const noButton = document.createElement("button");
      noButton.textContent = "No";
      noButton.style.margin = "10px";
      noButton.style.padding = "10px";
      noButton.style.backgroundColor = "#f44336";
      noButton.style.color = "#fff";
      noButton.style.border = "none";
      noButton.style.borderRadius = "5px";
      noButton.style.cursor = "pointer";

      noButton.onclick = () => {
        console.log("User clicked No.");
        handleNoButton();
        popupBox.remove(); // Remove the popup after clicking
      };
      popupBox.appendChild(noButton);
    }, 3000); // 3-second delay for the message and buttons
  }
};

const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 10 },
  },
  vertexShader: document.getElementById("vertexshader").textContent,
  fragmentShader: document.getElementById("fragmentshader").textContent,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const getFireflies = () => {
  const firefliesGeometry = new THREE.BufferGeometry();
  const firefliesCount = 40;
  const positionArray = new Float32Array(firefliesCount * 3);
  const scaleArray = new Float32Array(firefliesCount * 1);

  for (let i = 0; i < firefliesCount; i++) {
    new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      1 + Math.random() * 2 * 2,
      -2 + (Math.random() - 0.5) * 8
    ).toArray(positionArray, i * 3);

    scaleArray[i] = Math.random();
    scaleArray[i] = Math.random();
  }

  firefliesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  firefliesGeometry.setAttribute(
    "aScale",
    new THREE.BufferAttribute(scaleArray, 1)
  );

  const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
  scene.add(fireflies);
};

getFireflies();

const onMouseDown = (event) => {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;

    if (selectedObject.name === "StakeBAse") {
      console.log("StakeBAse was clicked!");

      if (!isStakeRisen) {
        isStakeRisen = true; // Mark the stake as risen

        // Ensure the chest opens first
        if (!isPlaying02) {
          animation02.repetitions = 1; // Chest will open once
          mixer02.timeScale = 1; // Normal playback
          animation02.reset().play(); // Play the chest opening animation
          animation02.clampWhenFinished = true; // Keep the chest open
          isPlaying02 = true; // Prevent the chest from re-opening
        }

        // Remove the chest marker after the chest opens
        if (chestMarker) {
          scene.remove(chestMarker); // Remove the chest marker from the scene
          console.log("Chest marker removed.");
        }

        // Apply the glow effect to the stake before it rises
        stakeMesh.material.emissive = new THREE.Color(0xfdd017); // Yellow glow
        stakeMesh.material.emissiveIntensity = 1.5; // Increase the glow intensity

        // Animate the stake rise up
        gsap.to(stakeMesh.position, {
          y: stakeMesh.position.y + 2.5, // Rise above the chest
          duration: 2,
          ease: "power1.out",
          onComplete: () => {
            isStakeHovered = true; // Mark the stake as hovering
            animateHover(stakeMesh.position.y, 0.01, 2); // Hover animation
          },
        });
        // Show the instruction after a delay
        setTimeout(() => {
          showInstructionText(
            "A wooden stake might come in handy. Better grab it!"
          );
        }, 2000);

        // Initialize drag controls once the stake is hovering
        setupDragControls();
      }
    }

    // Check for CandleBase056 here inside the intersection block
    if (selectedObject.name == "CandleBase056") {
      scene.remove(selectedObject.parent);
    }

    console.log(`${selectedObject.name} was clicked!`);
  }
};

// The animate function
const animate = () => {
  requestAnimationFrame(animate);

  const elapsedTime = clockFF.getElapsedTime();
  let delta = clock.getDelta();
  controls.update();
  firefliesMaterial.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera);
  effect.render(scene, camera);

  if (mixer01) mixer01.update(delta);
  if (mixer02) mixer02.update(delta);
  if (mixer03) mixer03.update(delta);
  if (mixer04) mixer04.update(delta);
  if (vampireMixer) vampireMixer.update(delta);
};

// Resize listener
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();

window.addEventListener("mousemove", (e) => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;

  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mousedown", onChestMarkerClick);
document.addEventListener("mousedown", onCoffinMarkerClick);

// Call the function to create the chest marker when initializing the scene
createChestMarker();

window.addEventListener("dblclick", () => {
  if (!candleISO) {
    console.error("candleISO is not loaded yet!");
    return;
  }

  // Ignore clicks on the floor or specific objects like 'RoomFloor02'
  if (
    intersectionPoint &&
    intersectionPoint.object &&
    intersectionPoint.object.name === "RoomFloor02"
  ) {
    console.log("Ignoring clicks on the floor for candle placement.");
    return;
  }

  // Clone the candleISO model
  const clonedCandle = candleISO.clone();
  scene.add(clonedCandle);

  // Set its position using the intersection point of the raycaster
  const { x, z } = intersectionPoint;
  clonedCandle.position.set(x, 0.5, z); // Adjust height (y-axis) as needed, keep candles on the floor

  // Debug the position of the candle
  console.log("Candle added at position:", clonedCandle.position);

  // Optional: Add a scale factor for better visibility (if needed)
  clonedCandle.scale.set(1, 1, 1); // Adjust scale as needed

  // Optional: Add a bounding box for debugging
  const boundingBox = new THREE.BoxHelper(clonedCandle, 0xffff00); // Yellow bounding box for debugging
  scene.add(boundingBox);

  // Optional: Remove the candle after 2 seconds (uncomment if needed)
  // setTimeout(() => {
  //   clonedCandle.visible = false;
  //   console.log("Candle removed");
  // }, 2000);
});

getModel();
getRenderer();
getCamera();
getControls();
getLights();
animate();
