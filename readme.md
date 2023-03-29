
# Get Guilded Events (Cloudflare worker)

This Cloudflare worker retrieves events from a specific event channel in a Guilded server that the bot is in.

This wasn't really made for public use, but I documented the api and it's very flexible, so it can be used for other means as well. 

## API Reference

#### Get events

```http
  GET /?event_id={event_id}
```

| Parameter | Type         | Required | Default | Description                                                        |
|-----------|--------------|----------|---------|--------------------------------------------------------------------|
| event_id  | uuid string  | Yes      |         | The ID of the event channel to retrieve events from.               |
| format    | json or bson | No       | JSON    | The format of the response. Can be "json" or "bson".               |
| limit     | 1 to 500     | No       | 25      | The maximum number of events to return. Must be between 1 and 500. |

> **Note**: 'bson' is a format that is intended to be used in the game NeosVR. Specifically made a for a special calender prefab facet, it shouldn't be used in other cases. (most likely it's going to be changed, so it's not hard coded)

#### Response Example

```json
{
  "calendarEvents": [
    {
      "name": "event1",
      "startsAt": "2023-03-29T10:00:00.000Z",
      "createdAt": "2023-03-29T09:50:13.551Z"
    },
    {
      "name": "event2",
      "description": "dasdas",
      "startsAt": "2023-03-30T03:30:00.000Z",
      "createdAt": "2023-03-29T03:23:42.603Z"
    },
    {
      "name": "event3",
      "startsAt": "2023-04-08T03:30:00.000Z",
      "createdAt": "2023-03-29T03:23:54.689Z"
    }
  ],
  "editedAt": "2023-03-29T09:50:13.551Z"
}
```
## Environment Variables

To run this project, you will need to add the following environment variables.

`BOT_Token` Your guilded bot token.