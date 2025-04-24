export const setTitleAndDescriptions = (title, desc, _type, _page_url, _img_url) => {
    document.title = title
    const headData = document.head.children;
    for (let i = 0; i < headData.length; i++) {
        const nameVal = headData[i].getAttribute('name');
        if (nameVal !== null) {
            if (nameVal.indexOf('description') !== -1) {
                headData[i].setAttribute('content', desc);
            } else if (nameVal.indexOf('twitter:title') !== -1 ) {
                headData[i].setAttribute('content', title)
            } else if (nameVal.indexOf('twitter:description') !== -1 ) {
                headData[i].setAttribute('content', desc)
            } else if (nameVal.indexOf('twitter:image') !== -1 ) {
                headData[i].setAttribute('content', "https://tools.itc-app.site" + _img_url)
            } else if (nameVal.indexOf('twitter:text:title') !== -1 ) {
                headData[i].setAttribute('content', title)
            }
        }
        //OGPの設定
        const propertyVal = headData[i].getAttribute('property');
        if (propertyVal !== null ) {
            if (propertyVal.indexOf('og:type') !== -1 ) {
                headData[i].setAttribute('content', _type)
            } else if (propertyVal.indexOf('og:title') !== -1 ) {
                headData[i].setAttribute('content', title)
            } else if (propertyVal.indexOf('og:description') !== -1 ) {
                headData[i].setAttribute('content', desc)
            } else if (propertyVal.indexOf('og:url') !== -1 ) {
                headData[i].setAttribute('content', _page_url)
            } else if (propertyVal.indexOf('og:image') !== -1 ) {
                headData[i].setAttribute('content', "https://tools.itc-app.site" + _img_url)
            }
        }
    }
}


    