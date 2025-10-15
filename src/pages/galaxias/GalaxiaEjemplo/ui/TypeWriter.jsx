import { useState, useEffect } from 'react';

const useTypeWriter = (text, speed = 150) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false); // Nuevo estado

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // Cuando currentIndex >= text.length, el tipeo ha terminado
      setIsTypingComplete(true); // Actualizamos el estado
    }
  }, [text, speed, currentIndex]);

  // Retornamos el texto y el nuevo estado
  return { displayText, isTypingComplete }; 
};

export default useTypeWriter;