import { useState, useEffect } from "react";

const AnimatedText = ({
  texts,
  delay,
  isInfinite,
}: {
  texts: string[];
  delay: number;
  isInfinite: boolean;
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [i, setI] = useState(0);

  let text = texts[i];

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    if (currentIndex <= text.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
    } else if (isInfinite) {
      setCurrentIndex(0);
      setCurrentText("");
      if (i == texts.length - 1) {
        setI(0);
      } else {
        setI(i + 1);
      }
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [currentIndex, delay, isInfinite, text]);

  return <span>{currentText}|</span>;
};

export default AnimatedText;
