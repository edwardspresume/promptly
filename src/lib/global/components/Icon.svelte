<script lang="ts">
    // The ID of the icon to display from the SVG sprite
    export let name: string;

    // The size of the icon in pixels
    export let size: number = 20;

    // The fill color of the icon
    export let fill: string = 'currentColor';

    // The root font size (used to convert pixels to rem units)
    const rootFontSize: number = 16;

    // The size of the icon in rem units
    const sizeInRem = size / rootFontSize;
</script>

<svg
    {fill}
    role="img"
    focusable="false"
    aria-hidden="true"
    width={`${sizeInRem}rem`}
    height={`${sizeInRem}rem`}
>
    <use xlink:href={`/icons-sprite.svg#${name}`} />
</svg>
