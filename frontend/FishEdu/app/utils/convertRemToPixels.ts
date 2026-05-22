const convertRemToPixels = (remValue: number, rootFontSize: number = 16): number => {
    return remValue * rootFontSize;
}

export default convertRemToPixels;
