import React from 'react';
import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import { createStyles } from '@mui/styles';
import { makeStyles } from '@mui/styles';

import { Button } from '@mui/material';

import useVideoContext from '../../twilioutils/hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Button onClick={() => room!.disconnect()} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Disconnect
    </Button>
  );
}
