/**
 * Absolute URL for a contact's avatar, or undefined when there is none.
 *
 * Strapi 5 returns `avatar: []` (truthy!) when the multiple-media field is
 * empty — so `avatar[0].url` throws "Cannot read properties of undefined
 * (reading 'url')". Older rows can also be `null`. Every avatar read must go
 * through this guard.
 */
export const contactAvatarSrc = (
  avatar: Array<{ url?: string } | null> | null | undefined
): string | undefined => {
  const path = avatar?.[0]?.url;
  return path ? `${import.meta.env.VITE_API_ENDPOINT}${path}` : undefined;
};

export default contactAvatarSrc;
