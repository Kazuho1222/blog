export function prevNextPost(
	allSlugs: Array<{ slug: string; title: string }>,
	currentSlug: string,
) {
	const numberOfPosts = allSlugs.length
	const index = allSlugs.findIndex(({ slug }) => slug === currentSlug)

	const prevPost =
		index + 1 === numberOfPosts ? { title: '', slug: '' } : allSlugs[index + 1]

	const nextPost = index === 0 ? { title: '', slug: '' } : allSlugs[index - 1]
	return [prevPost, nextPost]
}
