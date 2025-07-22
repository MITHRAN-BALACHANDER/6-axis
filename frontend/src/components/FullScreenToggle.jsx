import React, { useEffect, useState } from "react";

/**
 * This button toggles full screen mode for the targetRef element.
 * It also ensures that any inline height set by the browser during full screen is reset.
 */
const FullScreenToggleButton = ({ targetRef, className }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    const el = targetRef.current;
    if (!isFullScreen) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      const fsElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      const isFs = fsElement === targetRef.current;
      setIsFullScreen(isFs);

      // ---- THIS IS KEY: Reset any inline height after exit full screen ----
      if (!isFs && targetRef.current) {
        targetRef.current.style.height = "";
      }
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    document.addEventListener("mozfullscreenchange", handleFsChange);
    document.addEventListener("MSFullscreenChange", handleFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
      document.removeEventListener("mozfullscreenchange", handleFsChange);
      document.removeEventListener("MSFullscreenChange", handleFsChange);
    };
  }, [targetRef]);

  return (
    <button
      type="button"
      className={className}
      onClick={handleFullScreen}
      title={isFullScreen ? "Exit Full Screen" : "Show Full Screen"}
    >
      {isFullScreen ? "Exit Full Screen" : "Full Screen"}
    </button>
  );
};

export default FullScreenToggleButton;
