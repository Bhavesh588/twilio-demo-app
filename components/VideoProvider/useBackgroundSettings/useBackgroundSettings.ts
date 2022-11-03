import { LocalVideoTrack, Room } from 'twilio-video';
import { useEffect, useCallback } from 'react';
import { SELECTED_BACKGROUND_SETTINGS_KEY } from '../../twilioutils/constants';
import {
  GaussianBlurBackgroundProcessor,
  VirtualBackgroundProcessor,
  ImageFit,
  isSupported,
} from '@twilio/video-processors';
import Abstract from '../../twilioutils/images/Abstract.jpg';
import AbstractThumb from '../../twilioutils/images/thumb/Abstract.jpg';
import BohoHome from '../../twilioutils/images/BohoHome.jpg';
import BohoHomeThumb from '../../twilioutils/images/thumb/BohoHome.jpg';
import Bookshelf from '../../twilioutils/images/Bookshelf.jpg';
import BookshelfThumb from '../../twilioutils/images/thumb/Bookshelf.jpg';
import CoffeeShop from '../../twilioutils/images/CoffeeShop.jpg';
import CoffeeShopThumb from '../../twilioutils/images/thumb/CoffeeShop.jpg';
import Contemporary from '../../twilioutils/images/Contemporary.jpg';
import ContemporaryThumb from '../../twilioutils/images/thumb/Contemporary.jpg';
import CozyHome from '../../twilioutils/images/CozyHome.jpg';
import CozyHomeThumb from '../../twilioutils/images/thumb/CozyHome.jpg';
import Desert from '../../twilioutils/images/Desert.jpg';
import DesertThumb from '../../twilioutils/images/thumb/Desert.jpg';
import Fishing from '../../twilioutils/images/Fishing.jpg';
import FishingThumb from '../../twilioutils/images/thumb/Fishing.jpg';
import Flower from '../../twilioutils/images/Flower.jpg';
import FlowerThumb from '../../twilioutils/images/thumb/Flower.jpg';
import Kitchen from '../../twilioutils/images/Kitchen.jpg';
import KitchenThumb from '../../twilioutils/images/thumb/Kitchen.jpg';
import ModernHome from '../../twilioutils/images/ModernHome.jpg';
import ModernHomeThumb from '../../twilioutils/images/thumb/ModernHome.jpg';
import Nature from '../../twilioutils/images/Nature.jpg';
import NatureThumb from '../../twilioutils/images/thumb/Nature.jpg';
import Ocean from '../../twilioutils/images/Ocean.jpg';
import OceanThumb from '../../twilioutils/images/thumb/Ocean.jpg';
import Patio from '../../twilioutils/images/Patio.jpg';
import PatioThumb from '../../twilioutils/images/thumb/Patio.jpg';
import Plant from '../../twilioutils/images/Plant.jpg';
import PlantThumb from '../../twilioutils/images/thumb/Plant.jpg';
import SanFrancisco from '../../twilioutils/images/SanFrancisco.jpg';
import SanFranciscoThumb from '../../twilioutils/images/thumb/SanFrancisco.jpg';
import { Thumbnail } from '../../BackgroundSelectionDialog/BackgroundThumbnail/BackgroundThumbnail';
import { useLocalStorageState } from '../../twilioutils/hooks/useLocalStorageState/useLocalStorageState';

export interface BackgroundSettings {
  type: Thumbnail;
  index?: number;
}

const imageNames: string[] = [
  'Abstract',
  'Boho Home',
  'Bookshelf',
  'Coffee Shop',
  'Contemporary',
  'Cozy Home',
  'Desert',
  'Fishing',
  'Flower',
  'Kitchen',
  'Modern Home',
  'Nature',
  'Ocean',
  'Patio',
  'Plant',
  'San Francisco',
];

const images = [
  AbstractThumb,
  BohoHomeThumb,
  BookshelfThumb,
  CoffeeShopThumb,
  ContemporaryThumb,
  CozyHomeThumb,
  DesertThumb,
  FishingThumb,
  FlowerThumb,
  KitchenThumb,
  ModernHomeThumb,
  NatureThumb,
  OceanThumb,
  PatioThumb,
  PlantThumb,
  SanFranciscoThumb,
];

const rawImagePaths = [
  Abstract,
  BohoHome,
  Bookshelf,
  CoffeeShop,
  Contemporary,
  CozyHome,
  Desert,
  Fishing,
  Flower,
  Kitchen,
  ModernHome,
  Nature,
  Ocean,
  Patio,
  Plant,
  SanFrancisco,
];

let imageElements = new Map();

const getImage = (index: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (imageElements.has(index)) {
      return resolve(imageElements.get(index));
    }
    const img = new Image();
    img.onload = () => {
      imageElements.set(index, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = rawImagePaths[index];
  });
};

export const backgroundConfig = {
  imageNames,
  images,
};

const virtualBackgroundAssets = '/virtualbackground';
let blurProcessor: GaussianBlurBackgroundProcessor;
let virtualBackgroundProcessor: VirtualBackgroundProcessor;

export default function useBackgroundSettings(videoTrack: LocalVideoTrack | undefined, room?: Room | null) {
  const [backgroundSettings, setBackgroundSettings] = useLocalStorageState<BackgroundSettings>(
    SELECTED_BACKGROUND_SETTINGS_KEY,
    { type: 'none', index: 0 }
  );

  const removeProcessor = useCallback(() => {
    if (videoTrack && videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
  }, [videoTrack]);

  const addProcessor = useCallback(
    (processor: GaussianBlurBackgroundProcessor | VirtualBackgroundProcessor) => {
      if (!videoTrack || videoTrack.processor === processor) {
        return;
      }
      removeProcessor();
      videoTrack.addProcessor(processor);
    },
    [videoTrack, removeProcessor]
  );

  useEffect(() => {
    if (!isSupported) {
      return;
    }
    // make sure localParticipant has joined room before applying video processors
    // this ensures that the video processors are not applied on the LocalVideoPreview
    const handleProcessorChange = async () => {
      if (!blurProcessor) {
        blurProcessor = new GaussianBlurBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
        });
        await blurProcessor.loadModel();
      }
      if (!virtualBackgroundProcessor) {
        virtualBackgroundProcessor = new VirtualBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
          backgroundImage: await getImage(0),
          fitType: ImageFit.Cover,
        });
        await virtualBackgroundProcessor.loadModel();
      }
      if (!room?.localParticipant) {
        return;
      }

      if (backgroundSettings.type === 'blur') {
        addProcessor(blurProcessor);
      } else if (backgroundSettings.type === 'image' && typeof backgroundSettings.index === 'number') {
        virtualBackgroundProcessor.backgroundImage = await getImage(backgroundSettings.index);
        addProcessor(virtualBackgroundProcessor);
      } else {
        removeProcessor();
      }
    };
    handleProcessorChange();
  }, [backgroundSettings, videoTrack, room, addProcessor, removeProcessor]);

  return [backgroundSettings, setBackgroundSettings] as const;
}
