import { getEvents } from "./guilded";

export interface Env {
	BOT_TOKEN: string;
}

/**
 * Creates a failed object
 * @param status error status
 * @param data error message
 */
export function fail(status: number, data: string) {
	return JSON.stringify({ code: status, message: data });
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const { searchParams } = new URL(request.url)

		const event_id = searchParams.get('event_id')
		if (!event_id) return new Response(fail(400, 'event_id parameter is missing.'))

		const format = searchParams.get('format') || 'json'
		if (format !== 'json' && format !== 'bson') return new Response(fail(400, 'format parameter is invalid.'))

		const limit = parseInt(searchParams.get('limit') || '25')
		if (!limit) return new Response(fail(400, 'limit parameter is invalid.'))
		if (limit <= 0 || limit > 500) return new Response(fail(400, 'limit parameter is invalid (default 25; min 1; max 500).'))

		const data = await getEvents(event_id, env.BOT_TOKEN, limit, format)

		return new Response(JSON.stringify(data));
	},
};
