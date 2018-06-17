(function () {
    this.ImageLoader = (function () {
        function ImageLoader() {
            this.get = function (imgUrl, callback) {
                return img = new Image, img.src = imgUrl, properties = {
                    url: imgUrl,
                    height: img.height,
                    width: img.width,
                    ratio: img.width / img.height
                }, img.onload = function () {
                    return callback(properties)
                }, properties
            }
        };
        return ImageLoader;
    })();
}).call(this);