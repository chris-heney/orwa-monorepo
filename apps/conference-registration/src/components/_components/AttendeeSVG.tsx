
interface AttendeeSVGProps {
  active?: boolean
}
const AttendeeSVG = ({ active }: AttendeeSVGProps) =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    version="1.1" x="0px" y="0px" viewBox="0 0 100 100"
    fill={active ? 'lightgreen' : 'lightgray'}
    xmlSpace="preserve">
    <switch>
      <foreignObject requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/" x="0" y="0" width="200px" height="200px" />
      <g><path d="M50,19.3c4.6,0,8.3-3.8,8.3-8.4c0-4.6-3.7-8.4-8.3-8.4c-4.6,0-8.3,3.8-8.3,8.4C41.7,15.5,45.4,19.3,50,19.3" />
        <polygon points="53.7,23.4 46.3,23.4 50,39   " />
        <path d="M58.6,23.4h-3.8l-4,16.7h3.1c0.5,0,1,0.4,1,1v5.6c0,0.5-0.4,1-1,1h-7.7c-0.5,0-1-0.4-1-1V41c0-0.5,0.4-1,1-1h3.1l-4-16.7    
            h-3.8c-5.5,0-10,3.5-10,9.1v23.3c0,1.9,1.5,3.4,3.4,3.4c1.9,0,3.4-1.5,3.4-3.4v-20h1.7c0,0,0,53.4,0,57.1c0,2.5,2,4.6,4.6,4.6    c2.5,0,4.6-2.1,4.6-4.6V62.3h1.9v30.6c0,2.5,2.1,4.6,4.6,4.6c2.5,0,4.6-2.1,4.6-4.6V35.8h1.8v20c0,1.9,1.5,3.4,3.4,3.4    
            c1.9,0,3.4-1.5,3.4-3.4V32.4C68.6,26.9,64.1,23.4,58.6,23.4z"/></g>
    </switch>
  </svg>

export default AttendeeSVG
