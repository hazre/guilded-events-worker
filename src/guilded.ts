import { decode } from './decode';

export interface CalendarEvent {
  id: number;
  serverId: string;
  channelId: string;
  name: string;
  description: string;
  location: string;
  url: string;
  duration: number;
  color: number;
  startsAt: string;
  createdAt: string;
  createdBy: string;
}

function generateUniqueString(seed: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    const index = Math.floor(Math.abs(Math.sin(seed + i)) * chars.length) % chars.length;
    result += chars.charAt(index);
  }
  return result;
}

export async function getEvents(channelId: string, accessToken: string, limit: number, format: string) {
  const url = `https://www.guilded.gg/api/v1/channels/${channelId}/events?limit=${limit}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    'Content-type': 'application/json',
  };

  return fetch(url, { headers })
    .then(async (response: Response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      const ResObj: { calendarEvents: CalendarEvent[] } | undefined = await response.json();
      if (!ResObj) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      return ResObj;
    })
    .then((data) => {
      const latestStartsAt = data.calendarEvents.reduce((latest, event) => {
        const startsAtTimestamp = new Date(event.createdAt).getTime();
        return startsAtTimestamp > latest ? startsAtTimestamp : latest;
      }, 0);

      if (format == 'bson') {
        const calendarEvents = data.calendarEvents.reduce((result, event: CalendarEvent) => {
          // @ts-ignore
          result[generateUniqueString(event.id)] = {
            DT: decode(event.startsAt),
            T1: event.name,
            T2: event.description,
          };
          return result;
        }, {});

        return JSON.stringify({
          Meta: {
            Name: 'VRCrew',
            Desc: '',
            Color: '',
            LastEdited: new Date(latestStartsAt),
          },
          Events: calendarEvents,
        });
      }
      const calendarEvents = data.calendarEvents.map((event: CalendarEvent) => ({
        name: event.name,
        description: event.description,
        startsAt: event.startsAt,
        createdAt: event.createdAt,
      }));

      return { calendarEvents, editedAt: new Date(latestStartsAt) };
    })
    .catch((error) => {
      console.error(`Error fetching events: ${error.message}`);
      throw error;
    });
}
