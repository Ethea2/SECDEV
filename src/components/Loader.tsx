import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useAnimate,
  Transition,
} from "framer-motion";

const NUM_BLOCKS = 5;
const BLOCK_SIZE = 32;
const DURATION_IN_MS = 175;
const DURATION_IN_SECS = DURATION_IN_MS * 0.001;

const TRANSITION: Transition = {
  ease: "easeInOut",
  duration: DURATION_IN_SECS,
};

const Loader = () => {
  const [blocks, setBlocks] = useState(
    Array.from(Array(NUM_BLOCKS).keys()).map((n) => ({ id: n }))
  );
  const [scope, animate] = useAnimate();
  const isMounted = useRef(true);

  useEffect(() => {
    shuffle();

    // Cleanup function to stop the animation loop
    return () => {
      isMounted.current = false;
    };
  }, []);

  const shuffle = async () => {
    while (isMounted.current) {
      try {
        const [first, second] = pickTwoRandom();

        animate(`[data-block-id="${first.id}"]`, { y: -BLOCK_SIZE }, TRANSITION);
        await animate(
          `[data-block-id="${second.id}"]`,
          { y: BLOCK_SIZE },
          TRANSITION
        );

        await delay(DURATION_IN_MS);

        setBlocks((pv) => {
          const copy = [...pv];
          const indexForFirst = copy.indexOf(first);
          const indexForSecond = copy.indexOf(second);
          copy[indexForFirst] = second;
          copy[indexForSecond] = first;
          return copy;
        });

        await delay(DURATION_IN_MS * 2);

        animate(`[data-block-id="${first.id}"]`, { y: 0 }, TRANSITION);
        await animate(`[data-block-id="${second.id}"]`, { y: 0 }, TRANSITION);

        await delay(DURATION_IN_MS);
      } catch (error) {
        // Component was unmounted, break the loop
        break;
      }
    }
  };

  const pickTwoRandom = () => {
    const index1 = Math.floor(Math.random() * blocks.length);
    let index2 = Math.floor(Math.random() * blocks.length);
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * blocks.length);
    }
    return [blocks[index1], blocks[index2]];
  };

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <div ref={scope} className="flex divide-x divide-neutral-950">
      {blocks.map((b) => {
        return (
          <motion.div
            layout
            data-block-id={b.id}
            key={b.id}
            transition={TRANSITION}
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
            }}
            className="bg-white"
          />
        );
      })}
    </div>
  );
};

export default Loader;
