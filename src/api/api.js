import {
    http
} from "@/api/http";
import mock from "@/mock/mock";

// const FILE_LIST = '/files';
const FILE_LIST = '/v1/fs/ls';
const CARD_LIST = '/cards';
const IMAGE_LIST = '/images';
const ARTICLE_LIST = '/articles';
const AVATAR_PATH = '/account/pre/avatar';
const UPLOAD_FILE_PATH = '/api/api/v1/fs/upload';

export {
    FILE_LIST,
    CARD_LIST,
    ARTICLE_LIST,
    IMAGE_LIST,
    AVATAR_PATH,
    UPLOAD_FILE_PATH
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

export const login = function (params) {
    return http.post('/account/login', params)
}

export const register = function (params) {
    return http.post('/account/register', params)
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
