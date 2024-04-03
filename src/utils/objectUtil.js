export const getSomeProperties = (obj, properties) => {
    const result = {};
    properties.forEach((element) => {
        if (obj[element]) result[element] = obj[element];
    });
    return result;
};

export const getLink = (req) => {
    return req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0];
};