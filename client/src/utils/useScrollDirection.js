import { useState, useEffect } from 'react';

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up"); 
  const [prevOffset, setPrevOffset] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false); 

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      
      
      setIsScrolled(currentOffset > 50);
      
      const direction = currentOffset > prevOffset ? "down" : "up";

      if (
        direction !== scrollDirection &&
        (currentOffset - prevOffset > 10 || currentOffset - prevOffset < -10)
      ) {
        setScrollDirection(direction);
      }

      setPrevOffset(currentOffset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDirection, prevOffset]);

  return { scrollDirection, isScrolled };
}

export default useScrollDirection;