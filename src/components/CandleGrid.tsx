import { useEffect, useRef } from "react";

function CandleGrid() {

  const canvasRef =
    useRef<HTMLCanvasElement>(
      null
    );

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const resize = () => {

      canvas.width =
        canvas.offsetWidth;

      canvas.height =
        canvas.offsetHeight;
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    const NODE_COUNT = 70;

    const nodes =
      Array.from(
        { length: NODE_COUNT },
        () => ({
          x:
            Math.random() *
            canvas.width,

          y:
            Math.random() *
            canvas.height
        })
      );

    let mouseX = -1000;
    let mouseY = -1000;

    const draw = () => {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      for (
        let i = 0;
        i < nodes.length;
        i++
      ) {

        for (
          let j = i + 1;
          j < nodes.length;
          j++
        ) {

          const dx =
            nodes[i].x -
            nodes[j].x;

          const dy =
            nodes[i].y -
            nodes[j].y;

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (
            distance < 140
          ) {

            ctx.strokeStyle =
              "rgba(255,170,60,0.08)";

            ctx.beginPath();

            ctx.moveTo(
              nodes[i].x,
              nodes[i].y
            );

            ctx.lineTo(
              nodes[j].x,
              nodes[j].y
            );

            ctx.stroke();
          }
        }
      }

      nodes.forEach(node => {

        const distance =
          Math.sqrt(

            Math.pow(
              node.x -
              mouseX,
              2
            )

            +

            Math.pow(
              node.y -
              mouseY,
              2
            )
          );

        const active =
          distance < 120;

        ctx.beginPath();

        ctx.arc(
          node.x,
          node.y,
          active ? 5 : 3,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          active

          ? "#ffb347"

          : "#444";

        ctx.fill();
      });

      requestAnimationFrame(
        draw
      );
    };

    draw();

    const moveHandler =
      (
        e: MouseEvent
      ) => {

        const rect =
          canvas.getBoundingClientRect();

        mouseX =
          e.clientX -
          rect.left;

        mouseY =
          e.clientY -
          rect.top;
      };

    canvas.addEventListener(
      "mousemove",
      moveHandler
    );

    return () => {

      canvas.removeEventListener(
        "mousemove",
        moveHandler
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };

  }, []);

  return (

    <canvas
      ref={canvasRef}
      className="
        w-full
        h-full
        bg-black
      "
    />

  );
}

export default CandleGrid;