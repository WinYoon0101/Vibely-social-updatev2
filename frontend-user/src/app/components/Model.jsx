import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";

useGLTF.preload("/models/robot_playground.glb");

// Model robot trang chủ
export default function Model() {
    const group = useRef(null);
    const { scene, animations } = useGLTF("/models/robot_playground.glb");
    const { actions } = useAnimations(animations, group);
    const { camera, gl } = useThree();

    const [scale, setScale] = useState(1.7);
    const [position, setPosition] = useState([0, -1, 0]);

    useEffect(() => {
        if (actions && animations.length > 0) {
            actions[animations[0].name]?.play();
        }
    }, [actions, animations]);

    useGesture(
        {
            onWheel: ({ delta }) => {
                setScale((prev) => Math.min(Math.max(prev - delta[1] * 0.001, 0.5), 3));
            },
            onDrag: ({ offset: [x, y] }) => {
                setPosition([x * 0.01, -y * 0.01, 0]);
            }
        },
        { target: gl.domElement }
    );

    return (
        <>
            <OrbitControls />
            <group ref={group} scale={scale} position={position}>
                <primitive object={scene} />
            </group>
        </>
    );
}