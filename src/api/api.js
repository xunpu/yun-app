import {
    http
} from "@/api/http";
import mock from "@/mock/mock";

const FILE_LIST = '/files';
const CARD_LIST = '/cards';
const IMAGE_LIST = '/images';
const ARTICLE_LIST = '/articles';

export {
    FILE_LIST,
    CARD_LIST,
    ARTICLE_LIST,
    IMAGE_LIST,
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