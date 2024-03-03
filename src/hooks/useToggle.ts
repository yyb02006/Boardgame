import { useState } from 'react';

export default function useToggle() {
  const [toggle, setToggle] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleHandler = (isSetTrue: boolean) => {
    if (isSetTrue) {
      setToggle(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setToggle(false);
      }, 300);
    }
  };
  return { toggle, isVisible, toggleHandler, setToggle, setIsVisible };
}
