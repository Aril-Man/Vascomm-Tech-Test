const parsePaginationToQueryParams = ({page, take}) => {
    const skip = page ? parseInt(page) - 1 : 0;
    return {
        take: parseInt(take),
        skip:  skip * parseInt(take),
    };
};

export {
    parsePaginationToQueryParams
};