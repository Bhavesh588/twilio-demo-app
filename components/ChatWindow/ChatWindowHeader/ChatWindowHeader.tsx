import React from 'react';
import { createStyles } from '@mui/styles';
import { makeStyles } from '@mui/styles';
import CloseIcon from '../../twilioutils/icons/CloseIcon';

import useChatContext from '../../twilioutils/hooks/useChatContext/useChatContext';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '56px',
      background: '#F4F4F6',
      borderBottom: '1px solid #E4E7E9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1em',
    },
    text: {
      fontWeight: 'bold',
    },
    closeChatWindow: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
  })
);

export default function ChatWindowHeader() {
  const classes = useStyles();
  const { setIsChatWindowOpen } = useChatContext();

  return (
    <div className={classes.container}>
      <div className={classes.text}>Chat</div>
      <button className={classes.closeChatWindow} onClick={() => setIsChatWindowOpen(false)}>
        <CloseIcon />
      </button>
    </div>
  );
}
