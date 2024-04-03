import { findFirst, insertOne, updateOne } from "../repository/baseRepository.js";
import {
    getLink,
    getSomeProperties
} from "../utils/objectUtil.js";
import {
    paginateData
} from "../utils/paginationData.js";
import {
    tbl_user
} from "../utils/prismaSchema.js"
import {
    parsePaginationToQueryParams
} from "../utils/queryUtil.js";

const getUsers = async (req, res) => {

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
            const status = req.query.status || req.query.status !== '' ? req.query.status : undefined;

            params = {
                where: {
                    name: {
                        contains: search
                    },
                    status : status,
                    is_delete : false
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                },
                take,
                skip,
            };

            data = await tbl_user.findMany(params);
        }

        const total = await tbl_user.count({
            where: params.where
        });

        const link = getLink(req);
        const queryParams = getSomeProperties(req.query, ['page', 'take', 'search', 'status']);
        let resultData = paginateData(queryParams, data, req.query.page, total, req.query.take, link, skip);

        return res.jsond(200, 'Success', 'Success', resultData);

    } catch (error) {
        console.log(error);
        return res.jsond(500, false, 'Internal Server Error');
    }
}

const storeUser = async (req, res) => {
    const body = req.body;
    try {
        
        if (body.email === undefined || body.email === "" || body.name === "" || body.name === undefined || body.role === "" || body.role === undefined) return res.jsond(400, false, 'Invalid required field');
        if (body.user_role !== "admin" || body.user_status !== "active") return res.jsond(400, false, 'Failed to create user');

        let paylaod = {
            name : body.name,
            email: body.email,
            role : body.role,
            status : 'active'
        }

        let createUser = await insertOne(tbl_user, paylaod);
        return res.jsond(200, 'success', 'successfully store user', createUser);

    } catch (error) {
        console.log(error);
        return res.jsond(500, false, 'Internal Server Error');
    }
}

const updateUser = async (req, res) => {
    const body = req.body;
    const id = parseInt(req.params.id);
    try {
        if (body.user_role !== "admin" || body.user_status !== "active") return res.jsond(400, false, 'Failed to update user');
        
        let existing = await findFirst(tbl_user, {
            where : { id: id }
        })

        if (existing === null) return res.jsond(404, false, 'User not found');

        let update = await updateOne(tbl_user, {
            id : id,
            updateData : {
                name : body.name == undefined ? existing.name : body.name,
                email : body.email == undefined ? existing.email : body.email,
                role : body.role == undefined ? existing.role : body.role,
            }
        })

        return res.jsond(200, 'success', 'successfully update user', update);

    } catch (error) {
        console.log(error);
        return res.jsond(500, false, 'Internal Server Error');
    }
}

const softDelete = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        
        let existing = await findFirst(tbl_user, {
            where : { id: id }
        })

        if (existing === null) return res.jsond(404, false, 'User not found');

        await updateOne(tbl_user, {
            id : id,
            updateData : {
                is_delete : true
            }
        })

        return res.jsond(200, 'success', 'successfully delete user');

    } catch (error) {
        console.log(error);
        return res.jsond(500, false, 'Internal Server Error');
    }
}

export {
    getUsers,
    storeUser,
    updateUser,
    softDelete,
}