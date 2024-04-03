const insertOne = (table, params) => {
    const data = table.create({
        data: params
    });
    return data;
};

const insertMany = (table, params) => {
    const data = table.createMany({
        data: params,
        skipDuplicates : true
    });
    return data;
};

const findMany = (table, params) => {
    let data;
    if(params.where){
        data = table.findMany({
            where : params.where,
            take: params.take,
            skip: params.skip,
            orderBy: params.orderBy,
            include: params.include,
            select: params.select
        });
        return data;
    }
    data = table.findMany();
    return data;
};

const findUnique = (table, params) => {
    let data;
    if(params.select){
        data = table.findUnique({
            where: params.where,
            select: params.select
        });
        return data;
    }
    data = table.findUnique({
        where: params
    });
    return data;
};

const findFirst = (table, params) => {
    let data;
    if(params.select){
        data = table.findFirst({
            where: params.where,
            select: params.select
        });
        return data;
    }
    data = table.findFirst(params);
    return data;
};

const updateOne = (table, params) => {
    const data = table.update({
        where: {
            id: params.id
        },
        data: params.updateData
    });
    return data;
};

const updateMany = (table, params) => {
    const data = table.updateMany({
        where: params.where,
        data: params.updateData
    });
    return data;
};

const deleteMany = (table, params) => {
    const data = table.deleteMany({
        where: params.where
    });

    return data;
};

const deleteOne = (table, params) => {
    const data = table.delete({
        where : params.where
    });

    return data;
};

export { 
    insertOne,
    insertMany,
    findMany,
    findUnique,
    findFirst,
    updateOne,
    updateMany,
    deleteMany,
    deleteOne
};