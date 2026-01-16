export default class ImageLoader {
    get(imgUrl, callback) {
        const img = new Image();
        img.src = imgUrl;
        const properties = {
            url: imgUrl,
            height: img.height,
            width: img.width,
            ratio: img.width / img.height
        };
        img.onload = function () {
            callback(properties);
        };
        return properties;
    }
}