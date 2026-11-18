import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export async function GET(context) {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	const site = context.site ?? new URL('https://jqu2011.github.io');

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: new URL(`${base}/`, site),
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: new URL(`${base}/blog/${post.id}/`, site).toString(),
		})),
	});
}
