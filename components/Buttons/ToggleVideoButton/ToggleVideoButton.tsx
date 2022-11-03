import React, { useCallback, useRef } from 'react';

import Button from '@mui/material/Button';
import VideoOffIcon from '../../twilioutils/icons/VideoOffIcon';
import VideoOnIcon from '../../twilioutils/icons/VideoOnIcon';

import useDevices from '../../twilioutils/hooks/useDevices/useDevices';
import useLocalVideoToggle from '../../twilioutils/hooks/useLocalVideoToggle/useLocalVideoToggle';

export default function ToggleVideoButton(props: { disabled?: boolean; className?: string }) {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const { hasVideoInputDevices } = useDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <Button
      className={props.className}
      onClick={toggleVideo}
      disabled={!hasVideoInputDevices || props.disabled}
      startIcon={isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
    >
      {!hasVideoInputDevices ? 'No Video' : isVideoEnabled ? 'Stop Video' : 'Start Video'}
    </Button>
  );
}
