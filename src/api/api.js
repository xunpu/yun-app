import {
    http
} from "@/api/http";
import {
    API_URL
} from '@/api/config';

const API_PATH = API_URL;
// const FILE_LIST = '/files';
const FILE_LIST = '/v1/fs/ls';
const CARD_LIST = '/v1/card/ls';
const ARTICLE_LIST = '/v1/article/ls';
const IMAGE_LIST = '/v1/fs/ls';
const IMAGE_VIEW = '/v1/fs/view';
const AVATAR_PATH = '/account/pre/avatar';
const UPLOAD_FILE_PATH = `${API_PATH}/v1/fs/upload`;
const IMAGE_URL = `${API_PATH}${IMAGE_VIEW}`;
const DOWNLOAD_URL = `${API_PATH}${IMAGE_VIEW}`;

export {
    API_PATH,
    FILE_LIST,
    CARD_LIST,
    ARTICLE_LIST,
    IMAGE_LIST,
    IMAGE_VIEW,
    AVATAR_PATH,
    UPLOAD_FILE_PATH,
    IMAGE_URL,
    DOWNLOAD_URL
}

export const getFiles = function () {
    return http.post(FILE_LIST)
}

export const getCards = function (params) {
    return http.post(`${CARD_LIST}?p=1`, params)
}

export const getArticle = function (params) {
    return http.post(`${ARTICLE_LIST}?p=1`, params)
}

export const getImages = function (params) {
    return http.post(`${IMAGE_LIST}?p=1`, params)
}

// 用户
export const login = function (params) {
    return http.post('/account/login', params)
}

export const register = function (params) {
    return http.post('/account/register', params)
}

export function logout(params) {
    return http.post('/account/logout', params)
}

export const getCaptcha = function (params) {
    if (params && params['assert']) {
        return http.post('/account/pre/captcha/assert')
    } else {
        return http.post('/account/pre/captcha')
    }
}

export const getPasswdSalt = function (params) {
    return http.post('/account/pre/salt/' + params['phone'])
}

export const modifyPasswd = function (params) {
    return http.post('/account/modify', params)
}


// 文件
export const mkdir = function (params) {
    return http.post('/v1/fs/mkdir', params)
}

export const rename = function (params) {
    return http.post('/v1/fs/rename', params)
}

export const remove = function (params) {
    return http.post('/v1/fs/remove', params)
}

export const move = function (params) {
    return http.post('/v1/fs/move', params)
}

// 卡片
export const createCard = function (params) {
    return http.post('/v1/card/create', params)
}

export const viewCard = function (params) {
    return http.post('/v1/card/view', params)
}

export const modifyCard = function (params) {
    return http.post('/v1/card/modify', params)
}

export const listCard = function (params) {
    return http.post('/v1/card/ls', params)
}

// 文章
export const createArticle = function (params) {
    return http.post('/v1/article/create', params)
}

export const viewArticle = function (params) {
    return http.post('/v1/article/view', params)
}

export const modifyArticle = function (params) {
    return http.post('/v1/article/modify', params)
}

export const listArticle = function (params) {
    return http.post('/v1/article/ls', params)
}