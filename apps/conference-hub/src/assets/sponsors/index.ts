/**
 * @description: This utility allows sponsors to easily be added to the page regardless of the file name or file type.  
 * It uses vite's import.meta.glob in combination with the vite-imagetools plugin to convert all images to a webp format.
 * The images importted can be loaded during the useEffect hook .then() update the state of the component.
 * @see https://vitejs.dev/guide/features.html#glob-import
 * @see http://npmjs.com/package/vite-imagetools
 * @example
 * import loadImages from '@/assets/sponsors'
 * loadImages(sponsors)
 * .then(images => {
 * console.log(images)
 * })
 */


const importAll = ( r: Record< string, () => Promise<{ default: string }>>
) => Promise.all(Object.keys(r).map(key => r[key]()))

const sponsors = import.meta.glob('./*.{png,jpg}', {
    query: {
        'format': 'webp',
        'quality': '75',
        'aspect' : '16:9',
        'h': '200',
        'w': '300'
    }
})

export default async () => {
    const modules = await importAll(sponsors as Record<string, () => Promise<{ default: string; }>>)
    return modules.map(module => module.default)
}