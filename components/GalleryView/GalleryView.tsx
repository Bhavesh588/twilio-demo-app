import React from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import clsx from 'clsx';
import { GALLERY_VIEW_ASPECT_RATIO, GALLERY_VIEW_MARGIN } from '../twilioutils/constants';
import { IconButton, createStyles, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Pagination } from '@mui/material';
import Participant from '../Participant/Participant';
import useGalleryViewLayout from '../twilioutils/hooks/useGalleryViewLayout/useGalleryViewLayout';
import useVideoContext from '../twilioutils/hooks/useVideoContext/useVideoContext';
import useParticipantsContext from '../twilioutils/hooks/useParticipantsContext/useParticipantsContext';
import { usePagination } from './usePagination/usePagination';
import useDominantSpeaker from '../twilioutils/hooks/useDominantSpeaker/useDominantSpeaker';
import { useAppState } from '../twilioutils/state';

const CONTAINER_GUTTER = '50px';
const WIDTH_PART = '100%'
const HEIGHT_PART = '100%'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      background: theme.galleryViewBackgroundColor,
      position: 'relative',
      gridArea: '1 / 1 / 2 / 3',
    },
    participantContainer: {
      position: 'absolute',
      display: 'flex',
      top: CONTAINER_GUTTER,
      right: CONTAINER_GUTTER,
      bottom: CONTAINER_GUTTER,
      left: CONTAINER_GUTTER,
      margin: '0 auto',
      alignContent: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonContainerLeft: {
      right: `calc(100% - ${CONTAINER_GUTTER})`,
      left: 0,
    },
    buttonContainerRight: {
      right: 0,
      left: `calc(100% - ${CONTAINER_GUTTER})`,
    },
    pagination: {
      '& .MuiPaginationItem-root': {
        color: 'white',
      },
    },
    paginationButton: {
      color: 'black',
      background: 'rgba(255, 255, 255, 0.8)',
      width: '40px',
      height: '40px',
      '&:hover': {
        background: 'rgba(255, 255, 255)',
      },
    },
    paginationContainer: {
      position: 'absolute',
      top: `calc(100% - ${CONTAINER_GUTTER})`,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

export function GalleryView() {
  const classes = useStyles();
  const { maxGalleryViewParticipants } = useAppState();
  const { room } = useVideoContext();
  const { galleryViewParticipants } = useParticipantsContext();
  const dominantSpeaker = useDominantSpeaker(true);

  const { paginatedParticipants, setCurrentPage, currentPage, totalPages } = usePagination([
    room!.localParticipant,
    ...galleryViewParticipants,
  ]);
  
  const galleryViewLayoutParticipantCount =
    currentPage === 1 ? paginatedParticipants.length : maxGalleryViewParticipants;
  const { participantVideoWidth, containerRef } = useGalleryViewLayout(galleryViewLayoutParticipantCount);
  
  const participantWidth = `${participantVideoWidth}px`;
  const participantHeight = `${Math.floor(participantVideoWidth * GALLERY_VIEW_ASPECT_RATIO)}px`;
  // const participantWidth = `500px`;
  // const participantHeight = `300px`;

  return (
    <div className={classes.container}>
      <div className={clsx(classes.buttonContainer, classes.buttonContainerLeft)}>
        {/* {!(currentPage === 1) && (
          <IconButton className={classes.paginationButton} onClick={() => setCurrentPage(page => page - 1)}>
            <ArrowBack />
          </IconButton>
        )} */}
      </div>
      <div className={clsx(classes.buttonContainer, classes.buttonContainerRight)}>
        {/* {!(currentPage === totalPages) && (
          <IconButton className={classes.paginationButton} onClick={() => setCurrentPage(page => page + 1)}>
            <ArrowForward />
          </IconButton>
        )} */}
      </div>
      <div className={classes.paginationContainer}>
        {/* {totalPages > 1 && (
          <Pagination
            className={classes.pagination}
            page={currentPage}
            count={totalPages}
            onChange={(_, value) => setCurrentPage(value)}
            shape="rounded"
            color="primary"
            size="small"
            hidePrevButton
            hideNextButton
          />
        )} */}
      </div>
      {/* <div className={classes.participantContainer}>
        <div
          key={'Bhavesh'}
          style={{ width: WIDTH_PART, height: HEIGHT_PART, backgroundColor: 'blue', margin: 0, position: 'absolute', borderRadius: 15 }}
        >
        </div>
        <div
            key={'Harish'}
            style={{ width: 350, height: 200, margin: '10px 10px', backgroundColor: 'green', zIndex: 2, display: 'flex', alignItems: 'end', borderRadius: 15 }}
          >
        </div>
      </div> */}
      {/* <div className={classes.participantContainer} ref={containerRef}>
        {paginatedParticipants.map((participant, i) => (
          i === 0
          ? <div
            key={participant.sid}
            style={{ width: WIDTH_PART, height: HEIGHT_PART, margin: 0, position: 'absolute', borderRadius: 15 }}
          >
            <Participant
              participant={participant}
              isLocalParticipant={participant === room!.localParticipant}
              isDominantSpeaker={participant === dominantSpeaker}
            />
          </div>
          : <div
            key={participant.sid}
            style={{ width: 350, height: 200, margin: '10px 10px', zIndex: 2, display: 'flex', alignItems: 'end', borderRadius: 15 }}
          >
            <Participant
              participant={participant}
              isLocalParticipant={participant === room!.localParticipant}
              isDominantSpeaker={participant === dominantSpeaker}
            />
          </div>
        ))}
      </div> */}
      <div className={classes.participantContainer} ref={containerRef}>
        {paginatedParticipants.map(participant => (
          <div
            key={participant.sid}
            style={{ width: participantWidth, height: participantHeight, margin: GALLERY_VIEW_MARGIN }}
          >
            <Participant
              participant={participant}
              isLocalParticipant={participant === room!.localParticipant}
              isDominantSpeaker={participant === dominantSpeaker}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
