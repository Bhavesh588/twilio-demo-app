import React from 'react';

import Button from '@mui/material/Button';
import MicIcon from '../../twilioutils/icons/MicIcon';
import MicOffIcon from '../../twilioutils/icons/MicOffIcon';

import useLocalAudioToggle from '../../twilioutils/hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../twilioutils/hooks/useVideoContext/useVideoContext';

export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <Button
      className={props.className}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!hasAudioTrack ? 'No Audio' : isAudioEnabled ? 'Mute' : 'Unmute'}
    </Button>
  );
}
