// src/components/SideScene.tsx
import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";


import dragon from "../assets/lottie/Dragon.json";
import astronaut from "../assets/lottie/Astronaut.json";
import robot from "../assets/lottie/Robot.json";
import trophy from "../assets/lottie/Trophy.json";
import ninja from "../assets/lottie/Ninja.json";


const scenes = [
  { label: "🐉 dragão voando",       anim: dragon    },
  { label: "🧑‍🚀 astronauta flutuando", anim: astronaut },
  { label: "🤖 robô acenando",        anim: robot     },
  { label: "🏆 troféu brilhando",     anim: trophy    },
  { label: "🥷 ninja",         anim: ninja },
];

const SideScene = () => {
  const [scene] = useState(() => scenes[Math.floor(Math.random() * scenes.length)]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <span className="absolute top-2 right-2 bg-emerald-500/10 border-emerald-500/20 rounded-full px-3 py-0.5 text-xs text-emerald-400 z-10">
        {scene.label}
      </span>
      <Player
        autoplay
        loop
        src={scene.anim}
        style={{ width: "140px", height: "140px" }}
      />
    </div>
  );
};

export default SideScene;