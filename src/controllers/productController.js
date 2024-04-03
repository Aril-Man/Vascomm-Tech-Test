import { findFirst, insertOne, updateOne } from "../repository/baseRepository.js";
import {
    getLink,
    getSomeProperties
} from "../utils/objectUtil.js";
import {
    paginateData
} from "../utils/paginationData.js";
import {
    tbl_product,
    tbl_user
} from "../utils/prismaSchema.js"
import {
    parsePaginationToQueryParams
} from "../utils/queryUtil.js";

const getProducts = async (req, res) => {

    try {
        const query = req.query;
        let params;
        req.query.page = req.query.page && req.query.page !== '' ? parseInt(req.query.page) : 1;
        req.query.take = req.query.take && req.query.take !== '' ? parseInt(req.query.take) : 10;
        const {
            take,
            skip
        } = parsePaginationToQueryParams(req.query);

        let data;

        if (query) {
            const search = req.query.search || req.query.search !== '' ? req.query.search : undefined;

            params = {
                where: {
                    name: {
                        contains: search
                    },
                    is_delete : false
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                },
                take,
                skip,
            };

            data = await tbl_product.findMany(params);
        }

        const total = await tbl_product.count({
            where: params.where
        });

        const link = getLink(req);
        const queryParams = getSomeProperties(req.query, ['page', 'take', 'search']);
        let resultData = paginateData(queryParams, data, req.query.page, total, req.query.take, link, skip);

        return res.jsond(200, 'Success', 'Success', resultData);

    } catch (error) {
        console.log(error);
        return res.jsond(500, false, 'Internal Server Error');
    }
}

const storeProduct = async (req, res) => {
    const body = req.body;
    try {
        
        if (body.name === "" || body.name === undefined || body.price === undefined) return res.jsond(400, false, 'Invalid required field');
        if (body.user_role !== "admin" || body.user_status !== "active") return res.jsond(400, false, 'Failed to create product');

        let paylaod = {
            name : body.name,
            price: body.price,
        }

        let createProduct = await insertOne(tbl_product, paylaod);
        return res.jsond(200, 'success', 'successfully store user', createProduct);

    } catch (error) {
        console.log(error);
        return res.jsond(500, false, 'Internal Server Error');
    }
}

const updateProduct = async (req, res) => {
    const body = req.body;
    const id = parseInt(req.params.id);
    try {
        if (body.user_role !== "admin" || body.user_status !== "active") return res.jsond(400, false, 'Failed to update product');
        
        let existing = await findFirst(tbl_product, {
            where : { id: id }
        })

        if (existing === null) return res.jsond(404, false, 'Product not found');

        let update = await updateOne(tbl_product, {
            id : id,
            updateData : {
                name : body.name == undefined ? existing.name : body.name,
                price : body.price == undefined ? existing.price : body.price,
            }
        })

        return res.jsond(200, 'success', 'successfully update product', update);

    } catch (error) {
        console.log(error);
        return res.jsond(500, false, 'Internal Server Error');
    }
}

const softDelete = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        
        let existing = await findFirst(tbl_product, {
            where : { id: id }
        })

        if (existing === null) return res.jsond(404, false, 'Product not found');

        await updateOne(tbl_product, {
            id : id,
            updateData : {
                is_delete : true
            }
        })

        return res.jsond(200, 'success', 'successfully delete product');

    } catch (error) {
        console.log(error);
        return res.jsond(500, false, 'Internal Server Error');
    }
}

export {
    getProducts,
    storeProduct,
    updateProduct,
    softDelete,
}