import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { init } from "../renderer";

let pixelRatio = window.devicePixelRatio || 1.0;

function WgslCanvas(props: {
  vertWgsl: string;
  onError: (err: string) => void;
}) {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let [clickPosition, setClickPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  let rendererState = useRef(undefined);

  let render = async () => {
    console.info("rerender");

    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;

    rendererState.current = await init({ canvas });
  };

  let resizer = () => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;

    rendererState.current.resetGameData();
  };

  let debouncedRender = useDebouncedCallback(render, 100);
  let debouncedResizer = useDebouncedCallback(resizer, 100);
  // let debouncedRender = () => {};

  // useEffect(() => {
  //   debouncedRender();
  // }, [props.vertWgsl, clickPosition]);

  useEffect(() => {
    debouncedRender();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", debouncedResizer);
    return () => {
      window.removeEventListener("resize", debouncedResizer);
    };
  }, []);

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      onClick={(event) => {
        let w = window.innerWidth;
        let h = window.innerHeight;
        let center = { x: w / 2, y: h / 2 };
        let x = event.clientX;
        let y = event.clientY;
        let dx = x - center.x;
        let dy = center.y - y;
        console.log("click event", { x, y, w, h });
        setClickPos({ x: dx, y: dy });
      }}
    />
  );
}

export default WgslCanvas;
