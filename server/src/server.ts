import express from 'express';
import cors from 'cors';
import {PrismaClient} from '@prisma/client';
import { convertHourStringToMinute } from './utils/convert-hour-string-to-minutes';
import { convertMinuteToHourString } from './utils/convert-minutes-to-hours-string';

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get('/games', async (request, response) => { 
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  });

  return response.json(games);
})

app.post('/games/:id/ads', async(request, response) => {
  const gameId = request.params.id;
  const {
    name,
    yearsPlaying,
    discord,
    weekDays,
    hourStart,
    hourEnd,
    useVoiceChannel
  } = request.body;

  const gameCreated = await prisma.ad.create({
    data: {
      gameId,
      name,
      yearsPlaying,
      discord,
      weekDays: weekDays.join(','),
      hourStart: convertHourStringToMinute(hourStart),
      hourEnd: convertHourStringToMinute(hourEnd),
      useVoiceChannel
    }
  })
  return response.status(200).json(gameCreated);
})

app.get('/games/:id/ads', async(request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    where: {
      gameId
    },
    select: {
      id: true,
      name: true,
      hourStart: true,
      hourEnd: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      weekDays: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return response.json(ads.map((ad) => (
    {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinuteToHourString(ad.hourStart),
      hourEnd: convertMinuteToHourString(ad.hourEnd),
    }
  )));
});

app.get('/ads/:id/discord', async(request, response) => {
  const adId = request.params.id;
  
  const discord = await prisma.ad.findUniqueOrThrow({
    where: {
      id: adId,
    },
    select: {
      discord: true,
    }
  })

  return response.json(discord);
});

app.listen(3333)